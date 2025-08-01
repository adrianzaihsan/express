require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const morgan = require("morgan");
const { URL } = require("url");

const app = express();
const port = process.env.PORT || 5001;

// Validasi URL MySQL
if (!process.env.MYSQL_URL) {
  throw new Error("MYSQL_URL tidak ditemukan di .env");
}

let parsed;
try {
  parsed = new URL(process.env.MYSQL_URL);
} catch (e) {
  console.error("❌ MYSQL_URL tidak valid:", process.env.MYSQL_URL);
  process.exit(1);
}

const db = mysql.createPool({
  host: parsed.hostname,
  port: parsed.port,
  user: parsed.username,
  password: parsed.password,
  database: parsed.pathname.slice(1), // remove '/'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(
  cors({
    origin: ["https://react-ckui.vercel.app", "http://localhost:5173"],
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Cek koneksi DB
app.get("/ping", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ result: rows[0].result });
  } catch (err) {
    console.error("DB ERROR:", err);
    res
      .status(500)
      .json({ error: "Database connection failed", detail: err.message });
  }
});

// Tes lihat tabel
app.get("/db-test", async (req, res) => {
  try {
    const [tables] = await db.query("SHOW TABLES");
    res.json({ tables });
  } catch (err) {
    console.error("TABLE ERROR:", err);
    res.status(500).json({ error: "Table check failed", detail: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
