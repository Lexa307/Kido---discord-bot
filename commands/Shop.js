const Discord = require('discord.js');
const pool = require('../DB/db');

const { PRICE } = process.env;
const ShowShop = (message) => {
  const embed = new Discord.RichEmbed()
    .setTitle('Магазин сервера')
    .setColor('#3212A0');
  pool.query('SELECT id, name, type, description, (SELECT price from shop WHERE item.id = itemid) as price FROM item;', (err, rows) => {
    if (!rows[0]) embed.setDescription('В магазине пока ничего нет!');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      embed.addField(`[ ${row.id} ] ${row.name}`, ` Тип: **${row.type}** \n Цена: **${row.price}** ${PRICE}\n Описание: **${row.description}**`);
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
