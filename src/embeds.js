const { MessageEmbed } = require('discord.js-selfbot');
const config = require('../config.js');

// Default embed
const defaultEmbed = () => new MessageEmbed()
    .setColor()
    .setTimestamp();

// Error embeds
const errorEmbed = () => defaultEmbed().setColor(0xFF0000);

module.exports = {
    defaultEmbed,
    errorEmbed,

    notInVoiceChannelEmbed: () => errorEmbed().setTitle('You must be in a voice channel to do this'),
    songQueueEmpty: () => defaultEmbed().setDescription('The queue is empty'),

    helpEmbed: cmd => {
        let embed = defaultEmbed()
            .setDescription((cmd.help && cmd.help.desc) ? cmd.help.desc : 'No description provided')
            .setFooter(`Type ${config.prefix}list to list commands, or ${config.prefix}help <command> for more info on a given command`)
            .setTitle(config.prefix + cmd.names[0]);

        if (cmd.help && cmd.help.syntax)
            embed = embed.addField('Syntax', `\`${config.prefix}${cmd.names[0]} ${cmd.help.syntax}\``, true);
        embed = embed.addField('Aliases', cmd.names.join(', '), true);

        return embed;
    }
};
