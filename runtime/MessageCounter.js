const pool = require('../DB/db');

const CountMessages = (message) => {
  /// UPDATE USER PROFILE
  pool.query(`SELECT messages FROM users WHERE id = ${message.author.id} LIMIT 1`, (err, rows) => {
    if (rows.length === 0) pool.query(`call add_user(${message.author.id})`);// register user;
    else pool.query(`UPDATE users SET  messages = ${rows[0].messages + 1} WHERE id = ${message.author.id} LIMIT 1`);
  });
};
module.exports = CountMessages;
