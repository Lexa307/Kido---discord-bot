const Discord = require('discord.js');
const moment = require('moment');
const pool = require('../DB/db');
const error = require('../runtime/Error');

const ShowRole = (message) => {
  pool.query(`SELECT private FROM users WHERE id = '${message.author.id}' LIMIT 1`, (err, rows) => {
    if (!rows) return message.channel.send(error('Вы еще не зарегистрированы'));
    const roles = JSON.parse(JSON.stringify(rows[0].private));
    console.log(roles);
    const embed = new Discord.RichEmbed()
      .setTitle(`Личные роли пользователя ${message.author.username}`);
    let RoleArray = Object.entries(roles);
    if (!RoleArray.length) {// TODO: add chech for disabled roles
      embed.setDescription('Пользователь не имеет личных ролей');
    } else {
      for(let i =0; i < RoleArray.length; i++){
        let RoleStatusMessage = (RoleArray[i][1].active == "true") ? `Спадает **${moment(RoleArray[i][1].to).format('LLLL')}` : `Неактивна`;
        embed.addField(`Личная роль: ${message.guild.roles.get(RoleArray[i][1].name)}`, `${RoleStatusMessage}**`);
      }
    }
    embed.setColor('#3212A0');
    message.channel.send(embed);
  });
};
module.exports = {
  name: 'роли',
  usage() { return `${process.env.PREFIX}${this.name}`; },
  desc: 'Показывает ваши личные роли',
  func: ShowRole,
};
