const strings = require('../strings.json');
const utils = require('../utils');
const config = require('../../config.js');
const prefix = config.prefix;

const MAX_LEN = 1000;

module.exports = (client, message) => {
    if (message.content.indexOf(prefix) === 0) {
        if (message.author.id === client.user.id) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = client.commands.get(command);

        if (!cmd) return;

        utils.log(`[${message.author.tag} / ${message.author.id}] ${message.content.slice(0, MAX_LEN)}`);

        if (!config.allowed.includes(message.author.id) && config.allowed.length > 0) {
            message.channel.send(strings.permissionDenied);
            utils.log(`${message.author.tag} tried to run the command '${message.content.slice(0, MAX_LEN)}' but permission was not accepted`);
            return;
        }
        cmd.run(client, message, args);
    }
};
