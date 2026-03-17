import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
