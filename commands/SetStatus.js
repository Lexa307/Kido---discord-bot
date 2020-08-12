const pool = require('../index.js').pool;
const clear = function(str) {
    return str.replace(/(['`', "`"])/g, "\\$1")
}
const error = require('./Error.js');
let SetStatus = (message,args)=>{
    pool.query(`SELECT * FROM users WHERE id = ${message.author.id}`, (err, rows) => {
        if(!rows[0]) return message.channel.send(err("Аккаунт не найден"));
        let newDesc = clear(args.join(" "));
        if(!newDesc) return message.channel.send(error("Не указан новый статус"));
        if(newDesc.length > 100) return message.channel.send(error("Статус не может быть длинее 100 символов"));
        pool.query(`UPDATE users SET description = '${newDesc}' WHERE id = ${message.author.id}`);
        message.channel.send("Статус обновлен");
        message.delete();
    })
}
module.exports = SetStatus;
