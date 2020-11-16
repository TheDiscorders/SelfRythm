const strings = require("../strings.json");

module.exports.run = async (client, message, args) => {

    const serverQueue = queue.get("queue");

    if(!serverQueue) return message.channel.send(strings.nothingPlayingVolume);

    if(args.length > 1) return message.channel.send(strings.toMuchArgsVolume);
    if(args.length === 0) return message.channel.send(strings.noVolume);

    intArg = parseInt(args[0]);

    if(!Number.isInteger(intArg) && args!="earrape") return message.channel.send(strings.noNumber);

    if (args[0] === "earrape"){

        message.channel.send(strings.earrapeWarning)
        .then(async function (warning) {

            await warning.react('✅');

            const filter = (reaction, user) => {
                return reaction.emoji.name == "✅" && user.id == message.author.id;
            };
             
            const collector = warning.createReactionCollector(filter, { max: 1, time: 8000 });
       
            collector.on('collect', () => {
                const oldVolume = serverQueue.volume;
                serverQueue.volume = 100;
                serverQueue.connection.dispatcher.setVolumeLogarithmic(100 / 5);
                message.channel.send(strings.startEarrape);
                setTimeout(function(){
                    message.channel.send(strings.endEarrape.replace("VOLUME", oldVolume));
                    return serverQueue.connection.dispatcher.setVolumeLogarithmic(oldVolume / 5);
                }, 7000);
            });

            collector.on(`end`, () => {
                if(collector.total === 0) return message.channel.send(strings.earrapeFail);
            });

        });
    } else {

        if(args[0] > 10) return message.channel.send(strings.volumeToHigh);
        if(!message.member.voice.channel) return message.channel.send(strings.notInVocal);
        message.channel.send(strings.volumeChanged.replace("VOLUME", args[0]));
        serverQueue.volume = intArg;
        return serverQueue.connection.dispatcher.setVolumeLogarithmic(intArg / 5);

    };
};

module.exports.names = {
    list: ["volume", "v"]
};