const strings = require("../strings.json");
const utils = require("../utils");

/** 
 * @description Make the bot join the current voice channel the user is in
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<String>}args useless here  
 */
module.exports.run = async (client, message, args) => {

    let voiceChannel = message.member.voice.channel;
    const serverQueue = queue.get("queue");
    
    if(!voiceChannel){return message.channel.send(strings.notInVocal)};
    if(!serverQueue){return message.channel.send(strings.errorJoin)};

    utils.log(`Joined the channel : ${voiceChannel.name}`);


    if(serverQueue.voiceChannel.guild.id != voiceChannel.guild.id){utils.play(serverQueue.songs[0])

        songs = [];

        for(i=0;i<serverQueue.songs.length;i++){
            songs.push(serverQueue.songs[0]);
        };

        await serverQueue.connection.dispatcher.end();

        const queueConstruct = {
            textchannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: songs,
            volume: serverQueue.volume,
            playing: true,
            loop: serverQueue.loop,
            skipped: false
        };

        queue.set("queue", queueConstruct);

        queueConstruct.connection = await voiceChannel.join();

        utils.play(queueConstruct.songs[0]);

    } else {
        serverQueue.connection = await voiceChannel.join();
    }


    return message.channel.send(strings.joinMsg);

}

module.exports.names = {
    list: ["join", "j"]
};