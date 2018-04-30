const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mear_stack"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});