const Discord = require(`discord.js`);
require('dotenv').config();
const fs = require('fs');
const BotCommands = [];
const moment  = require("moment");
const client  = new Discord.Client();
const prefix  = process.env.PREFIX;
//const MainTeextChannelID = process.env.MAIN_CHANNEL_ID;
moment.locale("ru");
BotCommands.push(
	{
		name: "помощь",
		usage: function (){return `${process.env.PREFIX}${this.name}`},
		desc: "Показывает какие команды имеются у бота",
		func: function(message){
			const helpEmbed = new Discord.RichEmbed()
				.setTitle("Команды бота")
				.setColor('#0099ff');
			for(let i of BotCommands){
				helpEmbed.addField(i.usage(), i.desc, false);
			}
			message.channel.send(helpEmbed);
		}
	}
);
fs.readdir(`${__dirname}/commands`,(err,file)=>{
	for(let i of file) BotCommands.push(require(`./commands/${i}`))
});

const pool = require('./DB/db');
const ChangeBotStatus = require('./runtime/ChangeBotStatus');
const UpdatePrivate = require('./runtime/UpdatePrivate');
const VoiceStateUpdate = require('./runtime/VoiceTimeCounter');
// FUNCTIONS
client.on('ready', () => {
	console.log("Ready");
	client.generateInvite().then(i => console.log(i));
	setInterval(() => {ChangeBotStatus(client); UpdatePrivate(client);}, 60000);
})

client.on('voiceStateUpdate', (old, member) => {VoiceStateUpdate(old,member)});

client.on('message', message => {
	require('./runtime/MessageCounter')(message); // UPDATE OR REGISTER USER PROFILE
	require('./runtime/Ping')(message); //Bot answer if someone mentioned him
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	let cmd = BotCommands.find(botcommand => { return (botcommand.name === command)});
	if(cmd) cmd.func(message,args,client);

})//допилить действия с игроками

client.login(process.env.TOKEN);