const Discord = require(`discord.js`);
const {pool,client} = require('../index.js');
const guildid = process.env.GUILD_ID;
let ShowShop = message => {
    const embed = new Discord.RichEmbed()
		.setTitle("Магазин ролей")
		.setColor("#3212A0")
		pool.query(`SELECT * FROM shop`, (err, rows) => {
			if(!rows[0]) embed.setDescription("Ролей нет.");
			for(i = 0;i < rows.length; i++) {
				row = rows[i];
				embed.addField(`[ ${row.itemid} ] ${row.item}`, `Цена: ${row.price}\nВы получите роль ${client.guilds.get(guildid).roles.get(row.id).name}`)
			}
		message.channel.send(embed)
		});
}
module.exports = ShowShop;