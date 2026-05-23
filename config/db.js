const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "car_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
  timezone: "+00:00",
});

const connectDB = async () => {
  const conn = await pool.getConnection();
  console.log("✅  MySQL متصل بنجاح");
  conn.release();
};

module.exports = { pool, connectDB };
