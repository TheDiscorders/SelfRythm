const strings = require("../strings.json")
module.exports.run = (client, message, args) => {
    let channel = message.member.voice.channel; if (channel != null)channel.join(); else message.channel.send(strings.notInVocal)
};

module.exports.help = {
    name: 'join'
};