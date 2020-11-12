const strings = require("../strings.json");

module.exports.run = async (client, message, args) => {

    let voiceChannel = message.member.voice.channel; 

    if (!voiceChannel) {return message.channel.send(strings.notInVocal);};

    const serverQueue = queue.get(message.guild.id);
    if(!serverQueue){return message.channel.send(strings.nothingPlaying);};

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    return message.channel.send(strings.musicStopped);

};

module.exports.help = {
    name: 'stop'
};