import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";

import app from "./app.js";
import pool from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "./config.env"),
});

pool
  .query("SELECT NOW()")
  .then((result) => console.log(`DB connection made at ${result.rows[0].now}`))
  .catch((err) => console.log("Error in DB connection", err));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontendts/dist")));

  app.get((req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
