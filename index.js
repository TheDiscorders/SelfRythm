const Discord = require('discord.js-selfbot');
const client = new Discord.Client();

const fs = require('fs');
const Enmap = require('enmap');

const utils = require('./src/utils');
let config = require('./config.js');

if (!process.env.TOKEN)
    try {
        require('./config.js');
    } catch (e) {
        console.error('No config file found, create it or use environnement variables.');
        process.exit(1);
    }
else {
    if (!process.env.PREFIX) process.env.PREFIX = '$';
    config = { 'token': process.env.TOKEN, 'prefix': process.env.PREFIX };
}
if (!process.env.ALLOWED)
    try {
        config.allowed = require('./allowed.json').allowed;
    } catch (e) {
        config.allowed = [];
    }
else
    config.allowed = process.env.ALLOWED;

client.login(config.token);

utils.log('Logging in...');

/* ----------------------------------------------- */

client.commands = new Enmap();

/* ----------------------------------------------- */

let loaded = { events: [], commands: [] };

let promise = new Promise(resolve => {
    fs.readdir('./src/events/', (err, files) => {
        if (err) return console.error;
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            const evt = require(`./src/events/${file}`);
            let evtName = file.split('.')[0];
            loaded.events.push(evtName);
            client.on(evtName, evt.bind(null, client));
        });
        resolve();
    });
});


fs.readdir('./src/commands/', async (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        let props = require(`./src/commands/${file}`);
        props.names.forEach(name => {
            client.commands.set(name, props);
        });
        let cmdName = file.split('.')[0];
        loaded.commands.push(cmdName);
    });
    promise.then(() => {
        utils.log(`Table of commands and events :\n${utils.showTable(loaded)}`);
    });
});


/* ----------------------------------------------- */
