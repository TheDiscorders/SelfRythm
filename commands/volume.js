const strings = require("../strings.json");

module.exports.run = async (client, message, args) => {

    if(!args) {return message.channel.send(strings.noVolume);};
    if(args.length > 1) {return message.channel.send(strings.toMuchArgsVolume);};

    message.channel.send(strings.volumeChanged.replace("VOLUME", args[0]));
    return queue.get("queue").connection.dispatcher.setVolumeLogarithmic(args[0] / 5);

};


module.exports.names = {
    list: ["volume", "v"]
};