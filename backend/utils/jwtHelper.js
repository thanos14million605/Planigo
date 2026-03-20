import { promisify } from "util";
import dotenv from "dotenv";
dotenv.config({
  path: "./../../config.env",
});

import jwt from "jsonwebtoken";

const signToken = async (userId) => {
  return await jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
  });
};

const verifyToken = async (token) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};

export default { signToken, verifyToken };
