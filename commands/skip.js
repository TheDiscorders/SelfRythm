const strings = require("../strings.json");
const utils = require("../utils");

/** 
 * @description Skip the current song
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<String>}args useless here  
 */

module.exports.run = async (client, message, args) => {

    let voiceChannel = message.member.voice.channel; 

    if (!voiceChannel) {return message.channel.send(strings.notInVocal);};

    const serverQueue = queue.get("queue");
    if(!serverQueue){return message.channel.send(strings.nothingPlaying);};

    utils.log(`Skipped music : ${serverQueue.songs[0].title}`);

    serverQueue.skipped = true;
    serverQueue.connection.dispatcher.end();

    return message.channel.send(strings.musicSkipped);

};

module.exports.names = {
    list: ["skip", "s"]
};