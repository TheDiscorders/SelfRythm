const utils = require("../utils")


module.exports.run = async (client, message, args) => {
    utils.log(`Clearing queue, command from ${message.guild.name}`);
    const serverQueue = queue.get("queue");
    if (serverQueue && serverQueue.songs) serverQueue.songs = [serverQueue.songs[0]]
    message.channel.send('🧹 Queue cleared !')
}

module.exports.names = {
    list: ["clear"]
};