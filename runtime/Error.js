const Discord = require('discord.js');

const error = (desc) => new Discord.RichEmbed().setColor('RED').setDescription(`:x: ${desc}`);
module.exports = error;
