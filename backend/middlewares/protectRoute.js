import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import pool from "../config/db.js";
import jwtHelper from "../utils/jwtHelper.js";

const protectRoute = asyncHandler(async (req, _, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Token not found. Please log in again.", 401));
  }

  const client = await pool.connect();
  req.pgClient = client;
  await client.query("BEGIN");

  const decoded = await jwtHelper.verifyToken(token);

  const user = await client.query(
    "SELECT id, name, email, role FROM users WHERE id = $1",
    [decoded.id]
  );

  if (user.rows.length === 0) {
    return next(
      new AppError("User belonging to this token does not exist.", 401)
    );
  }

  const { id, name, email, role } = user.rows[0];
  req.user = { id, name, email, role };

  await client.query("COMMIT");
  client.release();

  next();
});

export default protectRoute;
