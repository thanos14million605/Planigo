import dotenv from "dotenv";
dotenv.config({
  path: "./../config.env",
});
import validator from "validator";

import bcryptHelper from "../utils/bcryptHelper.js";
import jwtHelper from "../utils/jwtHelper.js";
import pool from "./../config/db.js";
import asyncHandler from "./../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError("All fields are required.", 400));
  }

  const client = await pool.connect();
  req.pgClient = client;

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

  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match.", 400));
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
    message:
      "Sign up successful. Please check your email for verification OTP.",
    data: {
      user: newUser.rows[0],
    },
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("All fields are required.", 400));
  }

  const client = await pool.connect();
  req.pgClient = client;

  await client.query("BEGIN");

  const user = await client.query(
    "SELECT id, name, isactive, password FROM users WHERE email = $1",
    [email]
  );
  if (user.rows.length === 0) {
    return next(new AppError("Invalid email or password.", 401));
  }

  const candidatePassword = password;

  const { id, name, isactive, password: actualPassword } = user.rows[0];

  if (!isactive) {
    return next(new AppError("Invalid email or password. Not active", 401));
  }

  const isMatch = await bcryptHelper.bcryptCompare(
    candidatePassword,
    actualPassword
  );
  if (!isMatch) {
    return next(
      new AppError("Invalid email or password. Not matching password.", 401)
    );
  }

  const jwt = await jwtHelper.signToken(id);

  res.cookie("jwt", jwt, {
    httpOnly: true,
    maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production", // Use false for local dev
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  await client.query("COMMIT");
  client.release();

  res.status(200).json({
    status: "success",
    data: {
      id,
      name,
      email,
    },
  });
});

const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt", {
    maxAge: 0,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
});

export default {
  signup,
  login,
  logout,
};
