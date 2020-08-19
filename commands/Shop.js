const Discord = require('discord.js');
const pool = require('../DB/db');

const guildid = process.env.GUILD_ID;
const ShowShop = (message, args, client) => {
  const embed = new Discord.RichEmbed()
    .setTitle('Магазин ролей')
    .setColor('#3212A0');
  pool.query('SELECT * FROM shop', (err, rows) => {
    if (!rows[0]) embed.setDescription('Ролей нет.');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      embed.addField(`[ ${row.itemid} ] ${row.item}`, `Цена: ${row.price}\nВы получите роль ${client.guilds.get(guildid).roles.get(row.id).name}`);
    }
    message.channel.send(embed);
  });
};
module.exports = {
  name: 'магазин',
  usage() { return `${process.env.PREFIX}${this.name}`; },
  desc: 'Смотрим что есть в магазине',
  func: ShowShop,
};
