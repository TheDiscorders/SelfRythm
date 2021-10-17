const strings = require('../strings.json');
const utils = require('../utils');
const queue = require('../queue.js');

/**
 * @description Adjust the playback volume
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<string>} args args[0]: Volume as integer from 0 to 100
 * @return {Promise<Message>} sent message
 */
module.exports.run = async (client, message, args) => {
    const serverQueue = queue.queueManager.get(message.guild.id);

    if (!serverQueue) return message.channel.send(strings.nothingPlayingVolume);

    if (args.length > 1)
        return message.channel.send(strings.toMuchArgsVolume);
    if (args.length === 0)
        return message.channel.send(strings.noVolume);

    let floatVolume = parseFloat(args);

    if (!Number.isInteger(parseInt(args)) && utils.isFloat(floatVolume))
        return message.channel.send(strings.noNumber);

    if (args[0] > 10)
        return message.channel.send(strings.volumeTooHigh);
    if (!message.member.voice.channel)
        return message.channel.send(strings.notInVocal);

    message.channel.send(strings.volumeChanged.replace('VOLUME', args[0]));

    serverQueue.volume = floatVolume;
    return serverQueue.connection.dispatcher.setVolumeLogarithmic(floatVolume / 5);
};

module.exports.names = {
    list: ['volume', 'v']
};
