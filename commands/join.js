const strings = require("../strings.json");

module.exports.run = async (client, message, args) => {

    let voiceChannel = message.member.voice.channel;
    const serverQueue = queue.get(message.guild.id);
    
    if(!voiceChannel){return message.channel.send(strings.notInVocal)};
    if(!serverQueue){return message.channel.send(strings.cantLoop)};

    serverQueue.connection = await voiceChannel.join();
    return message.channel.send(strings.joinMsg)
    
}