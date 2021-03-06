const Discord = require('discord.js');

const price = process.env.PRICE;
const guildid = process.env.GUILD_ID;
const moment = require('moment');
const pool = require('../DB/db');
const error = require('../runtime/Error');

function getUserFromMention(mention) {
  // The id is the first and only match found by the RegEx.
  const matches = mention.match(/^<@!?(\d+)>$/);
  // If supplied variable was not a mention, matches will be null instead of an array.
  if (!matches) return;

  /*
    * However the first element in the matches array will be the entire mention, not just the ID,
    * so use index 1.
    */
  return matches[1]; // user id
}
const ShowProfile = (message, args, client) => {
  let member;
  if (args[0]) {
    member = getUserFromMention(args[0]);
    if (!member) { message.channel.send(error('Для просмотра профиля учатника необходимо упомянуть только его')); }
  } else {
    member = message.author.id;
  }
  pool.query(`SELECT voicem,voiceh,uses,id,description,money,gifts,messages FROM users WHERE id = ${member} LIMIT 1`, (err, rows) => {
    if (!rows.length) return message.channel.send(error('Не знаю такого пользователя!'));
    let TimeMinutes = (rows[0].voicem === null) ? 0 : rows[0].voicem;
    let TimeHours = (rows[0].voiceh === null) ? 0 : rows[0].voiceh;
    if (TimeMinutes < 9) TimeMinutes = `0${TimeMinutes}`; // tvorim dich //WTF is that? i will fix this crap at next commits
    if (TimeHours < 9) TimeHours = `0${TimeHours}`; // tvorim dich //legacy code
    const time = `${TimeHours} ч. ${TimeMinutes} мин.`; // tvorim dich
    const uses = JSON.parse(JSON.stringify(rows[0].uses)); // command uses [json sheme]
    let { status } = client.users.get(member).presence; // game
    if (status === 'online') status = 'В сети';
    if (status === 'idle') status = 'Не активен';
    if (status === 'dnd') status = 'Не беспокоить';
    if (status === 'offline') status = 'Не в сети';
    const embed = new Discord.RichEmbed()
      .setThumbnail(client.users.get(rows[0].id).displayAvatarURL)
      .setTitle(`Профиль участника ${client.users.get(rows[0].id).username}`)
      .addField('💰 Валюта сервера', `\n👛 **Баланс:** ${rows[0].money} ${price}\n🎆 **Подарки:** ${rows[0].gifts}🎁`)
      .addField('** **', `\`\`\`Обняли: ${uses.hug}
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
      .addField('** **', `💡 **Статус:** ${status}\n🕛 **Зашел на сервер:** ${moment(client.guilds.get(guildid).members.get(rows[0].id).joinedAt).fromNow()}\n🎤 **Пробыл в войсе:** ${time}\n💭**Написал Сообщений:** ${rows[0].messages}\n`)
      .addField('ℹ Личный Статус', `\`\`\`${rows[0].description}\`\`\``)
      .setColor('#36393F');
    message.channel.send(embed);
    message.delete().catch(console.error);
  });
};
module.exports = {
  name: 'профиль',
  usage() { return `${process.env.PREFIX}${this.name} [@someone]`; },
  desc: 'Показывает профиль участника',
  func: ShowProfile,
};
