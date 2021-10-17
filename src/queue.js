const config = require('../config.js');
const utils = require('./utils.js');
const embeds = require('./embeds.js');

const ytdl = require('ytdl-core');

const LOOP_MODES = 'none,song,queue'.split(',');

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

        this.songs = [];
        this.volume = 100;
        this.paused = false;
        this.loop = 'none'; // in LOOP_MODES
        this.skipped = false;
    }

    /**
     * Play the current song in the queue
     * @return {*} The dispatcher
     */
    play() {
        const song = this.songs[0];
        if (!this.songs.length)
            return;

        song.requestedChannel.send(embeds.songEmbed(song, 'Now Playing'));

        utils.log(`Started playing the music : ${song.title}`);

        const dispatcher = this.connection.play(ytdl(song.url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }));

        dispatcher.on('finish', () => {
            if (this.songs[0])
                utils.log(`Finished playing the music : ${this.songs[0].title}`);
            else
                utils.log(`Finished playing all musics, no more musics in the queue`);

            if (this.loop !== 'song' || this.skipped === true) {
                // Not very efficent but t'was easy to implement
                let tmp = this.songs.shift();
                if (this.loop !== 'none')
                    this.songs.push(tmp);
            }
            if (this.skipped === true)
                this.skipped = false;
            this.play();
        });

        dispatcher.on('error', error => {
            console.log(error);
        });
        dispatcher.setVolumeLogarithmic(this.volume / utils.VOLUME_BASE_UNIT);

        return dispatcher;
    }

    /**
     * Stop the current song from playing
     */
    kill() {
        this.skipped = true;
        if (this.connection.dispatcher)
            this.connection.dispatcher.end();
    }

    /**
     * Stop current song from playing and
     * clear the queue
     */
    clear() {
        this.kill();
        this.songs = [];
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

    /**
     * Add a new server to the list of queues. If only one voice
     * channel is enabled in config adding a new queue of a different
     * server will clear all other queues. If there is already a queue
     * for the server THAT INSTANCE will be returned (not the one you
     * passed in!)
     *
     * Thus it's recommended you do queue = queueManager.add(queue);
     *
     * @param {ServerQueue} queue Queue to add
     * @return {ServerQueue} Queue instance
     */
    add(queue) {
        if (this._queues[queue.server])
            return this._queues[queue.server];
        if (config.onlyOneVoiceChannel) {
            Object.values(this._queues).filter(x => x).forEach(q => q.clear());
            this._queues = {};
        }
        this._queues[queue.server] = queue;
        return queue;
    }

    /**
     * Remove a queue by guild ID. Clears queue
     * if it exists.
     * @param {string} serverID guild ID
     */
    remove(serverID) {
        if (this._queues[serverID])
            this._queues[serverID].clear();
        this._queues[serverID] = undefined;
    }

    /**
     * Get a queue by server ID
     * @param {string} serverID guild ID
     * @return {ServerQueue}
     */
    get(serverID) {
        return this._queues[serverID];
    }
}

const queueManager = new QueueManager();

module.exports = { ServerQueue, queueManager, LOOP_MODES };
