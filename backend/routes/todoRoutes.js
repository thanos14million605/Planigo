import express from "express";
import todoController from "./../controllers/todoController.js";
import protectRoute from "./../middlewares/protectRoute.js";

const router = express.Router();

router.use(protectRoute);
router
  .route("/")
  .post(todoController.createTodo)
  .get(todoController.getAllTodos);

router
  .route("/:todoId")
  .get(todoController.getTodo)
  .patch(todoController.updateTodo)
  .delete(todoController.deleteTodo);

router.patch("/:todoId/pin", todoController.pinTodo);
router.patch("/:todoId/important", todoController.markTodoAsImportant);
router.patch("/:todoId", todoController.markTodoAsComplete);
router.post("/search/:q", todoController.searchTodo);

export default router;
