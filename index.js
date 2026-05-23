require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const { connectDB } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static frontend ─────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ── API Routes ──────────────────────────────────────────────
app.use("/api/cars", require("./routes/cars"));
app.use("/api/odometer", require("./routes/odometer"));
app.use("/api/oil", require("./routes/oil"));
app.use("/api/filters", require("./routes/filters"));
app.use("/api/licenses", require("./routes/licenses"));
app.use("/api/reports", require("./routes/reports"));

// ── Health check ────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() }),
);

// ── EJS Pages ───────────────────────────────────────────────
const pages = {
  "/": "index",
  "/index": "index",
  "/cars": "cars",
  "/filters": "filters",
  "/licenses": "licenses",
  "/monthly-reports": "monthly-reports",
  "/odometer": "odometer",
  "/odometer-capture": "odometer-capture",
  "/oil": "oil",
  "/oil-status": "oil-status",
  "/reports": "reports",
  "/index321": "index321",
};

app.use((req, res, next) => {
  if (!req.path.endsWith(".html")) return next();
  const cleanPath = req.path.slice(0, -5) || "/";
  const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  res.redirect(301, cleanPath + query);
});

Object.entries(pages).forEach(([route, view]) => {
  app.get(route, (_req, res) => res.render(view));
});

// ── Catch-all → frontend ────────────────────────────────────
app.get("*", (_req, res) => res.render("index"));

// ── Global error handler (لازم يكون آخر middleware) ─────────
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

// mysql://root:uMbwdbOeMTJWkcyHvfEKaHhXpgqYXOdL@roundhouse.proxy.rlwy.net:12340/railway

app.listen(PORT, () => {
  console.log(`\n🚗  Car Tracker (MVC) شغال على http://localhost:${PORT}\n`);
});
