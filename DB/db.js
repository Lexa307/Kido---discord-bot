const mysql   = require("mysql2");
const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:  process.env.DB_PASSWORD,
    database:  process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit : 1000
}
const pool = mysql.createPool(options);
            
module.exports = pool;
//SHOW DATABASES LIKE 'dbname';
