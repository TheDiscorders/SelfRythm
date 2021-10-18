const utils = require('../utils');
const queue = require('../queue.js');

module.exports = async (oldVoiceState, newVoiceState) => {
    let serverQueue = queue.queueManager.get(newVoiceState.guild.id);
    if (serverQueue === undefined) return;

    let voiceChannel = serverQueue.voiceChannel;

    if (voiceChannel.members.size === 1)
        utils.inactivity.onAlone(serverQueue);
    else
        utils.inactivity.onPersonJoin();
};
