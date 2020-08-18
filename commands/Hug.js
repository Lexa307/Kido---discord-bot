const pool = require('../DB/db');
const error = require('../runtime/Error');
let Hug = message => {
    let huged = message.mentions.users.first();
		if(!huged) return message.channel.send(error("Для этой команды нужно упомянуть человека"));
		pool.query(`SELECT uses FROM users WHERE id = '${huged.id}' LIMIT 1`, (err, rows) => {
			if(!rows[0]) return message.channel.send(error("Для этой команды нужен активный профиль второго пользователя"));
			let uses = JSON.parse(JSON.stringify(rows[0].uses));
			pool.query(`UPDATE users SET uses = JSON_SET(uses, "$.hug", ${uses.hug + 1}) where id = ${huged.id} LIMIT 1`); //use this query for REACTION EDITS REEEEEEEEEEEEEEEEEEEEEEE
		})
}
module.exports =
{
    name: "обнять",
    usage: function (){return `${process.env.PREFIX}${this.name} (@someone)`},
    desc: "Обнимашки с участником сервера, жаль что в жизни их так мало",
    func: Hug
}