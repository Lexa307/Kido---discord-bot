const pool = require('../DB/db');
const RandomStatus = client => {
	let stars = 0;
	let gifts = 0;
	pool.query(`SELECT money,gifts FROM users`, (err, rows) => {
		rows.forEach(row => {
			stars = stars + row.money;
			gifts = gifts + row.gifts;
		});
	});
    let status = [`орбиту 🌍 | ${stars} 🌟`, `орбиту 🌍 | ${gifts} 🎁`];
    let rstatus = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[rstatus], {type: 'STREAMING', url: 'https://twitch.tv/.'});
};
module.exports = RandomStatus;