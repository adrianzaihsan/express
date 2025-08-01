require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const morgan = require("morgan");
const { URL } = require("url");

const app = express();
const port = process.env.PORT || 5000;

// Parse MYSQL_URL dari environment
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

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("🟢 Growing API is running!");
});


// Contoh route tes koneksi
app.get("/ping", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ result: rows[0].result });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
