const pool = require('../index').pool;
const random = function(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min));
}

let Open = message => {
    pool.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, (err, rows) => {
        if(!rows[0]) return message.channel.send(error("У вас еще нет аккаунта"));
        if(rows[0].gifts <= 0) return message.channel.send(error("У вас больше нет коробок"));
        let moneyr = random(100, 200);
        var arr = ['elite', 'p3', 'p5', 'p7', 'cash'];
        var gifted = Math.floor(Math.random() * arr.length);
        gifted = arr[gifted]; //I think I'm doing something wrong >_>
        pool.query(`UPDATE users SET gifts = ${rows[0].gifts - 1} WHERE id = '${message.author.id}'`);
        let i = JSON.parse(rows[0].inventory);
        let query,set,response;
        switch (gifted){
            case 'elite': set = `$.elite, ${i.elite + 1}`; response = "Из коробки выпал статус элиты на 7 дней, он добавлен в инвентарь";  break;
            case 'p3': set = `$.private_3, ${i.private_3 + 1}`;	response = "Из коробки выпала личная роль на 3 дня, она добавлена в инвентарь"; break;
            case 'p5': set = `$.private_5, ${i.private_5 + 1}`;	response = "Из коробки выпала личная роль на 5 дней, она добавлена в инвентарь"; break;
            case 'p7': set = `$.private_7, ${i.private_7 + 1}`;	response = "Из коробки выпала личная роль на 7 дней, она добавлена в инвентарь"; break;
        }
        query = `UPDATE users SET inventory = JSON_SET(inventory, ${set}) WHERE id = '${message.author.id}'`;
        if(gifted == 'cash'){ query = `UPDATE users SET money = ${rows[0].money + moneyr} WHERE id = '${message.author.id}'`; response = `Из коробки выпало \`${moneyr}\` 🌟`; }
        pool.query(query);
        message.channel.send("Открываем коробку..").then(m => setTimeout( () => { message.channel.send(response) }, 5000));
    })
}
module.exports = Open;