const ytdl = require('ytdl-core');

const utils = require('../utils');
const queue = require('../queue.js');
const embeds = require('../embeds.js');
const { REQUIRE_USER_IN_VC } = require('../commands.js');

/**
 * @description Play a song with the provided link
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<string>} args args[0] must be a link, or args is the song name
 * @return {Promise<Message>} sent message
 */
module.exports.run = async (client, message, args) => {
    if (!args[0])
        throw new utils.FlagHelpError();

    utils.log('Looking for music details...');

    let FUrl = utils.isURL(args[0]) ? args[0] : await utils.getUrl(args);
    let voiceChannel = message.member.voice.channel;
    let serverQueue = queue.queueManager.getOrCreate(message, voiceChannel);

    const songInfo = await ytdl.getBasicInfo(FUrl);
    const song = {
        title: songInfo.videoDetails.title,
        duration: songInfo.videoDetails.lengthSeconds,
        url: FUrl,
        requestedBy: message.author,
        requestedChannel: message.channel
    };

    utils.log('Got music details, preparing the music to be played...');

    let playingNow = false;

    if (!serverQueue.isPlaying()) {
        serverQueue.songs.push(song);

        let connection = await voiceChannel.join();
        serverQueue.connection = connection;
        serverQueue.play();
        serverQueue.resume();
        playingNow = true;
    } else {
        serverQueue.songs.push(song);
        utils.log(`Added music to the queue : ${song.title}`);
    }

    if (!playingNow)
        return message.channel.send(embeds.songEmbed(song, 'Added to Queue'));
};

module.exports.names = ['play', 'p'];
module.exports.help = {
    desc: 'Add a song to the queue',
    syntax: '<youtube url | playlist | search query>'
};
module.exports.requirements = REQUIRE_USER_IN_VC;
