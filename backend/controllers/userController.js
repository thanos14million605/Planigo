import asyncHandler from "../utils/asyncHandler.js";
import pool from "../config/db.js";
import bcryptHelper from "../utils/bcryptHelper.js";

const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("All fields are required.", 400));
  }

  const client = await pool.connect();
  req.pgClient = client;
  await client.query("BEGIN");
  const user = await client.query(
    "SELECT id, name, email, role FROM users WHERE id = $1 RETURNING *",
    [req.user.id]
  );

  if (user.rows.length === 0 || user.role !== "admin") {
    return next(new AppError("User not found", 401));
  }

  const isExistingUser = await client.query(
    "SELECT email from users WHERE email = $1",
    [email]
  );

  if (isExistingUser.rows.length > 0) {
    return next(new AppError("User already exists. Please sign in.", 400));
  }

  const isValidEmail = validator.isEmail(email);
  if (!isValidEmail) {
    return next(new AppError("Please enter a valid email.", 400));
  }

  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters.", 400));
  }

  await client.query("BEGIN");

  const hashedPassword = await bcryptHelper.bcryptHash(password);

  const newUser = await client.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, hashedPassword]
  );

  await client.query("COMMIT");
  client.release();

  res.status(201).json({
    status: "success",
    message: "User created successfully.",
    data: {
      user: newUser.rows[0],
    },
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  req.pgClient = client;

  await client.query("BEGIN");
  const user = await client.query(
    "SELECT id, name, email, role FROM users WHERE id = $1 RETURNING *",
    [req.user.id]
  );

  if (user.rows.length === 0 || user.rows?.[0]?.role !== "admin") {
    return next(new AppError("User not found", 401));
  }

  const { id } = req.params;
  await client.query("DELETE FROM users WHERE id = $1", [id]);

  await client.query("COMMIT");
  client.release();

  res.status(201).json({
    status: "success",
    message: "User deleted successfully.",
  });
});

const getMe = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  req.pgClient = client;

  await client.query("BEGIN");
  const me = await client.query(
    "SELECT * FROM users WHERE id = $1 RETURNING *",
    [req.user.id]
  );

  res.status(200).json({
    status: "success",
    data: {
      ...me.rows[0],
    },
  });
});

export default { createUser, deleteUser, getMe };
