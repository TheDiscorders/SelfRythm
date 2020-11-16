const strings = require("../strings.json");

module.exports.run = async (client, message, args) => {
    var earrapeOk = false
    if(args.length > 1) return message.channel.send(strings.toMuchArgsVolume);
    if(args.length === 0) return message.channel.send(strings.noVolume);
    if(!Number.isInteger(args[0]) && args!="earrape") return message.channel.send(strings.noNumber);
    if (args[0]=="earrape"){
        message.channel.send(strings.earrapeWarning)
        .then(async function (warning) {
             await warning.react('✅')
             const filter = (reaction, user) => {
                  return reaction.emoji.name == "✅" && user.id == message.author.id
             };
             
             const collector = warning.createReactionCollector(filter, { time: 15000 });
       
             collector.on('collect', (reaction, reactionCollector) => {
                serverQueue.volume = 100
                return serverQueue.connection.dispatcher.setVolumeLogarithmic(100 / 5);

             });
        });
    }
    else{
        if(args[0] > 10) return message.channel.send(strings.volumeToHigh);
        if(!message.member.voice.channel) return message.channel.send(strings.notInVocal);
    }
    const serverQueue = queue.get("queue");

    if(!serverQueue) return message.channel.send(strings.nothingPlayingVolume);

    if (args[0] != "earrape") message.channel.send(strings.volumeChanged.replace("VOLUME", args[0]));
    if (args[0] != "earrape") serverQueue.volume = args[0];

    if (args[0] != "earrape") return serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);

};

module.exports.names = {
    list: ["volume", "v"]
};