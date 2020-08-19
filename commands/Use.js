const pool = require('../DB/db');
const error = require('../runtime/Error');

const USeItem = (message, args) => {
  const item = args.join(' ');
  if (!item) return message.channel.send(error('Не указан предмет для использования'));
  pool.query(`SELECT inventory FROM users WHERE id = '${message.author.id}' LIMIT 1`, (err, rows) => {
    if (err) return;
    pool.query('select * from shop', (err2, rows2) => {
      if (err2) return;
      let ItemID = rows2.find((Item) => (Item.item === item));
      if (!ItemID) return message.channel.send(error('Такого предмета не существует!'));
      ItemID = ItemID.id;
      if (message.member.roles.has(ItemID)) return message.channel.send(error('Вы уже имеете этот статус'));
      const inventory = JSON.parse(JSON.stringify(rows[0].inventory)); // user inventory
      if (inventory[item] <= 0) return message.channel.send(error('Предмета нет в инветаре'));
      message.member.addRole(ItemID);
      pool.query(`Update users set inventory = JSON_SET(inventory, "$.${item}",${inventory[item] - 1}) where id = '${message.author.id}'`);
      message.reply(`Вы применили роль ${item}`);
    });
  });
};
module.exports = {
  name: 'использовать',
  usage() { return `${process.env.PREFIX}${this.name} (inventory_item)`; },
  desc: 'Использование предмета вашего инвентаря',
  func: USeItem,
};
