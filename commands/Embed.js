const Discord = require(`discord.js`);
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
let CreateEbedMessage = (message,args) =>{
    try {
        let text = args.join(" ").replace(/\n/g, "\\n");
        let embed = new Discord.RichEmbed();
        let footer = text.match(/{footer:(.*?)( \| icon: ?(.*?))?}/i);
        if (footer !== null) embed.setFooter(footer[1], footer[3]);
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
module.exports = 
{
    name: "embed",
    usage: function (){return `${process.env.PREFIX}${this.name} (embed_options)`},
    desc: "Создание кастомных сообщений с возможностью вставки различных полей",
    func: CreateEbedMessage
}