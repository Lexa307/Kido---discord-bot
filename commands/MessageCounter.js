const pool = require('../index.js').pool;
let CountMessages = (message)=>{
    /// UPDATE USER PROFILE
	pool.query(`SELECT messages FROM users WHERE id = ${message.author.id} LIMIT 1`, (err, rows) => {
		if(!rows[0]) 
			pool.query(`call add_user(${message.author.id})`);// register user;
		else //increment message counts of user
			pool.query(`UPDATE users SET  messages = ${rows[0].messages++} WHERE id = ${message.author.id} LIMIT 1`);
	})
}
module.exports = CountMessages;