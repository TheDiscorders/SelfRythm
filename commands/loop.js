const strings = require("../strings.json");

module.exports.run = async (client, message, args) => {

    const serverQueue = queue.get(message.guild.id);

    if(!serverQueue){return message.channel.send(strings.cantLoop)}

    if(queue.get(message.guild.id.loop) === "off") {
        queue.set(message.guild.id.loop, "on"); 
        message.channel.send(strings.loopOn.replace("SONG_TITLE", serverQueue.songs[0].title));
    } else {
        queue.set(message.guild.id.loop, "off"); 
        message.channel.send(strings.loopOff.replace("SONG_TITLE", serverQueue.songs[0].title));
    };

}