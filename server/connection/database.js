require('dotenv').config()
const mysql = require('mysql')

const pool = mysql.createPool({
    port: process.env.db_port,
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PWD,
    database : process.env.DB_NAME,
    connectionLimit: 10
  });

pool.getConnection((error, connection) => {
    if(error){
      if(error.code == "ECONNREFUSED"){
        console.log('Database connection not established')
      }
    }
})



// Attempt to catch disconnects 
pool.on('connection', function (connection) {
    console.log('DB Connected');
    
    connection.on('error', function (err) {
      if(err.code == "ECONNRESET"){console.log('DB disconnected')}
      else{console.error('MySQL error', err.code);}
    });
    connection.on('close', function (err) {
      console.error(new Date(), 'MySQL close', err);
    });
});
  
  module.exports = pool;