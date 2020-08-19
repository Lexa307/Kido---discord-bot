const Discord = require('discord.js');
const pool = require('../DB/db');

const error = require('../runtime/Error');

const ShowInventory = (message) => {
  pool.query(`SELECT inventory,gifts,money FROM users WHERE id = '${message.author.id}' LIMIT 1`, (err, rows) => {
    if (!rows.length) return message.channel.send(error('У вас еще нет аккаунта'));
    const inv = JSON.parse(JSON.stringify(rows[0].inventory));
    const embed = new Discord.RichEmbed()
      .setTitle(`Инвентарь пользователя ${message.author.username}`);
    const entries = Object.entries(inv);
    for (let i = 0; i < entries.length; i++) {
      embed.addField(entries[i][0], entries[i][1]);
    }
    embed.addField('Подарки 🎁', rows[0].gifts, true)
      .addField('Валюта ⭐', rows[0].money, true)
      .setColor('#3212A0')
      .setFooter('.inventory');
    message.channel.send(embed);
  });
};
module.exports = {
  name: 'инвентарь',
  usage() { return `${process.env.PREFIX}${this.name}`; },
  desc: 'Показывает ваш инвентарь',
  func: ShowInventory,
};
