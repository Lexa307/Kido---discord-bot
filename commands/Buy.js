const pool = require('../DB/db');

const guildid = process.env.GUILD_ID;
const error = require('../runtime/Error');

const price = process.env.PRICE;
const Buy = (message, args, client) => {
  pool.query(`SELECT money, inventory FROM users WHERE id = '${message.author.id}' LIMIT 1`, (err1, rows) => {
    if (!rows[0]) return message.reply(error('У вас еще нет аккаунта'));
    const item = args.join(' ');
    if (!item) return message.reply(error('Не указано название товара'));
    pool.query(`SELECT (SELECT price from shop WHERE item.id = itemid) as price FROM item where name = '${item}';`, (err2, rows2) => {
      if (!rows2) return message.reply(error('Предмет не найден'));
      if (rows[0].money < rows2[0].price) return message.reply(error(`Недостаточно ${price} для покупки данного предмета`));
      let ItemInventoryCount = (JSON.parse( JSON.stringify( rows[0].inventory ) ));
      ItemInventoryCount = (ItemInventoryCount) ? ItemInventoryCount[ item ] : 0;
      if(!ItemInventoryCount) ItemInventoryCount = 0; 
      console.log(`UPDATE users SET inventory = JSON_SET(inventory, "$.${item}", ${ItemInventoryCount + 1}) where id = ${message.author.id} LIMIT 1`);
      pool.query(`UPDATE users SET money = ${rows[0].money - rows2[0].price} WHERE id = '${message.author.id}'`);
      pool.query(`UPDATE users SET inventory = JSON_SET(inventory, "$.${item}", ${ItemInventoryCount + 1}) where id = ${message.author.id} LIMIT 1`);
      message.reply(`Вы приобрели ${item}, проверьте свой инвентарь`);
    });
  });
};
module.exports = {
  name: 'купить',
  usage() { return `${process.env.PREFIX}${this.name} (shop_item)`; },
  desc: 'Покупка предмета в магазине, купленный предмет помещается вам в инвентарь',
  func: Buy,
};
