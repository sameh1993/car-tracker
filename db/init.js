const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const init = async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
    charset: "utf8mb4",
  });

  console.log("🔧  بيتم إنشاء قاعدة البيانات والجداول...");

  const sql = fs.readFileSync(path.join(__dirname, "..", "schema.sql"), "utf8");
  await conn.query(sql);

  console.log("✅  تم إنشاء كل الجداول بنجاح!");
  await conn.end();
};

init().catch((err) => {
  console.error("❌  خطأ:", err.message);
  process.exit(1);
});
