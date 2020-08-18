const pool = require('../DB/db');
const guildid = process.env.GUILD_ID;
const UpdatePrivate = client => {
    pool.query(`SELECT id,private FROM users`, (err, rows) => {
        rows.forEach(row => {
            if(!row) return;
            if(row.private === null) return;
            let roles = JSON.parse(JSON.stringify(row.private));
            if(roles.role.active === 'false') return;
            let date = roles.role.to;
            let nowd = Date.now();
            if(date - nowd < 0) {
                client.users.get(row.id).send("Ваша личная роль была снята, тк закончился срок");
                client.guilds.get(guildid).members.get(row.id).removeRole(roles.role.id)
                pool.query(`UPDATE users SET private = JSON_SET(private, '$.role.active', 'false') WHERE id = '${row.id}' LIMIT 1`)
            }
        });
    });
}
module.exports = UpdatePrivate;