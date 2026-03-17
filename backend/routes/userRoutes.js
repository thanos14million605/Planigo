import express from "express";
import userController from "../controllers/userController.js";
import protectRoute from "./../middlewares/protectRoute.js";
import restrictTo from "./../middlewares/restrictTo.js";

const router = express.Router();

router.use(protectRoute);
router.route("/").post(restrictTo("admin"), userController.createUser);
router.route("/:id").delete(restrictTo("admin"), userController.deleteUser);
router.route("/me").get(userController.getMe);

export default router;
