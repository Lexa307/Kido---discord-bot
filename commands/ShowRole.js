const pool = require('../index.js').pool;
const error = require('../runtime/Error');
const Discord = require(`discord.js`);
let ShowRole = (message, args, client ) => {
    pool.query(`SELECT private FROM users WHERE id = '${message.author.id}' LIMIT 1`, (err, rows) =>{
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
module.exports =
{
    name: "роли",
    usage: function (){return `${process.env.PREFIX}${this.name}`},
    desc: "Показывает ваши личные роли",
    func: ShowRole
}