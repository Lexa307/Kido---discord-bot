const pool = require('../DB/db');
const { PRICE } = process.env;

const RandomStatus = (client) => {
  pool.query('SELECT SUM(money) as money, SUM (gifts) as gifts FROM users;', (err, row) => {
    const status = [`орбиту 🌍 | ${row[0].money} ${PRICE}`, `орбиту 🌍 | ${row[0].gifts} 🎁`];
    const rstatus = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[rstatus], { type: 'STREAMING', url: 'https://twitch.tv/.' });
  });
};
module.exports = RandomStatus;
