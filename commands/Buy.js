const {pool} = require('../index.js');
const guildid = process.env.GUILD_ID;
const error = require('../runtime/Error');
const price = process.env.PRICE;
let Buy = (message, args, client) => {
    pool.query(`SELECT money FROM users WHERE id = '${message.author.id}' LIMIT 1`, (err, rows) => {
        if(!rows[0]) return message.channel.send(error("У вас еще нет аккаунта"));
        let item = args.join(" ");
        if(!item) return message.channel.send(error("Не указана роль для покупки"));
        pool.query(`SELECT * FROM shop WHERE item = '${item}'`, (err2, rows2) => {
            if(!rows2[0]) return message.channel.send(error("Предмет не найден"));
            if(rows[0].money < rows2[0].price) return message.channel.send(error(`Недостаточно ${price} для покупки данного предмета`));
            if(message.member.roles.has(rows2[0].id) === true) return message.channel.send(error("Данная роль уже приобритена вами"));
            message.member.addRole(rows2[0].id).catch(err => message.channel.send(error(`Ошибка, обратитесь к администрации с сервера и предоставьте им ошибку ниже\n\`\`\`${err}\`\`\``)));
            pool.query(`UPDATE users SET money = ${rows[0].money - rows2[0].price} WHERE id = '${message.author.id}'`);
            message.channel.send(`Вы приобрели роль ${client.guilds.get(guildid).roles.get(rows2[0].id).name}, проверьте свой спиоск ролей`);
        });
    });
}
module.exports = 
{
    name: "купить",
    usage: function (){return `${process.env.PREFIX}${this.name} (shop_item)`},
    desc: "Покупка предмета в магазине, купленный предмет помещается вам в инвентарь",
    func: Buy
}