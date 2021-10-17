const strings = require('../strings.json');
const utils = require('../utils');
const queue = require('../queue.js');

/**
 * @description Loop the current song
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<string>} args Unused
 * @return {Promise<Message>} sent message
 */
module.exports.run = async (client, message, args) => {
    const serverQueue = queue.queueManager.get(message.guild.id);

    if (!serverQueue) return message.channel.send(strings.cantLoop);

    if (serverQueue.loop === 'song') {
        serverQueue.loop = true;
        utils.log(`Started looping : ${serverQueue.songs[0].title}`);
        message.channel.send(strings.loopOn.replace('SONG_TITLE', serverQueue.songs[0].title));
    } else {
        serverQueue.loop = 'queue';
        utils.log(`Stopped looping : ${serverQueue.songs[0].title}`);
        message.channel.send(strings.loopOff.replace('SONG_TITLE', serverQueue.songs[0].title));
    }
};

module.exports.names = {
    list: ['loop', 'l']
};
