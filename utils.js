const table = require("ascii-table");
const AsciiTable = require("ascii-table/ascii-table");
var search = require('youtube-search');
const config = require("./config.js");

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
        var table = new AsciiTable('Loaded content')
        table.setHeading("Events","Commands")
        for(let i=0; i<=Math.max(loaded.events.length, loaded.commands.length)-1; i++){
            table.addRow(loaded.events[i], loaded.commands[i])
        }
        return table.render()
    },
    getUrl: async function (words){
        stringOfWords = words.join(" ");
 
        var opts = {
            maxResults: 1,
            key: config.ytbApiKey
        };

        lookingOnYtb = new Promise(async (resolve, reject) => {
            await search(stringOfWords, opts, function(err, results) {
                if(err) return console.log(err);
                return resolve(results[0].link)
            });
        });

        let link = await lookingOnYtb;
        return link;

    }
    
}