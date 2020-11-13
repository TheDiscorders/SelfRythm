const strings = require("../strings.json");
const ytdl = require("ytdl-core");
const utils = require("../utils");

/** 
 * @description Play a song
 * @param {Discord.Guild} guild The guild to play the song on, as a
 * @param song The song to be played
 */
function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if(!song){
        serverQueue.voiceChannel.leave();
        return queue.delete(guild.id);
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url))
    .on('finish', () => {
        if(queue.get(guild.id.loop) === "off") serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    })
    .on('error', errors => {
        utils.log(errors);
    });

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

}


/** 
 * @description Play a song with the provided link
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<String>}args args[0] must be a link
 */
module.exports.run = async (client, message, args) => {

    if(!args[0] || !utils.isURL(args[0])) return message.channel.send(strings.noLink);

    let voiceChannel = message.member.voice.channel; 

    const serverQueue = queue.get(message.guild.id);

    const songInfo = await ytdl.getInfo(args[0], {filter: "audioonly"});
    const song = {
        title: songInfo.videoDetails.title,
        url: args[0]
    }

    if(!serverQueue) {
        const queueConstruct = {
            textchannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(message.guild.id, queueConstruct)
        queueConstruct.songs.push(song)
        queue.set(message.guild.id.loop, "off");

        if (voiceChannel != null) { 
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            message.channel.send(strings.startedPlaying.replace("SONG_TITLE", song.title));
            play(message.guild, queueConstruct.songs[0]);
        } else {
            queue.delete(message.guild.id);
            return message.channel.send(strings.notInVocal);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(strings.songAddedToQueue.replace("SONG_TITLE", song.title));
    }

    
};

module.exports.help = {
    name: 'play'
};