const pool = require('../index.js').pool;
let CountMessages = (message)=>{
    /// UPDATE USER PROFILE
	pool.query(`SELECT * FROM users WHERE id = ${message.author.id}`, (err, rows) => {
		if(!rows[0]) { // register user;
			pool.query(`INSERT INTO users (id, uses, inventory) VALUES ('${message.author.id}', '{"hug": 0, "kiss": 0, "bite": 0, "pat": 0, "smoke": 0, "beer": 0, "rip": 0, "shot": 0, "poke": 0, "slap": 0, "lick": 0, "coffee": 0, "sad": 0, "sex": 0}', '{"elite": 0, "private_3": 0,"private_5": 0, "private_7": 0}')`);
		} else {
			//let nxp    = rows[0].xp + random(1,15); //is it needed?
			let nmsg   = rows[0].messages      + 1;
			pool.query(`UPDATE users SET  messages = ${nmsg} WHERE id = ${message.author.id}`);
		}
	})
}
module.exports = CountMessages;