const strings = require('../strings.json');
const utils = require('../utils');
const queue = require('../queue.js');

/**
 * @description Make the bot join the current voice channel the user is in
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<string>} args Unused
 * @return {Promise<Message>} sent message
 */
module.exports.run = async (client, message, args) => {
    let voiceChannel = message.member.voice.channel;
    const serverQueue = queue.queueManager.get(message.guild.id);

    if (!voiceChannel)
        return message.channel.send(strings.notInVocal);
    if (!serverQueue)
        return message.channel.send(strings.errorJoin);

    utils.log(`Joined the channel : ${voiceChannel.name}`);

    // TODO: what does this do??
    if (serverQueue.voiceChannel.guild.id !== voiceChannel.guild.id) {
        utils.play(serverQueue.songs[0], serverQueue);

        let songs = [];
        for (let i = 0; i < serverQueue.songs.length; i++)
            songs.push(serverQueue.songs[0]);

        await serverQueue.connection.dispatcher.end();

        let queueConstruct = new queue.ServerQueue(message, voiceChannel);

        queueConstruct = queue.queueManager.add(queueConstruct);
        queueConstruct.connection = await voiceChannel.join();
        utils.play(queueConstruct.songs[0], serverQueue);
    } else
        serverQueue.connection = await voiceChannel.join();

    return message.channel.send(strings.joinMsg);
};

module.exports.names = {
    list: ['join', 'j']
};
