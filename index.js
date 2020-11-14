const Discord = require("discord.js-selfbot");
const client = new Discord.Client();
const fs = require('fs');
const Enmap = require('enmap');
const config = require(`./config`)
const utils = require('./utils')

utils.log("Logging in...")

global.queue = new Map();


client.commands = new Enmap();

var loaded = {
  events: [],
  commands: []
}
var promise = new Promise((resolve) => {
  fs.readdir('./events/', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
      if (!file.endsWith('.js')) return;
      const evt = require(`./events/${file}`);
      let evtName = file.split('.')[0];
      loaded.events.push(evtName)
      client.on(evtName, evt.bind(null, client));
    });
    resolve();
  })
})


fs.readdir('./commands/', async (err, files) => {
  if (err) return console.error;
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    let props = require(`./commands/${file}`);
    let cmdName = file.split('.')[0];
    loaded.commands.push(cmdName)
    client.commands.set(cmdName, props);
  });
  promise.then(() => {console.log(utils.showTable(loaded))}).catch(errors => {console.log('some errors here')})
});


client.login(config.token)