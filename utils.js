const AsciiTable = require("ascii-table/ascii-table");
const YouTube = require("youtube-sr").default;
const ytdl = require("ytdl-core");
const { createAudioResource, createAudioPlayer, joinVoiceChannel } = require('@discordjs/voice');

module.exports = {

    /**
     * @description Sends logs to console and adds the date/time
     * @param content The content to log
     */
    isFloat: function(n) {
        return ((typeof n==='number')&&(n%1!==0));
    },
    log: function(content) {
        date_ob = new Date();
      
        date = date_ob.getDate().toString();
        month = date_ob.getMonth().toString();
        year = date_ob.getFullYear().toString();
      
        if(date.length === 1){date = "0" + date;};
        if(month.length === 1){month = "0" + month;};
        
        dmy = date + "/" + month + "/" + year;
      
        /* Gets hours, minutes and seconds */ 
        hms = date_ob.toLocaleTimeString();
      
        console.log(`[ ${dmy} | ${hms} ] ${content}`);
    },
    /**
     * @description Checks if the provided string is an url 
     * @param {String} url 
     */
    isURL: function (url) {
        if(!url) return false;
        var pattern = new RegExp('^(https?:\\/\\/)?'+
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
            '((\\d{1,3}\\.){3}\\d{1,3}))|' +
            'localhost' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
            '(\\?[;&a-z\\d%_.~+=-]*)?'+
            '(\\#[-a-z\\d_]*)?$', 'i');
        return pattern.test(url);
    },
    /**
     * @description Create an ascii-table shown in the console on startup with the loaded events & commands
     * @param {Object} loaded 
     */
    showTable: function(loaded){
        var table = new AsciiTable('Loading content...');
        table.setHeading("Commands","Events");
        for(let i=0; i<=Math.max(loaded.commands.length, loaded.events.length)-1; i++){
            table.addRow(loaded.commands[i], loaded.events[i]);
        };
        return table.render();
    },
    getUrl: async function (words){
        stringOfWords = words.join(" ");
        lookingOnYtb = new Promise(async (resolve) => {
            YouTube.search(stringOfWords, { limit: 1 })
                .then(result => {
                    resolve("https://www.youtube.com/watch?v=" + result[0].id);
                });
        });

        let link = await lookingOnYtb;
        return link;
    },
    play: function(song) {

        const utils = require("./utils");
        const serverQueue = queue.get("queue");

        if(!song){
            utils.log("No songs left in queue");
            serverQueue.connection.destroy();
            return queue.delete("queue");
        }

        utils.log(`Started playing the music : ${song.title}`)

        let resource = createAudioResource(ytdl(song.url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }), {inlineVolume: true});
    
        const player = createAudioPlayer();
        serverQueue.connection.subscribe(player);
    
        player.play(resource);

        player.addListener("stateChange", (oldOne, newOne) => {
            if (newOne.status == "idle") {
                if(serverQueue.songs[0]) utils.log(`Finished playing the music : ${serverQueue.songs[0].title}`);
                else utils.log(`Finished playing all musics, no more musics in the queue`);
                if(serverQueue.loop === false || serverQueue.skipped === true) serverQueue.songs.shift();
                if(serverQueue.skipped === true) serverQueue.skipped = false;
                utils.play(serverQueue.songs[0]);
            }
        });

        player.on('error', error => {
            console.log(error)
        });

        serverQueue.connection._state.subscription.player._state.resource.volume.setVolumeLogarithmic(serverQueue.volume / 5);
    },
    joinVChannel: function(voiceChannel) {
        return joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
    }
}