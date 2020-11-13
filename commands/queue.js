const strings = require("../strings.json");

module.exports.run = async (client, message, args) => {

    const serverQueue = queue.get(message.guild.id);

    if(!serverQueue){return message.channel.send(strings.noSongsQueued)}

    queuetxt = "";
    
    for(let i=0;i<serverQueue.songs.length;i++){
        var minutes = Math.floor(serverQueue.songs[i].duration / 60);
        if(minutes.length === 1) minutes = "0" + minutes
        var seconds = serverQueue.songs[i].duration % 60;
        if(seconds.length === 1) seconds = "0" + seconds

        queuetxt += `\`\`${i+1}. (${minutes}:${seconds}) ${serverQueue.songs[i].title}\`\`\n`;
    };

    message.channel.send(strings.musicsQueued + "\n" + queuetxt);


}