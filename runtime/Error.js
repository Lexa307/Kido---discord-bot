const Discord = require(`discord.js`);
const error = desc => {
	return new Discord.RichEmbed().setColor("RED").setDescription(":x: "+desc);
}
module.exports = error;