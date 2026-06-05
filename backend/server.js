// Backend server entrypoint for the Pro Tasker API.
// Sets up Express, CORS, static asset serving, route mounting, and global error handling.
const express = require('express');
const path = require('path');
const db = require('./connection/db');
const cors = require("cors")
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require("./routes/taskRoutes")
const projectRoutes = require("./routes/projectRoutes")
require('dotenv').config();
 
const app = express();
const PORT = process.env.PORT || 3001;
 
// Parse incoming form-encoded and JSON request bodies.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 
// Whitelist trusted frontend hosts for browser-based CORS requests.
const allowedOrigins = [
  "http://localhost:5173",
  "https://pro-tasker-1.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("BLOCKED CORS:", origin); // 🔥 Useful debug log for blocked origins
    return callback(null, false); // ❗ Do not allow unknown origins
  },
  credentials: true
}));
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
 
// Mount project routes under /api/projects
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

// Global error handler catches any errors that bubble up from route handlers.
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(500).json({
    message: err.message,
  });
});

// Log every incoming request for easier debugging of API traffic.
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});