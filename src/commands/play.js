const ytdl = require('ytdl-core');

const utils = require('../utils');
const queue = require('../queue.js');
const embeds = require('../embeds.js');

/**
 * Send an embed for a song ("Now playing")
 * @param {Message} message Message of the command
 * @param {object} song Song obj
 * @return {*}
 */
function sendSongEmbed(message, song) {
    const songEmbed = embeds.defaultEmbed()
        .setTitle('Added to queue')
        .setDescription(`[${song.title}](${song.url}) [${message.author.toString()}]`)
        .setURL(song.url);
    return message.channel.send(songEmbed);
}

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
    let serverQueue = queue.queueManager.get(message.guild.id);

    const songInfo = await ytdl.getBasicInfo(FUrl);
    const song = {
        title: songInfo.videoDetails.title,
        duration: songInfo.videoDetails.lengthSeconds,
        url: FUrl,
        requestedby: message.author.tag
    };

    utils.log('Got music details, preparing the music to be played...');

    if (!serverQueue || serverQueue.songs.length === 0) {
        if (voiceChannel === null) {
            queue.queueManager.delete(message.guild.id);
            return message.channel.send(embeds.notInVoiceChannelEmbed());
        }

        serverQueue = new queue.ServerQueue(message, voiceChannel);
        serverQueue = queue.queueManager.add(serverQueue);
        serverQueue.songs.push(song);

        let connection = await voiceChannel.join();
        serverQueue.connection = connection;
        serverQueue.play();
    } else {
        if (voiceChannel === null)
            return message.channel.send(embeds.notInVoiceChannelEmbed());

        serverQueue.songs.push(song);
        utils.log(`Added music to the queue : ${song.title}`);
    }

    return sendSongEmbed(message, song);
};

module.exports.names = ['play', 'p'];
module.exports.help = {
    desc: 'Add a song to the queue',
    syntax: '<youtube url | playlist | search query>'
};