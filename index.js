const Discord = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const BotCommands = [];
const moment = require('moment');

const client = new Discord.Client();
const prefix = process.env.PREFIX;
// const MainTeextChannelID = process.env.MAIN_CHANNEL_ID;
moment.locale('ru');
BotCommands.push(
  {
    name: 'помощь',
    usage() { return `${process.env.PREFIX}${this.name}`; },
    desc: 'Показывает какие команды имеются у бота',
    func(message) {
      const helpEmbed = new Discord.RichEmbed()
        .setTitle('Команды бота')
        .setColor('#0099ff');
      for (let i = 0; i < BotCommands.length; i++) helpEmbed.addField(BotCommands[i].usage(), BotCommands[i].desc, false);
      message.channel.send(helpEmbed);
    },
  },
);
fs.readdir(`${__dirname}/commands`, (err, file) => {
  for (let i = 0; i < file.length; i++) {
    BotCommands.push(require(`./commands/${file[i]}`));
  }
});

const ChangeBotStatus = require('./runtime/ChangeBotStatus');
const UpdatePrivate = require('./runtime/UpdatePrivate');
const VoiceStateUpdate = require('./runtime/VoiceTimeCounter');
const MessageCounter = require('./runtime/MessageCounter');
const PingDetect = require('./runtime/Ping');
// FUNCTIONS
client.on('ready', () => {
  console.log('Ready');
  client.generateInvite().then((i) => console.log(i));
  setInterval(() => { ChangeBotStatus(client); UpdatePrivate(client); }, 60000);
});

client.on('voiceStateUpdate', (old, member) => { VoiceStateUpdate(old, member); });

client.on('message', (message) => {
  MessageCounter(message); // UPDATE OR REGISTER USER PROFILE
  PingDetect(message); // Bot answer if someone mentioned him
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = BotCommands.find((botcommand) => (botcommand.name === command));
  if (cmd) cmd.func(message, args, client);
});// допилить действия с игроками

client.login(process.env.TOKEN);
