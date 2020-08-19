const pool = require('../DB/db');
const error = require('../runtime/Error');

const random = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const Open = (message) => {
  pool.query(`SELECT gifts, inventory, money FROM users WHERE id = '${message.author.id}' LIMIT 1`, (err, rows) => {
    if (!rows[0]) return message.channel.send(error('У вас еще нет аккаунта'));
    if (rows[0].gifts <= 0) return message.channel.send(error('У вас больше нет коробок'));
    const moneyr = random(100, 200);
    const arr = [
      'elite',
      'p3',
      'p5',
      'p7',
      'cash',
    ];
    let gifted = Math.floor(Math.random() * arr.length);
    gifted = arr[gifted]; // I think I'm doing something wrong >_>
    pool.query(`UPDATE users SET gifts = ${rows[0].gifts - 1} WHERE id = '${message.author.id}' LIMIT 1`);
    const i = JSON.parse(JSON.stringify(rows[0].inventory));
    let query; let response; let set;
    switch (gifted) { //
      case 'elite': set = `"$.elite", ${i.elite + 1}`; response = 'Из коробки выпал статус элиты на 7 дней, он добавлен в инвентарь'; break;
      case 'p3': set = `"$.private_3", ${i.private_3 + 1}`; response = 'Из коробки выпала личная роль на 3 дня, она добавлена в инвентарь'; break;
      case 'p5': set = `"$.private_5", ${i.private_5 + 1}`; response = 'Из коробки выпала личная роль на 5 дней, она добавлена в инвентарь'; break;
      case 'p7': set = `"$.private_7", ${i.private_7 + 1}`; response = 'Из коробки выпала личная роль на 7 дней, она добавлена в инвентарь'; break;
    }
    query = `UPDATE users SET inventory = JSON_SET(inventory, ${set}) WHERE id = '${message.author.id}' LIMIT 1`;
    if (gifted === 'cash') { query = `UPDATE users SET money = ${rows[0].money + moneyr} WHERE id = '${message.author.id}' LIMIT 1`; response = `Из коробки выпало \`${moneyr}\` 🌟`; }
    pool.query(query);
    message.channel.send('Открываем коробку..').then(message.channel.send(response));
  });
};
module.exports = {
  name: 'открыть',
  usage() { return `${process.env.PREFIX}${this.name}`; },
  desc: 'Открывает подарок, если он у вас есть',
  func: Open,
};
