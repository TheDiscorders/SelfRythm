const strings = require("../strings.json");
const utils = require("../utils");

/** 
 * @description Stops the music and make the bot leave the channel
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<String>}args useless here  
 */
module.exports.run = async (client, message, args) => {

    let voiceChannel = message.member.voice.channel; 

    if (!voiceChannel) {return message.channel.send(strings.notInVocal);};

    const serverQueue = queue.get(message.guild.id);
    if(!serverQueue){return message.channel.send(strings.nothingPlaying);};

    serverQueue.songs = [];


    utils.log("Stopped playing music")

    serverQueue.connection.dispatcher.end();

    return message.channel.send(strings.musicStopped);

};

module.exports.names = {
    list: ["stop", "st"]
};