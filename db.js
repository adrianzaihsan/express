require("dotenv").config();
const mysql = require("mysql2/promise");
const { URL } = require("url");

const dbUrl = process.env.MYSQL_URL;
const parsed = new URL(dbUrl);

const db = mysql.createPool({
  host: parsed.hostname,
  port: parsed.port,
  user: parsed.username,
  password: parsed.password,
  database: parsed.pathname.replace("/", ""),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
