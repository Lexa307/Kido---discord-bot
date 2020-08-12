const Discord = require(`discord.js`);
const mysql   = require("mysql2");
require('dotenv').config();
const moment  = require("moment");
const client  = new Discord.Client();
const guildid = process.env.GUILD_ID;
const prefix  = process.env.PREFIX;
const MainTeextChannelID = process.env.MAIN_CHANNEL_ID;//can ve deleted at next commits
moment.locale("ru");
const voice = { };

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database:  process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit : 1000
});

pool.getConnection(function(err) {//check for database connection
	if (err){
		console.log("cannot connect to database, check out your .env config file");
		throw err; // not connected!
	} 
});
// FUNCTIONS
client.on('ready', () => {
	console.log("Ready");
	client.generateInvite().then(i => console.log(i));
	
	function randomStatus() {
	let stars = 0;
	let gifts = 0;
	pool.query(`SELECT * FROM users`, (err, rows) => {
		rows.forEach(row => {
			stars = stars + row.money;
			gifts = gifts + row.gifts;
		})
	})
        let status = [`орбиту 🌍 | ${stars} 🌟`, `орбиту 🌍 | ${gifts} 🎁`];
        let rstatus = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[rstatus], {type: 'STREAMING', url: 'https://twitch.tv/.'});
    }; setInterval(randomStatus, 60000)

	pool.query(`SELECT * FROM users`, (err, rows) => {
		if(!rows) return;
		rows.forEach(row => {
			if(!row) return;
			if(row.private === null) return;
			console.log(row);
			let roles = JSON.parse(JSON.stringify(row.private));
			let date = roles.role.to;
			let nowd = Date.now();
			if(date - nowd < 0) { //Проверка на активную личную роль
				client.channels.get(MainTeextChannelID).send("Ваша личная роль исчерпана"); //тут придется поправить под себя
				client.guilds.get(guildid).members.get(row.id).removeRole(roles.role.id)
			}
		})
	})

	setInterval( () => {
		 pool.query(`SELECT * FROM users`, (err, rows) => {
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
				pool.query(`UPDATE users SET private = JSON_SET(private, '$.role.active', 'false') WHERE id = '${row.id}'`)
                        }
                })
        })

	}, 60000)
})

client.on('voiceStateUpdate', (old, member) => {
	if(member.voiceChannelID === null || member.selfMute === true) { //null - leaved from voice; selfMute - muted himself
		clearInterval(voice[member.user.id]); // stop recording voice;
		return; // stop alg;
	} else {
		if(member.selfMute === true) return; //ignore if muted himself;
		if(old.voiceChannelID === member.voiceChannelID) return; //ignore this channel updates - anti layering voice recording;
		voice[member.user.id] = setInterval( () => {
			pool.query(`SELECT * FROM users WHERE id = '${member.user.id}'`, (err, rows) => {
				if(!rows[0]) return; //ignore in not exits;
				//record 1 voice minute;
				pool.query(`UPDATE users SET voicem = ${rows[0].voicem + 1} WHERE id = '${member.user.id}'`);
				if(rows[0].voicem >= 60) {
				//record 1 voice hour, set voice minutes to 00;
					 pool.query(`UPDATE users SET voiceh = ${rows[0].voiceh + 1}, voicem = 0 WHERE id = '${member.user.id}'`);
					 if(rows[0].voiceh == 11) {
                                	//Every 12 hours member will get 1 gift;
                                	//Gift can drop a private role for 3/5/7 days | premium role for 7 days | 100-200 server currency;
                               	         	pool.query(`UPDATE users SET gifts = ${rows[0].gifts + 1} WHERE id = '${member.user.id}'`);
						member.user.send("Вы получили 1 🎁 за то что просидели в войсе более 12 часов!");
                                	}
				}
			})
		}, 4000)
	}
})

client.on('message', message => {
	require('./commands/MessageCounter.js')(message); // UPDATE OR REGISTER USER PROFILE
	require('./commands/Ping')(message); //Bot answer if someone mentioned him
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	switch(command){
		case "embed": require('./commands/Embed.js')(message,args); break;
		case "статус": require('./commands/SetStatus')(message,args); break;
		case "профиль": require('./commands/Profile.js')(message,args); break;
		case "топ": require('./commands/ShowTop.js')(message); break;
		case "открыть": require('./commands/Open.js')(message); break;
		case "инвентарь": require('./commands/Inventory.js')(message); break;
		case "роли": require('./commands/ShowRole.js')(message); break;
		case "магазин": require('./commands/Shop.js')(message); break;
		case "купить": require('./commands/Buy.js')(message, args); break;
		case "использовать": require('./commands/Use.js')(message, args); break;
		//REACTIONS
		case "обнять": require('./commands/Hug.js')(message); break;
	}
})//допилить действия с игроками
module.exports = {pool:pool,client:client};
client.login(process.env.TOKEN);