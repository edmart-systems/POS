const mysql = require("mysql");

function connect() {
  const db = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  });
  db.connect(function (error) {
    if (error) {
      console.log("check your database configuration", error);
    } else {
      console.log("database is connected");
    }
  });
  return db;
}

module.exports = connect;
