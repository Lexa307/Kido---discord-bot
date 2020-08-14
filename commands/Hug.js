const pool = require('../index').pool;
const error = require('./Error.js');
let Hug = message => {
    let huged = message.mentions.users.first();
		if(!huged) return message.channel.send(error("Для этой команды нужно упомянуть человека"));
		pool.query(`SELECT uses FROM users WHERE id = '${huged.id}' LIMIT 1`, (err, rows) => {
			if(!rows[0]) return message.channel.send(error("Для этой команды нужен активный профиль второго пользователя"));
			// let uses = JSON.parse(JSON.stringify(rows[0].uses));
			// let neww = uses.hug++; // ++ .-.
			pool.query(`UPDATE users SET uses = JSON_SET(uses, "$.hug", $.hug+1) where id = ${message.author.id} and id = ${huged.id}`); //use this query for REACTION EDITS REEEEEEEEEEEEEEEEEEEEEEE
		})
}
module.exports = Hug;