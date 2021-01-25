const pool = require('../DB/db');

const guildid = process.env.GUILD_ID;
const UpdatePrivate = (client) => {
  pool.query('SELECT id,private FROM users', (err, rows) => {
    for(let i = 0; i <rows.legth; i++){
      let row = rows[i];
      if(row.private){
        let roles = Object.entries(JSON.parse(JSON.stringify(row.private)));
        console.log(roles);
        for(let j = 0; j < roles.length; j++){
          let role = roles[j][1];
          if(role && (role.active === 'true')){
            let date = role.to;
            let nowd = Date.now();
            if (date - nowd < 0) {
              client.users.get(row.id).send(`Ваша роль: "${role.name}" была снята, тк закончился срок`);
              client.guilds.get(guildid).members.get(row.id).removeRole(role.id); //removing private role
              pool.query(`UPDATE users SET private = JSON_SET(private, '$.${roles[j][0]}.active', 'false') WHERE id = '${row.id}' LIMIT 1`);
            }
          }
        }
      }
    }
  });
};
module.exports = UpdatePrivate;
