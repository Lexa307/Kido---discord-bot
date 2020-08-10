const Discord = require(`discord.js`);
const mysql   = require("mysql");
require('dotenv').config();
const moment  = require("moment");
const client  = new Discord.Client();
const price   = process.env.PRICE;
const guildid = process.env.GUILD_ID;
const prefix  = process.env.PREFIX;
moment.locale("ru");
// const server_name = 'KABO?';
// const voiceNow = new Set();
// const daily = new Set();
const voice = { };
let pinganswers = ["отвали от меня!","ты тупой?","ты идиот!","я вырежу тебе все органы!","ты не видишь то что я занята?","при первой же возможности я тебя забаню!","ты меня злишь!"]
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database:  process.env.DB_NAME,
  port: process.env.DB_PORT
});

pool.connect(err => {
        if (err) throw err;
  console.log("Сonnected to database")
})

// FUNCTIONS

const random = function(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }
const error = function(desc) {
	return new Discord.RichEmbed().setColor("RED").setDescription(":x: "+desc);
}

const clear = function(str) {
    return str.replace(/(['`', "`"])/g, "\\$1")
}
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
		rows.forEach(row => {
			if(!row) return;
			if(row.private === null) return;
			console.log(row);
			let roles = JSON.parse(row.private);
			let date = roles.role.to;
			let nowd = Date.now();
			if(date - nowd < 0) { //Проверка на активную личную роль
				client.channels.get('563733138715443240').send("Ваша личная роль исчерпана"); //тут придется поправить под себя
				client.guilds.get(guildid).members.get(row.id).removeRole(roles.role.id)
			}
		})
	})

	setInterval( () => {
		 pool.query(`SELECT * FROM users`, (err, rows) => {
                rows.forEach(row => {
                        if(!row) return;
                        if(row.private === null) return;
                        let roles = JSON.parse(row.private);
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
/// UPDATE USER PROFILE
	pool.query(`SELECT * FROM users WHERE id = ${message.author.id}`, (err, rows) => {
		if(!rows[0]) { // Insert large json's with command usage and user inventory;
			pool.query(`INSERT INTO users (id, uses, inventory) VALUES ('${message.author.id}', '{"hug": 0, "kiss": 0, "bite": 0, "pat": 0, "smoke": 0, "beer": 0, "rip": 0, "shot": 0, "poke": 0, "slap": 0, "lick": 0, "coffee": 0, "sad": 0, "sex": 0}', '{"elite": 0, "private_3": 0,"private_5": 0, "private_7": 0}')`);
		} else {
			//let nxp    = rows[0].xp + random(1,15); //is it needed?
			let nmsg   = rows[0].messages      + 1;
			pool.query(`UPDATE users SET  messages = ${nmsg} WHERE id = ${message.author.id}`);
		}
	})
/// UPDATE USER PROFILE
})

client.on('message', message => {
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if(command === "embed") {
		let err = function (name, pass, ex, send) {
                if(!name) name = 'Неизвестная ошибка';
                let embed = new Discord.RichEmbed()
                .setColor("RED")
                .setTitle("ERROR")
                .addField('Описание ошибки', name, true);
                if(pass) { embed.addField('Решение', pass, true) }
                if(ex) { embed.addField('Пример', ex, true) }
                if(send === false) {
                return embed;
                } else {
                return message.channel.send(embed).catch(err => message.channel.send("⚠ | Внимание, боту нужны права `Встраивать ссылки` чтобы отправлять сообщения и отчеты об ошибках"))
                }
        }
  try {
            let text = args.join(" ").replace(/\n/g, "\\n");
            let embed = new Discord.RichEmbed();
            let footer = text.match(/{footer:(.*?)( \| icon: ?(.*?))?}/i);
            if (footer !== null) {
                embed.setFooter(footer[1], footer[3])
            }
            let image = text.match(/{image: ?(.*?)}/i);
            if (image !== null) {
                embed.attachFile({
                    attachment: image[1],
                    file: image[1].substring(image[1].lastIndexOf('/') + 1)
                }).setImage('attachment://'+image[1].substring(image[1].lastIndexOf('/') + 1));
            }
            let thumb = text.match(/{thumbnail: ?(.*?)}/i);
            if (thumb !== null) {
                embed.attachFile({
                    attachment: thumb[1],
                    file: thumb[1].substring(thumb[1].lastIndexOf('/') + 1)
                }).setThumbnail('attachment://'+thumb[1].substring(thumb[1].lastIndexOf('/') + 1));
            }
            let author = text.match(/{author:(.*?)( \| icon: ?(.*?))?( \| url: ?(.*?))?}/i);
            if (author !== null) {
                embed.setAuthor(author[1], author[3], author[5])
            }
            let title = text.match(/{title:(.*?)}/i);
            if (title !== null) {
                embed.setTitle(title[1])
            }
            let url = text.match(/{url: ?(.*?)}/i);
            if (url !== null) {
                embed.setURL(url[1])
            }
            let description = text.match(/{description:(.*?)}/i);
            if (description !== null) {
                embed.setDescription(description[1].replace(/\\n/g, '\n'))
            }
            let color = text.match(/{colou?r: ?(.*?)}/i);
            if (color !== null) {
                embed.setColor(color[1])
            }
            let timestamp = text.match(/{timestamp(: ?(.*?))?}/i);
            if (timestamp !== null) {
                if (timestamp[2] === undefined || timestamp[2] === null)
                embed.setTimestamp(new Date());
                else
                embed.setTimestamp(new Date(timestamp[2]));
            }
            let fields = text.match(/{field: ?(.*?) \| value: ?(.*?)( \| inline)?}/gi)
            if (fields !== null) {
                fields.forEach((item) => {
                if (item[1] == null || item[2] == null || typeof item[1] === "undefined" || typeof item[2] === "undefined") return;
                let matches = item.match(/{field: ?(.*?) \| value: ?(.*?)( \| inline)?}/i);
                embed.addField(matches[1], matches[2].replace(/\\n/g, '\n'), (matches[3] != null));
            });}
            message.channel.send({embed});
            message.delete();
                message.author.send("Я оставлю это здесь на случай, если вам нужно будет отредактировать прошлое сообщение или вы потеряли шаблон..\n\n```"+args.join(" ")+"```").catch(err => message.channel.send("Я не смогу скинуть вам шаблон, так как ваши личные сообщения закрыты"));
        } catch(e) {
            err("Ошибка при генерации embed сообщения\n```"+e+"```", "Внимание, не пытайтесь вставить текст длинее 256 символов в TITLE или первое значение FIELD, они являются заголовками, а не местами для полноценного текста.")
            console.error(e);
        }

	}

	if(command === 'статус') {
		 pool.query(`SELECT * FROM users WHERE id = ${message.author.id}`, (err, rows) => {
			if(!rows[0]) return message.channel.send(err("Аккаунт не найден"));
			let newDesc = clear(args.join(" "));
			if(!newDesc) return message.channel.send(error("Не указан новый статус"));
			if(newDesc.length > 100) return message.channel.send(error("Статус не может быть длинее 100 символов"));
			pool.query(`UPDATE users SET description = '${newDesc}' WHERE id = ${message.author.id}`);
			message.channel.send("Статус обновлен");
			message.delete();
		})
	}

	if (message.content.indexOf("<@566415015519846422>")>=0){
		message.channel.send(pinganswers[Math.floor(Math.random() * (pinganswers.length))]);//
	  }

	if(command === 'профиль') {
	let ids;
						    let member;
						    ids = message.mentions.members.first()
						    if (ids) {
							    member = ids.user.id;
						    }
						    if (!ids) {
							    if(args[1]) { member = args[1] } else { member = args[0]; }
						    }
	    					   if(!args[0]) {
							   member = message.author.id;
						   }
	//can somebody remove this comment when we release that?
	//if(client.users.get(member).bot) return message.channel.send(error("Пользователь не должен быть ботом"));

		pool.query(`SELECT * FROM users WHERE id = ${member}`, (err, rows) => {
			if(!rows[0]) return;
			let time_m = rows[0].voicem;
			let time_h = rows[0].voiceh;
			if(time_m < 9) time_m = '0'+time_m; //tvorim dich
			if(time_h < 9) time_h = '0'+time_h; //tvorim dich
			let time = `${time_h} ч. ${time_m} мин.`; //tvorim dich
			let uses = JSON.parse(rows[0].uses); //command uses [json sheme]
			let status = client.users.get(member).presence.status; //game
			if(status == 'online') status = 'В сети';
			if(status == 'idle') status = 'Не активен';
			if(status == 'dnd') status = 'Не беспокоить';
			if(status == 'offline') status = 'Не в сети';
			let embed = new Discord.RichEmbed()
			.setThumbnail(client.users.get(rows[0].id).displayAvatarURL)
			.setTitle(`Профиль участника ${client.users.get(rows[0].id).username}`)
			.addField(`💰 Валюта сервера`, `\n👛 **Баланс:** ${rows[0].money} ${price}\n🎆 **Подарки:** ${rows[0].gifts}🎁`)
			.addField(`** **`, `\`\`\`Обняли: ${uses.hug}
Поцеловали: ${uses.kiss}
Укусили: ${uses.bite}
Погладили: ${uses.pat}
Покурил: ${uses.smoke}
Выпил пива: ${uses.beer}
Умер: ${uses.rip}
Застрелили: ${uses.shot}
Тыкнули: ${uses.poke}
Ударили: ${uses.slap}
Лизнули: ${uses.lick}
Выпил кофе: ${uses.coffee}
Грустил: ${uses.sad}
Занимались сексом: ${uses.sex}\`\`\``) //почему мне так смешно
			.addField("** **", `💡 **Статус:** ${status}\n🕛 **Зашел на сервер:** ${moment(message.guild.members.get(rows[0].id).joinedAt).fromNow()}\n🎤 **Пробыл в войсе:** ${time}\n💭**Написал Сообщений:** ${rows[0].messages}\n`)
			.addField("ℹ Личный Статус", '```'+rows[0].description+'```')
			.setColor("#36393F")
			message.channel.send(embed)
			message.delete();

		})
	}
	if(command === 'топ') {
		pool.query(`SELECT * FROM users ORDER BY money DESC LIMIT 10`, (err, rows) => {
                        const embed = new Discord.RichEmbed();
                        embed.setTitle(":crown: Топ 10 богачей сервера")
                        embed.setColor('GOLD')
                        for(i=0; i < rows.length; i++) { //leaderboard
                                const row = rows[i];
                                        embed.addField(`[ ${i+1} ] ${client.users.get(row.id).username} - \`${row.money} ⭐\``, '** **');
                                }
			embed.setThumbnail("https://media.discordapp.net/attachments/563743093145337892/563766275575250973/tumblr_m6ync6F5YS1roozkr.gif");
                        message.channel.send(embed);
                })
	}
	if(command === 'открыть') {
		/*let count = args[0];
		if(!count || isNaN(count) || count < 0) count = 1;
		 pool.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, (err, rows) => {
			if(count > rows[0].figts) return message.channel.send(error("У вас нет такого количества коробок"));
		})
		for(i=0; i < count; i++) {*/ // Very bugged trash, dont touch.
			pool.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, (err, rows) => {
				if(!rows[0]) return message.channel.send(error("У вас еще нет аккаунта"));
				if(rows[0].gifts <= 0) return message.channel.send(error("У вас больше нет коробок"));
				let moneyr = random(100, 200);
				var arr = ['elite', 'p3', 'p5', 'p7', 'cash'];
				var gifted = Math.floor(Math.random() * arr.length);
				gifted = arr[gifted]; //I think I'm doing something wrong >_>
				pool.query(`UPDATE users SET gifts = ${rows[0].gifts - 1} WHERE id = '${message.author.id}'`);
				let i = JSON.parse(rows[0].inventory);
				let p3 = i.private_3 + 1; //private role for 3 days, fuck
				let p5 = i.private_5 + 1; //private role for 5 days, fuck
				let p7 = i.private_7 + 1; //private role for 7 days, fuck
				let e = i.elite + 1; //elite role for 7 days
				//console.log(gifted) //remove this when released, just watching the behavior of pseudo randomness
				//idea: по возможности можно очень сильно оптимизировать, мб функцией, главное не срать
				if(gifted === 'elite') {
					pool.query(`UPDATE users SET inventory = JSON_SET(inventory, "$.elite", ${e}) WHERE id = '${message.author.id}'`);
					message.channel.send("Открываем коробку..").then(m => setTimeout( () => { message.channel.send("Из коробки выпал статус элиты на 7 дней, он добавлен в инвентарь") }, 5000));
				}
				if(gifted === 'p3') {
                                        pool.query(`UPDATE users SET inventory = JSON_SET(inventory, "$.private_3", ${p3}) WHERE id = '${message.author.id}'`);
                                        message.channel.send("Открываем коробку..").then(m => setTimeout( () => { message.channel.send("Из коробки выпала личная роль на 3 дня, она добавлена в инвентарь") }, 5000));
                                }
				if(gifted === 'p5') {
                                        pool.query(`UPDATE users SET inventory = JSON_SET(inventory, "$.private_5", ${p5}) WHERE id = '${message.author.id}'`);
                                        message.channel.send("Открываем коробку..").then(m => setTimeout( () => { message.channel.send("Из коробки выпала личная роль на 5 дней, она добавлена в инвентарь") }, 5000));
                                }
				if(gifted === 'p7') {
                                        pool.query(`UPDATE users SET inventory = JSON_SET(inventory, "$.private_7", ${p7}) WHERE id = '${message.author.id}'`);
                                        message.channel.send("Открываем коробку..").then(m => setTimeout( () => { message.channel.send("Из коробки выпала личная роль на 7 дней, она добавлена в инвентарь") }, 5000));
                                }
				if(gifted === 'cash') {
                                        pool.query(`UPDATE users SET money = ${rows[0].money + moneyr} WHERE id = '${message.author.id}'`);
                                        message.channel.send("Открываем коробку..").then(m => setTimeout( () => { message.channel.send(`Из коробки выпало \`${moneyr}\` 🌟`) }, 5000));
                                }

			})
		//} part of shit code
	}
	if(command === 'инвентарь') {
		pool.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, (err, rows) => {
			if(!rows[0]) return message.channel.send(error("У вас еще нет аккаунта"));
			let inv = JSON.parse(rows[0].inventory);
			const embed = new Discord.RichEmbed()
			.setTitle("Инвентарь пользователя "+message.author.username)
			.addField("Личная роль на 3 дня", inv.private_3)
			.addField("Личная роль на 5 дней", inv.private_5)
			.addField("Личная роль на 7 дней", inv.private_7)
			.addField("Статус элиты на 7 дней", inv.elite)
			.addField("Подарки 🎁", rows[0].gifts, true)
			.addField("Валюта ⭐", rows[0].money, true)
			.setColor("#3212A0")
			.setFooter(".inventory")
			message.channel.send(embed)

		})
	}
	// if(command === 'reset') { // PLEASE, DO > REMOVE THIS COMMAND WHEN RELEASED
	// 	pool.query('DELETE FROM users');
	// }
	// if(command === 'eval') { // PLEASE, DO > REMOVE THIS COMMAND WHEN RELEASED
	// 	eval(args.join(" "));
	// }
	if(command === 'роли') {
		pool.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, (err, rows) =>{
			if(!rows[0]) return message.channel.send(error("Вы еще не зарегистрированы"));
			let roles = JSON.parse(rows[0].private);
			const embed = new Discord.RichEmbed()
			.setTitle("Личные роли пользователя " +message.author.username)
			if(!roles) {
				embed.setDescription("Пользователь не имеет личных ролей");
			} else {
				embed.addField("Личная роль: "+message.guild.roles.get(roles.role.id).name, "Спадает **"+moment(roles.role.to).format('LLLL')+'**');
			}
			embed.setColor("#3212A0");
			message.channel.send(embed)
		})
	}
	if(command === 'магазин') {
		const embed = new Discord.RichEmbed()
		.setTitle("Магазин ролей")
		.setColor("#3212A0")
		pool.query(`SELECT * FROM shop`, (err, rows) => {
			if(!rows[0]) embed.setDescription("Ролей нет.");
			for(i=0;i<rows.length;i++) {
				row = rows[i];
				embed.addField(`[ ${row.itemid} ] ${row.item}`, `Цена: ${row.price}\nВы получите роль ${client.guilds.get(guildid).roles.get(row.id).name}`)
			}
		message.channel.send(embed)
		})
	}
	if(command === 'купить') {
		pool.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, (err, rows) => {
			if(!rows[0]) return message.channel.send(error("У вас еще нет аккаунта"));
			let item = args.join(" ");
			if(!item) return message.channel.send(error("Не указана роль для покупки"));
			pool.query(`SELECT * FROM shop WHERE item = '${item}'`, (err2, rows2) => {
				if(!rows2[0]) return message.channel.send(error("Предмет не найден"));
				if(rows[0].money < rows2[0].price) return message.channel.send(error("Недостаточно :star: для покупки данного предмета"));
				if(message.member.roles.has(rows2[0].id) === true) return message.channel.send(error("Данная роль уже приобритена вами"));
				message.member.addRole(rows2[0].id).catch(err => message.channel.send(error(`Ошибка, обратитесь к администрации с сервера и предоставьте им ошибку ниже\n\`\`\`${err}\`\`\``)));
				pool.query(`UPDATE users SET money = ${rows[0].money - rows2[0].price} WHERE id = '${message.author.id}'`);
				message.channel.send(`Вы приобрели роль ${client.guilds.get(guildid).roles.get(rows2[0].id).name}, проверьте свой спиоск ролей`);
			})
		})
	}

	if(command === 'использовать') {
		let item = args.join(" ");
		if(!item) return message.channel.send(error("Не указан предмет для использования"));
		pool.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, (err, rows) => {
			if(item === 'elite') {
				const i = JSON.parse(rows[0].inventory);
				if(i.elite <= 0) return message.channel.send(error("Предмета нет в инветаре"));
				if(message.member.roles.has('564339584989790228')) return message.channel.send(error("Вы уже имеете статус элиты"));
				message.member.addRole('564339584989790228');
				//pool.query(`UPDATE users SET private = // Если честно, забыл что я тут делал, но видать у меня тут очень подгорело.
				setTimeout( () => {
					message.member.removeRole('564339584989790228');
				}, 604800000)
			}
		})
	}
	//REACTIONS//
	//reaction template
	//idea: сделать функцию которая сможет оптимизировать все это, придется делать 2, тк не все команды можно использовать с помощью сервисов :/
	if(command === 'обнять') {
		let huged = message.mentions.users.first();
		if(!huged) return message.channel.send(error("Для этой команды нужно упомянуть человека"));
		pool.query(`SELECT * FROM users WHERE id = '${huged.id}'`, (err, rows) => {
			if(!rows[0]) return message.channel.send(error("Для этой команды нужен активный профиль второго пользователя"));
			let uses = JSON.parse(rows[0].uses);
			let neww = uses.hug+1; // ++ .-.
			pool.query(`UPDATE users SET uses = JSON_SET(uses, "$.hug", ${neww})`); //use this query for REACTION EDITS REEEEEEEEEEEEEEEEEEEEEEE
		})
	}
})//допилить действия с игроками

client.login(process.env.TOKEN)
