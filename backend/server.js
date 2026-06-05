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
 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 
const allowedOrigins = [
  "http://localhost:5173",
  "https://pro-tasker-1.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server / Postman

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
 
app.use("/api/users", userRoutes);
 
 app.use("/api/projects", projectRoutes)
db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});