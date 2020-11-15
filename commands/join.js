const ytdl = require("ytdl-core");

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
    if(!serverQueue){return message.channel.send(strings.cantLoop)};

    utils.log(`Joined the channel : ${voiceChannel.name}`);


    if(serverQueue.voiceChannel.guild.id != voiceChannel.guild.id){utils.play(serverQueue.songs[0])

        const url = serverQueue.songs[0].url
        await serverQueue.connection.dispatcher.end();

        /* Get the songInfo (url, channel, song duration and more). We only focus on the audio for a faster process. */
        const songInfo = await ytdl.getBasicInfo(url);

        /* Puts in an object from the song title, duration in seconds, url and he person who requsted the song */
        const song = {
            title: songInfo.videoDetails.title,
            duration: songInfo.videoDetails.lengthSeconds,
            url: FUrl,
            requestedby: message.author.tag
        };

        const queueConstruct = {
            textchannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
            loop: false
        };

        /* Adds a queue filed with custom data with the 'queueConstruct' format to the global Map 'queue' defined in index.js */
        queue.set("queue", queueConstruct);

        /* Push the a song object (defined by 'const song =') filled with custom data into the list of songs in the queue added 2 lines above */
        queueConstruct.songs.push(song);

        queueConstruct.connection = await voiceChannel.join();

        utils.play(queueConstruct.songs[0]);

    } else {
        serverQueue.connection = await voiceChannel.join();
    }


    return message.channel.send(strings.joinMsg)

}

module.exports.names = {
    list: ["join", "j"]
};