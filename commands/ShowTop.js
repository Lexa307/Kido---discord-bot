const {pool,client} = require('../index.js');
const Discord = require(`discord.js`);
let ShowTop = message => {
    pool.query(`SELECT id,money FROM users ORDER BY money DESC LIMIT 10`, (err, rows) => {
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
module.exports = ShowTop;