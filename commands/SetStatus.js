const pool = require('../index.js').pool;
const clear = function(str) {
    return str.replace(/(['`', "`"])/g, "\\$1")
}
const error = require('../runtime/Error');
let SetStatus = (message,args)=>{
    pool.query(`SELECT id FROM users WHERE id = ${message.author.id} LIMIT 1`, (err, rows) => {
        if(!rows[0]) return message.channel.send(err("Аккаунт не найден"));
        let newDesc = clear(args.join(" "));
        if(!newDesc) return message.channel.send(error("Не указан новый статус"));
        if(newDesc.length > 100) return message.channel.send(error("Статус не может быть длинее 100 символов"));
        pool.query(`UPDATE users SET description = '${newDesc}' WHERE id = ${message.author.id} LIMIT 1`);
        message.channel.send("Статус обновлен");
        message.delete();
    })
}
module.exports =
{
    name: "статус",
    usage: function (){return `${process.env.PREFIX}${this.name} (satus)`},
    desc: "Устанавливает личный статус в вашем профиле",
    func: SetStatus
}
