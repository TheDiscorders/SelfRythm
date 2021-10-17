const embeds = require('../embeds.js');
const utils = require('../utils');
const queue = require('../queue.js');

/**
 * @description Resume current song
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<string>} args Unused
 * @return {Promise<Message>} sent message
 */
module.exports.run = async (client, message, args) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(embeds.notInVoiceChannelEmbed());

    const serverQueue = queue.queueManager.get(message.guild.id);
    if (!serverQueue)
        return message.channel.send(embeds.songQueueEmpty());

    serverQueue.resume();

    utils.log(`Resumed music playback`);
    return message.channel.send(embeds.defaultEmbed().setDescription(`:play_pause: Playback resumed`));
};

module.exports.names = ['resume', 'unpause'];
module.exports.help = {
    desc: 'Resume playback',
    syntax: ''
};
