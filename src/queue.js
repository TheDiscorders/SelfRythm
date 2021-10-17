const config = require('../config.js');

/**
 * A queue for a specified server
 * Tracks current song, dispatcher, etc...
 * @author Bowserinator
 */
class ServerQueue {
    /**
     * Construct a server queue
     * @param {Message} message Message for the play command
     * @param {VoiceChannel} voiceChannel Voice channel to play in
     */
    constructor(message, voiceChannel) {
        this.server = message.guild.id;
        this.textchannel = message.channel;
        this.voiceChannel = voiceChannel;

        this.connection = null;
        this.dispatcher = null;

        this.songs = [];
        this.volume = 1;
        this.paused = false;
        this.loop = 'none'; // none | song | queue
        this.skipped = false;
    }

    kill() {

    }
}

/**
 * Queue manager
 * @author Bowserinator
 */
class QueueManager {
    constructor() {
        this._queues = {};
    }

    add(queue) {
        if (config.onlyOneVoiceChannel) {
            Object.values(this._queues).forEach(q => q.kill());
            this._queues = {};
        }

        if (this._queues[queue.server])
            return this._queues[queue.server];
        this._queues[queue.server] = queue;
        return queue;
    }

    remove(serverID) {
        if (this._queues[serverID])
            this._queues[serverID].kill();
        this._queues[serverID] = undefined;
    }

    get(serverID) {
        return this._queues[serverID];
    }
}

const queueManager = new QueueManager();

module.exports = { ServerQueue, queueManager };
