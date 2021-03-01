const mysql = require('mysql');
const config = require('../config/config');

const pool = mysql.createPool({
    host     : config.db_host,
    user     : config.db_user,
    password : config.db_pwd,
    database : config.db_name
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