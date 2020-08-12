const {pool,client} = require('../index.js');
const Discord = require(`discord.js`);
const price   = process.env.PRICE;
const moment  = require("moment");
let ShowProfile = (message,args)=>{
    let ids = message.mentions.members.first();
    let member; 
    if (ids) member = ids.user.id;
        else member = (args[1])?args[1]:args[0]
    if(!args[0]) member = message.author.id;
    
    pool.query(`SELECT * FROM users WHERE id = ${member}`, (err, rows) => {
        if(!rows[0]) return;
        
        let time_m = (rows[0].voicem == null)? 0 :rows[0].voicem;
        let time_h = (rows[0].voiceh == null)? 0 :rows[0].voiceh;
        if(time_m < 9) time_m = '0'+time_m; //tvorim dich //WTF is that? i will fix this crap at next commits 
        if(time_h < 9) time_h = '0'+time_h; //tvorim dich //legacy code
        let time = `${time_h} ч. ${time_m} мин.`; //tvorim dich
        let uses = JSON.parse(JSON.stringify(rows[0].uses)); //command uses [json sheme]
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
Занимались сексом: ${uses.sex}\`\`\``) 
    .addField("** **", `💡 **Статус:** ${status}\n🕛 **Зашел на сервер:** ${moment(message.guild.members.get(rows[0].id).joinedAt).fromNow()}\n🎤 **Пробыл в войсе:** ${time}\n💭**Написал Сообщений:** ${rows[0].messages}\n`)
    .addField("ℹ Личный Статус", '```'+rows[0].description+'```')
    .setColor("#36393F")
    message.channel.send(embed)
    message.delete();
		})
}
module.exports = ShowProfile