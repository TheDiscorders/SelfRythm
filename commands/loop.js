const strings = require("../strings.json");
/** 
 * @description Loop the current song
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<String>}args useless here  
 */
module.exports.run = async (client, message, args) => {

    const serverQueue = queue.get(message.guild.id);

    if(!serverQueue){return message.channel.send(strings.cantLoop)}

    if(queue.get(message.guild.id.loop) === "off") {
        queue.set(message.guild.id.loop, "on"); 
        message.channel.send(strings.loopOn.replace("SONG_TITLE", serverQueue.songs[0].title).replace("url", serverQueue.songs[0].url));
    } else {
        queue.set(message.guild.id.loop, "off"); 
        message.channel.send(strings.loopOff.replace("SONG_TITLE", serverQueue.songs[0].title).replace("url", serverQueue.songs[0].url));
    };

}