const strings = require('../strings.json');
const utils = require('../utils');
const queue = require('../queue.js');

/**
 * @description Show the guild's song queue
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<string>} args Unused
 * @return {Promise<Message>} sent message
 */
module.exports.run = async (client, message, args) => {
    const serverQueue = queue.queueManager.get(message.guild.id);

    if (!serverQueue)
        return message.channel.send(strings.noSongsQueued);

    let queuetxt = '';

    for (let i = 0; i < serverQueue.songs.length; i++) {
        let minutes = `${Math.floor(serverQueue.songs[i].duration / 60)}`;
        if (minutes.length === 1)
            minutes = '0' + minutes;
        let seconds = `${serverQueue.songs[i].duration % 60}`;
        if (seconds.length === 1)
            seconds = '0' + seconds;

        if (serverQueue.loop === 'song' && i === 0)
            queuetxt += `\`\`${i + 1}. (${minutes}:${seconds}) 🔄 ${serverQueue.songs[i].title} requested by ${serverQueue.songs[i].requestedby}\`\`\n`;
        else
            queuetxt += `\`\`${i + 1}. (${minutes}:${seconds}) ${serverQueue.songs[i].title} requested by ${serverQueue.songs[i].requestedby}\`\`\n`;
    }

    utils.log('Showed music queue');
    return message.channel.send(strings.musicsQueued + '\n' + queuetxt);
};


module.exports.names = {
    list: ['queue', 'q']
};
