const utils = require("../utils")


module.exports.run = async (client, message, args) => {
    utils.log(`Clearing queue, command from ${message.guild.name}`);
    queue.delete("queue")
    message.channel.send('🧹 Queue cleared !')
}

module.exports.names = {
    list: ["clear"]
};