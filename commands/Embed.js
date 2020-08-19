const Discord = require('discord.js');
const error = require('../runtime/Error');

const CreateEbedMessage = (message, args) => {
  try {
    const text = args.join(' ').replace(/\n/g, '\\n');
    const embed = new Discord.RichEmbed();
    const footer = text.match(/{footer:(.*?)( \| icon: ?(.*?))?}/i);
    if (footer !== null) embed.setFooter(footer[1], footer[3]);
    const image = text.match(/{image: ?(.*?)}/i);
    if (image !== null) {
      embed.attachFile({
        attachment: image[1],
        file: image[1].substring(image[1].lastIndexOf('/') + 1),
      }).setImage(`attachment://${image[1].substring(image[1].lastIndexOf('/') + 1)}`);
    }
    const thumb = text.match(/{thumbnail: ?(.*?)}/i);
    if (thumb !== null) {
      embed.attachFile({
        attachment: thumb[1],
        file: thumb[1].substring(thumb[1].lastIndexOf('/') + 1),
      }).setThumbnail(`attachment://${thumb[1].substring(thumb[1].lastIndexOf('/') + 1)}`);
    }
    const author = text.match(/{author:(.*?)( \| icon: ?(.*?))?( \| url: ?(.*?))?}/i);
    if (author !== null) {
      embed.setAuthor(author[1], author[3], author[5]);
    }
    const title = text.match(/{title:(.*?)}/i);
    if (title !== null) {
      embed.setTitle(title[1]);
    }
    const url = text.match(/{url: ?(.*?)}/i);
    if (url !== null) {
      embed.setURL(url[1]);
    }
    const description = text.match(/{description:(.*?)}/i);
    if (description !== null) {
      embed.setDescription(description[1].replace(/\\n/g, '\n'));
    }
    const color = text.match(/{colou?r: ?(.*?)}/i);
    if (color !== null) {
      embed.setColor(color[1]);
    }
    const timestamp = text.match(/{timestamp(: ?(.*?))?}/i);
    if (timestamp !== null) {
      if (timestamp[2] === undefined || timestamp[2] === null) embed.setTimestamp(new Date());
      else embed.setTimestamp(new Date(timestamp[2]));
    }
    const fields = text.match(/{field: ?(.*?) \| value: ?(.*?)( \| inline)?}/gi);
    if (fields !== null) {
      fields.forEach((item) => {
        if (item[1] == null || item[2] == null || typeof item[1] === 'undefined' || typeof item[2] === 'undefined') return;
        const matches = item.match(/{field: ?(.*?) \| value: ?(.*?)( \| inline)?}/i);
        embed.addField(matches[1], matches[2].replace(/\\n/g, '\n'), (matches[3] != null));
      });
    }
    message.channel.send({ embed });
    message.delete();
    message.author.send(`Я оставлю это здесь на случай, если вам нужно будет отредактировать прошлое сообщение или вы потеряли шаблон..\n\n\`\`\`${args.join(' ')}\`\`\``).catch((_err) => message.channel.send(error(`Я не смогу скинуть вам шаблон, так как ваши личные сообщения закрыты: ${_err}`)));
  } catch (e) {
    message.channel.send(error(`Ошибка при генерации embed сообщения\n\`\`\`${e}\`\`\``, 'Внимание, не пытайтесь вставить текст длинее 256 символов в TITLE или первое значение FIELD, они являются заголовками, а не местами для полноценного текста.'));
    console.error(e);
  }
};
module.exports = {
  name: 'embed',
  usage() { return `${process.env.PREFIX}${this.name} (embed_options)`; },
  desc: 'Создание кастомных сообщений с возможностью вставки различных полей',
  func: CreateEbedMessage,
};
