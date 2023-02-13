const mysql = require('mysql2');

const con = mysql.createConnection({
  host: "127.0.0.1",
    port:3306,
    database: "Blog",
    user: "root",
    password: "123456"
});

con.connect(function(err) {
  if (err) {
    throw err;
  } 
  console.log("Connected!");
});

module.exports = con