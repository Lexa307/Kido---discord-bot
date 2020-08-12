const pool = require('../index.js').pool;
const error = require('./Error.js');
let USeItem = (message, args) =>{
    let item = args.join(" ");
    if(!item) return message.channel.send(error("Не указан предмет для использования"));
    pool.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, (err, rows) => {
        if(item === 'elite') {
            const i = JSON.parse(rows[0].inventory);
            if(i.elite <= 0) return message.channel.send(error("Предмета нет в инветаре"));
            if(message.member.roles.has('564339584989790228')) return message.channel.send(error("Вы уже имеете статус элиты"));
            message.member.addRole('564339584989790228');
            //pool.query(`UPDATE users SET private = // Если честно, забыл что я тут делал, но видать у меня тут очень подгорело.
            setTimeout( () => {
                message.member.removeRole('564339584989790228');//delete hardcode
            }, 604800000)
        }
    });
}
module.exports = USeItem;