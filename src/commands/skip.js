const utils = require('../utils');
const embeds = require('../embeds.js');
const queue = require('../queue.js');

/**
 * @description Skip the current song
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
    if (!serverQueue || serverQueue.songs.length === 0)
        return message.channel.send(embeds.songQueueEmpty());

    utils.log(`Skipped music : ${serverQueue.songs[0].title}`);
    serverQueue.kill();

    return message.channel.send(embeds.defaultEmbed()
        .setTitle('Skipping')
        .setDescription(`${serverQueue.songs[0].title} [${message.author.toString()}]`));
};

module.exports.names = ['skip', 's'];
module.exports.help = {
    desc: 'Skip the current song',
    syntax: ''
};
