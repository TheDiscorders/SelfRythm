const AsciiTable = require("ascii-table/ascii-table");
const YouTube = require("youtube-sr");
const ytdl = require("ytdl-core");

module.exports = {

    /**
     * @description Sends logs to console and adds the date/time
     * @param content The content to log
     */
    log: function(content) {
        date_ob = new Date();
      
        date = date_ob.getDate().toString();
        month = date_ob.getMonth().toString();
        year = date_ob.getFullYear().toString();
      
        if(date.length === 1){
            date = "0" + date
        }
        if(month.length === 1){
            month = "0" + month
        }
        
        dmy = date + "/" + month + "/" + year
      
        /* Gets hours, minutes and seconds */ 
        hms = date_ob.toLocaleTimeString();
      
        console.log(`[ ${dmy} | ${hms} ] ${content}`)
    },
    /**
     * @description Checks if the provided string is an url 
     * @param {String} url 
     */
    isURL: function (url) {
        if(!url) return false;
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))|' + // OR ip (v4) address
            'localhost' + // OR localhost
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(url);
    },
    /**
     * @description Create an ascii-table shown in the console on startup with the loaded events & commands
     * @param {Object} loaded 
     */
    showTable: function(loaded){
        var table = new AsciiTable('Loading content...')
        table.setHeading("Commands","Events")
        for(let i=0; i<=Math.max(loaded.commands.length, loaded.events.length)-1; i++){
            table.addRow(loaded.commands[i], loaded.events[i])
        }
        return table.render()
    },
    getUrl: async function (words){
        stringOfWords = words.join(" ");

        lookingOnYtb = new Promise(async (resolve) => {
            YouTube.search(stringOfWords, { limit: 1 })
                .then(result => {
                    resolve("https://www.youtube.com/watch?v=" + result[0].id)
                })
        });

        let link = await lookingOnYtb;
        return link;

    },
    play: function(song) {

        const utils = require("./utils");

        /* Gets the map 'queue' defined in index.js and gets the branch managing the concerned guild */
        const serverQueue = queue.get("queue");
    
        /* Make the bot leave the channel if no songs are played, then delete the branch the branch managing the concerned guild */
        if(!song){
            utils.log("No songs left in queue")
            serverQueue.voiceChannel.leave();
            return queue.delete("queue");
        }
    
        utils.log(`Started playing the music : ${song.title}`)
    
        /* 
            Uses ytdl-core module to play the song.url corresponding to the first song of the list songs[]
            Options filter, quality and highWaterMark are here for a better optimisation and to fix some bugs 
        */
    
        const dispatcher = serverQueue.connection.play(ytdl(song.url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }));
    
        dispatcher.on('finish', () => {
    
            if(serverQueue.songs[0]) utils.log(`Finished playing the music : ${serverQueue.songs[0].title}`)
            else utils.log(`Finished playing the music, no more musics in the queue`)
    
            /* Clear the first of element of songs if loop is equal to 'off' */
            if(serverQueue.loop === false) serverQueue.songs.shift();
    
            /* Plays the first element of songs */
            utils.play(serverQueue.songs[0]);
    
        })
    
        dispatcher.on('error', error => {
    
            /* Logs errors with the log function from utils that add the date, hour, minute and second of the log */
            console.log(error)
    
        });
        
        /* Set default volume serverQueue.volume defined in queueConstruct */
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    
    }
    
}