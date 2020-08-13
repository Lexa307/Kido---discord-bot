const pool = require('../index.js').pool;
const error = require('./Error.js');
let USeItem = (message, args) =>{
    let item = args.join(" ");
    if(!item) return message.channel.send(error("Не указан предмет для использования"));
    pool.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, (err, rows) => {
        pool.query(`select * from shop`,(err,rows2) =>{
            let ItemID = rows2.find(Item =>{return (Item.item == item) });
            console.log(ItemID);
            if(!ItemID) return message.channel.send(error("Такого предмета не существует!"))
            ItemID = ItemID.id;
            if(message.member.roles.has(ItemID)) return message.channel.send(error("Вы уже имеете этот статус"));
            let inventory = JSON.parse(JSON.stringify(rows[0].inventory)); //user inventory
            if(inventory[item] <= 0)return message.channel.send(error("Предмета нет в инветаре"));
            message.member.addRole(ItemID);
            pool.query(`Update users set inventory = JSON_SET(inventory, "$.${item}",${inventory[item]-1}) where id = '${message.author.id}'`);
            message.reply(`Вы применили роль ${item}`);
        })
    });
}
module.exports = USeItem;