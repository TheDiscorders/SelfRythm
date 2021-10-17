const ytdl = require('ytdl-core');

const strings = require('../strings.json');
const utils = require('../utils');
const queue = require('../queue.js');

/**
 * @description Play a song with the provided link
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<string>} args args[0] must be a link, or args is the song name
 * @return {Promise<Message>} sent message
 */
module.exports.run = async (client, message, args) => {
    if (!args[0])
        return message.channel.send(strings.noArgsSongSearch);

    utils.log('Looking for music details...');

    let FUrl;

    if (utils.isURL(args[0]))
        FUrl = args[0];
    else
        FUrl = await utils.getUrl(args);

    let voiceChannel = message.member.voice.channel;

    let serverQueue = queue.queueManager.get(message.guild.id);
    const songInfo = await ytdl.getBasicInfo(FUrl);

    const song = {
        title: songInfo.videoDetails.title,
        duration: songInfo.videoDetails.lengthSeconds,
        url: FUrl,
        requestedby: message.author.tag
    };

    utils.log('Got music details, preparing the music to be played...');

    if (!serverQueue) {
        if (voiceChannel === null) {
            queue.queueManager.delete(message.guild.id);
            return message.channel.send(strings.notInVocal);
        }

        serverQueue = new queue.ServerQueue(message, voiceChannel);
        serverQueue = queue.queueManager.add(serverQueue);
        serverQueue.songs.push(song);

        message.channel.send(strings.startedPlaying.replace('SONG_TITLE', song.title).replace('url', song.url));

        let connection = await voiceChannel.join();
        serverQueue.connection = connection;
        serverQueue.dispatcher = utils.play(serverQueue.songs[0], serverQueue);
    } else {
        serverQueue.songs.push(song);
        utils.log(`Added music to the queue : ${song.title}`);

        return message.channel.send(strings.songAddedToQueue.replace('SONG_TITLE', song.title).replace('url', song.url));
    }
};

module.exports.names = {
    list: ['play', 'p']
};
