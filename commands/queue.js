const strings = require("../strings.json");
const utils = require("../utils");

/** 
 * @description Show the guild's song queue
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<String>}args useless here  
 */
module.exports.run = async (client, message, args) => {

    const serverQueue = queue.get("queue");

    if(!serverQueue){return message.channel.send(strings.noSongsQueued);};

    queuetxt = "";
    
    for(let i=0;i<serverQueue.songs.length;i++){
        var minutes = `${Math.floor(serverQueue.songs[i].duration / 60)}`;
        if(minutes.length === 1) minutes = "0" + minutes;
        var seconds = `${serverQueue.songs[i].duration % 60}`;
        if(seconds.length === 1) seconds = "0" + seconds;

        if(serverQueue.loop === true && i===0) { 
            queuetxt += `\`\`${i+1}. (${minutes}:${seconds}) 🔄 ${serverQueue.songs[i].title} requested by ${serverQueue.songs[i].requestedby}\`\`\n`;
        } else {
            queuetxt += `\`\`${i+1}. (${minutes}:${seconds}) ${serverQueue.songs[i].title} requested by ${serverQueue.songs[i].requestedby}\`\`\n`;
        }
    };

    utils.log("Showed music queue");
    return message.channel.send(strings.musicsQueued + "\n" + queuetxt);
}


module.exports.names = {
    list: ["queue", "q"]
};