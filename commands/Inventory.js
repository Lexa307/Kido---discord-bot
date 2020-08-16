const pool = require('../index.js').pool;
const Discord = require(`discord.js`);
const error = require('../runtime/Error');
let ShowInventory = message =>{
    pool.query(`SELECT inventory,gifts,money FROM users WHERE id = '${message.author.id}' LIMIT 1`, (err, rows) => {
        if(!rows[0]) return message.channel.send(error("У вас еще нет аккаунта"));
        let inv = JSON.parse(JSON.stringify(rows[0].inventory));
        const embed = new Discord.RichEmbed()
        .setTitle("Инвентарь пользователя "+message.author.username);
        // console.log(Object.keys(inv));
        for(let i in inv){
            embed.addField(`${i}`, inv[i])
        }
        // for(let i in inv){
        //     embed.addField(`${i}`, inv.private_3)
        // }
        // .addField("Личная роль на 3 дня", inv.private_3)
        // .addField("Личная роль на 5 дней", inv.private_5)
        // .addField("Личная роль на 7 дней", inv.private_7)
        // .addField("Статус элиты на 7 дней", inv.elite)
        embed.addField("Подарки 🎁", rows[0].gifts, true)
        .addField("Валюта ⭐", rows[0].money, true)
        .setColor("#3212A0")
        .setFooter(".inventory")
        message.channel.send(embed)
    })
}
module.exports =
{
    name: "инвентарь",
    usage: function (){return `${process.env.PREFIX}${this.name}`},
    desc: "Показывает ваш инвентарь",
    func: ShowInventory
}