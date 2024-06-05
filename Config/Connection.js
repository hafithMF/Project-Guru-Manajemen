const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: "roundhouse.proxy.rlwy.net",
  user: "root",
  database: "railway",
  password: "PJYruJbmcsCJJzsxpdSoAOoyfVvXtccv",
  port: 52654,
  waitForConnections: false,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection;