const mysql = require('mysql2/promise')

// Проверить подключение к бд

let db

try {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    
  })
} catch (error) {
  throw 'Error conection: ' + error.message
}

module.exports = db
