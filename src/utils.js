const AsciiTable = require('ascii-table/ascii-table');
const YouTube = require('youtube-sr').default;

class FlagHelpError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FlagHelpError';
    }
}

module.exports = {
    /**
     * @description Sends logs to console and adds the date/time
     * @param {*} n
     * @return {boolean} Is n a float?
     */
    isFloat: function(n) {
        return ((typeof n === 'number') && (n % 1 !== 0));
    },
    log: function(content) {
        let dateObj = new Date();

        let date = dateObj.getDate().toString();
        let month = dateObj.getMonth().toString();
        let year = dateObj.getFullYear().toString();

        if (date.length === 1) date = '0' + date;
        if (month.length === 1) month = '0' + month;

        let dmy = date + '/' + month + '/' + year;

        /* Gets hours, minutes and seconds */
        let hms = dateObj.toLocaleTimeString();

        console.log(`[ ${dmy} | ${hms} ] ${content}`);
    },

    /**
     * @description Checks if the provided string is an url
     * @param {string} url
     * @return {boolean} Is url?
     */
    isURL: function(url) {
        if (!url) return false;
        let pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))|' +
            'localhost' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return pattern.test(url);
    },

    /**
     * @description Create an ascii-table shown in the console on startup with the loaded events & commands
     * @param {object} loaded
     * @return {string} ASCII table
     */
    showTable: function(loaded) {
        let table = new AsciiTable('Loading content...');
        table.setHeading('Commands', 'Events');
        for (let i = 0; i <= Math.max(loaded.commands.length, loaded.events.length) - 1; i++)
            table.addRow(loaded.commands[i], loaded.events[i]);

        return table.render();
    },

    getUrl: async function(words) {
        let stringOfWords = words.join(' ');
        let lookingOnYtb = new Promise(resolve => {
            YouTube.search(stringOfWords, { limit: 1 })
                .then(result => {
                    resolve('https://www.youtube.com/watch?v=' + result[0].id);
                });
        });

        let link = await lookingOnYtb;
        return link;
    },

    FlagHelpError,

    VOLUME_BASE_UNIT: 100, // what is = 100% volume, note volume command assumes this is 100 (it uses a % sign)
    MAX_VOLUME: 200
};
