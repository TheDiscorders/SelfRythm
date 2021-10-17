const embeds = require('../embeds.js');
const utils = require('../utils');
const queue = require('../queue.js');
const { REQUIRE_QUEUE_NON_EMPTY, REQUIRE_USER_IN_VC } = require('../commands.js');

/**
 * @description Pause current song
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<string>} args Unused
 * @return {Promise<Message>} sent message
 */
module.exports.run = async (client, message, args) => {
    const serverQueue = queue.queueManager.get(message.guild.id);
    serverQueue.pause();

    utils.log(`Paused music playback`);
    return message.channel.send(embeds.defaultEmbed().setDescription(`:pause_button: Playback paused`));
};

module.exports.names = ['pause', 'unresume'];
module.exports.help = {
    desc: 'Pause playback',
    syntax: ''
};
module.exports.requirements = REQUIRE_QUEUE_NON_EMPTY | REQUIRE_USER_IN_VC;
