import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/signup").post(authController.signup);
router.route("/logout").post(authController.logout);

export default router;
