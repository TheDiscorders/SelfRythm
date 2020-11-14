/* Import modules */
const ytdl = require("ytdl-core");

/* Import files */
const strings = require("../strings.json");
const utils = require("../utils");

/** 
 * @description Play a song
 * @param {Discord.Guild} guild The guild to play the song on, as a
 * @param song The song to be played
 */

 /* Play function */

function play(guild, song) {

    /* Gets the map 'queue' defined in index.js and gets the branch managing the concerned guild */
    const serverQueue = queue.get(guild.id);

    /* Make the bot leave the channel if no songs are played, then delete the branch the branch managing the concerned guild */
    if(!song){
        serverQueue.voiceChannel.leave();
        return queue.delete(guild.id);
    }

    utils.log(`Started playing the music : ${song.title}`)

    /* Uses ytdl-core module to play the song.url corresponding to the first song of the list songs[] */
    /* Options filter, quality and highWaterMark are here for a better optimisation and to fix some bugs */
    const dispatcher = serverQueue.connection.play(ytdl(song.url), {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 5000
    })

    .on('finish', () => {

        if(serverQueue.songs[0]) utils.log(`Finished playing the music : ${serverQueue.songs[0].title}`)
        else utils.log(`Finished playing the music, no more musics in the queue`)

        /* Clear the first of element of songs if loop is equal to 'off' */
        if(serverQueue.loop === false) serverQueue.songs.shift();

        /* Plays the first element of songs */
        play(guild, serverQueue.songs[0]);

    })

    .on('error', error => {

        /* Logs errors with the log function from utils that add the date, hour, minute and second of the log */
        console.log(error)

    });
    
    /* Set default volume serverQueue.volume defined in queueConstruct */
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

}


/** 
 * @description Play a song with the provided link
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<String>}args args[0] must be a link
 */


/* Get the parameters 'client, message, args' from the message.js file handling the message event */
module.exports.run = async (client, message, args) => {

    /* Returns the message 'strings.noLink' defined in 'strings.json' in the channel where the command came from*/
    if(!args[0]) return message.channel.send(strings.noArgs);

    utils.log("Looking for music details...")

    /* Check if the argument provided is an URL with the function 'isURL' defined in 'utils.js' */
    if(utils.isURL(args[0])){

        /* If it is an URL put the variable FUrl (Final Url) to the first argument so the url */
        FUrl = args[0];

    } else {

        /* 
            If it isn't an URL put the variable FUrl to the Url returned by the function 'getUrl' defined in 'utils.js'
            that gets the url of the first youtube video found by the keywords provided in the args 
        */
        FUrl = await utils.getUrl(args)

    };

    /* Creates a variable containing the voice channel that the member who used the command is in */
    let voiceChannel = message.member.voice.channel; 

    /* Gets the branch of the Map 'queue' defined in 'index.js' corresponding the the discord server where the command has been used */
    const serverQueue = queue.get(message.guild.id);

    /* Get the songInfo (url, channel, song duration and more). We only focus on the audio for a faster process. */
    const songInfo = await ytdl.getBasicInfo(FUrl, {filter: "audioonly"});

    /* Puts in an object from the song title, duration in seconds, url and he person who requsted the song */
    const song = {
        title: songInfo.videoDetails.title,
        duration: songInfo.videoDetails.lengthSeconds,
        url: FUrl,
        requestedby: message.author.tag
    };

    utils.log("Got music details, preparing the music to be played...")

    /* Check if the server music queue doesn't exist */
    if(!serverQueue) {

        /* Creates a model for constructing a queue */
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
        queue.set(message.guild.id, queueConstruct);

        /* Push the a song object (defined by 'const song =') filled with custom data into the list of songs in the queue added 2 lines above */
        queueConstruct.songs.push(song);

        /* Checks if the user is in a voice channel */
        if (voiceChannel != null) { 

            /* 
                Send the message 'startedPlaying' defined in 'strings.json' and replace 'SONG_TITLE', present in 'strings.startedPlaying', by the  real song title 
                present in the song object. Does the same with 'url' and the url defined in the song object. It sends it in the channel where the command has been used.
            */
            message.channel.send(strings.startedPlaying.replace("SONG_TITLE", song.title).replace("url", song.url));

            /* Create the connection variable that contains the voice channel */
            var connection = await voiceChannel.join();

            /* Adds to the 'queueConstruct' defined earlier the 'connection' variable defined 2 lines above */
            queueConstruct.connection = connection;

            /* 
                Starts the 'play' function defined earlier with the specified parameters : the guild and the first song of the list of songs 
                in 'queueConstruct' (the queue model) that is located at queue.get(message.guild.id).
            
                The model is added earlier into the map then it's customized with custom data, being in a specific location it doesn't impact the model for the following songs.
            */
            play(message.guild, queueConstruct.songs[0]);

        } else {

            /* If no queue exists, deletes the branch of the implicated guild in the Map 'queue' defined in 'index.js' */
            queue.delete(message.guild.id);

            /* Then send the message 'notInVocal' defined in 'strings.json' in the channel where the message has been sent */
            return message.channel.send(strings.notInVocal);
        };
    } else {

        /* If the server music queue already exist just adds the new song object defined earlier at the end of the 'songs' list in the 'serverQueue' object located in the Map 'queue' */
        serverQueue.songs.push(song);

        utils.log(`Added music to the queue : ${song.title}`)

        /* 
            Send the message 'songAddedToQueue' defined in 'strings.json' and replace 'SONG_TITLE', present in 'strings.songAddedToQueue', by the  real song title 
            present in the song object. Does the same with 'url' and the url defined in the song object. It sends it in the channel where the command has been used.
        */
        return message.channel.send(strings.songAddedToQueue.replace("SONG_TITLE", song.title).replace("url", song.url));
    };

};