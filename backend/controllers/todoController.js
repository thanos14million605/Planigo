import pool from "../config/db.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "./../utils/asyncHandler.js";
import apiFeatures from "../utils/apiFeatures.js";

const { applyFieldLimiting, applyFiltering, applySorting, applyPagination } =
  apiFeatures;

const createTodo = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return next(new AppError("All fields are required", 400));
  }

  const client = await pool.connect();
  req.pgClient = client;
  await client.query("BEGIN");

  const user = await client.query(
    "SELECT id, name, email FROM users WHERE id = $1 RETURNING *",
    [req.user.id]
  );

  if (user.rows.length === 0) {
    return next(new AppError("User not found", 401));
  }

  const newTodo = await client.query(
    "INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
    [1, title, description]
  );

  await client.query("COMMIT");
  client.release();

  res.status(201).json({
    status: "success",
    data: {
      author: req.user.name,
      ...newTodo.rows[0],
    },
  });
});

const getTodo = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  req.pgClient = client;
  const user = client.query(
    "SELECT id, name, email FROM users WHERE id = $1 RETURNING *",
    [req.user.id]
  );
  if (user.rows.length === 0) {
    return next(new AppError("User not found", 401));
  }
  const { todoId } = req.params;

  const todo = await client.query(
    "SELECT * FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
    [todoId, req.user.id]
  );

  if (todo.rows.length === 0) {
    return next(new AppError("Todo not found", 404));
  }

  client.release();
  res.status(200).json({
    status: "success",
    data: {
      ...todo.rows[0],
    },
  });
});

const getAllTodos = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  req.pgClient = client;

  await client.query("BEGIN");

  const selectedFields = applyFieldLimiting(req.query);
  console.log(selectedFields);

  const { whereByClause, values } = applyFiltering(req.query);
  console.log(whereByClause, values);

  const limitClause = applyPagination(req.query);
  console.log(limitClause);

  const orderByClause = applySorting(req.query);
  console.log(orderByClause);

  let selectQuery = "";
  if (selectedFields) {
    selectQuery = `SELECT ${selectedFields}`;
  }

  selectQuery = `SELECT *`;

  const sql = `
    ${selectQuery}
    FROM todos 
    JOIN users ON todos.user_id = users.id
    ${whereByClause}
    ${orderByClause} 
    ${limitClause}
  `;

  const todos = await client.query(sql, values);

  if (todos.rows.length === 0) {
    return next(new AppError("No matching records.", 404));
  }

  await client.query("COMMIT");
  client.release();

  res.status(200).json({
    status: "success",
    results: todos.rows.length,
    data: {
      ...todos.rows,
    },
  });
});

const updateTodo = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  req.pgClient = client;
  await client.query("BEGIN");
  const user = client.query(
    "SELECT id, name, email FROM users WHERE id = $1 RETURNING *",
    [req.user.id]
  );
  if (user.rows.length === 0) {
    return next(new AppError("User not found", 401));
  }

  const { title, description } = req.body;
  if (!title || !description) {
    return next(
      new AppError("At least one of title or description is required.", 400)
    );
  }

  const { todoId } = req.params;
  const todo = await client.query(
    "SELECT * FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
    [todoId, req.user.id]
  );

  if (todo.rows.length === 0) {
    return next(new AppError("Todo not found", 404));
  }

  let updatedTodo;
  if (title && description) {
    updatedTodo = await client.query(
      "UPDATE todos SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, description, todoId, req.user.id]
    );
  } else if (title && !description) {
    updatedTodo = await client.query(
      "UPDATE todos SET title = $1 WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, todoId, req.user.id]
    );
  } else if (!title && description) {
    updatedTodo = await client.query(
      "UPDATE todos SET description = $1 WHERE id = $3 AND user_id = $4 RETURNING *",
      [description, todoId, req.user.id]
    );
  }

  if (updatedTodo.rows.length === 0) {
    return next(
      new AppError("Couldn't update todo. Please try again later!!!", 500)
    );
  }

  await client.query("COMMIT");
  client.release();

  res.status(200).json({
    status: "success",
    message: "Todo updated successfully",
    data: {
      ...updatedTodo.rows[0],
    },
  });
});

const deleteTodo = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  req.pgClient = client;
  await client.query("BEGIN");
  const user = client.query(
    "SELECT id, name, email FROM users WHERE id = $1 RETURNING *",
    [req.user.id]
  );
  if (user.rows.length === 0) {
    return next(new AppError("User not found", 401));
  }

  const { todoId } = req.params;
  const todo = await client.query(
    "SELECT * FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
    [todoId, req.user.id]
  );

  if (todo.rows.length === 0) {
    return next(new AppError("Todo not found", 404));
  }

  await client.query(
    "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
    [todoId, req.user.id]
  );

  await client.query("COMMIT");
  client.release();

  res.status(200).json({
    status: "success",
    message: "Todo deleted successfully",
  });
});

const pinTodo = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  req.pgClient = client;
  await client.query("BEGIN");
  const user = client.query(
    "SELECT id, name, email FROM users WHERE id = $1 RETURNING *",
    [req.user.id]
  );
  if (user.rows.length === 0) {
    return next(new AppError("User not found", 401));
  }

  const { todoId } = req.params;
  const todo = await client.query(
    "SELECT is_pinned FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
    [todoId, req.user.id]
  );

  if (todo.rows.length === 0) {
    return next(new AppError("Todo not found", 404));
  }

  const { is_pinned } = todo.rows[0];
  const updatedTodo = await client.query(
    "UPDATE todos SET is_pinned = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [!is_pinned, todoId, req.user.id]
  );

  if (updatedTodo.rows.length === 0) {
    return next(
      new AppError("Couldn't updated todo. Please try again later!!!", 500)
    );
  }

  await client.query("COMMIT");
  client.release();

  res.status(200).json({
    status: "success",
    message: is_pinned
      ? "Todo unpinned successfully"
      : "Todo pinned successfully",
    data: {
      ...updatedTodo.rows[0],
    },
  });
});

const markTodoAsImportant = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  req.pgClient = client;
  await client.query("BEGIN");
  const user = client.query(
    "SELECT id, name, email FROM users WHERE id = $1 RETURNING *",
    [req.user.id]
  );
  if (user.rows.length === 0) {
    return next(new AppError("User not found", 401));
  }

  const { todoId } = req.params;
  const todo = await client.query(
    "SELECT is_important FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
    [todoId, req.user.id]
  );

  if (todo.rows.length === 0) {
    return next(new AppError("Todo not found", 404));
  }

  const { is_important } = todo.rows[0];
  const updatedTodo = await client.query(
    "UPDATE todos SET is_important = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [!is_important, todoId, req.user.id]
  );

  if (updatedTodo.rows.length === 0) {
    return next(
      new AppError("Couldn't updated todo. Please try again later!!!", 500)
    );
  }

  await client.query("COMMIT");
  client.release();

  res.status(200).json({
    status: "success",
    message: is_important
      ? "Todo marked unimportant successfully"
      : "Todo marked important successfully",
    data: {
      ...updatedTodo.rows[0],
    },
  });
});

const markTodoAsComplete = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  req.pgClient = client;
  await client.query("BEGIN");
  const user = client.query(
    "SELECT id, name, email FROM users WHERE id = $1 RETURNING *",
    [req.user.id]
  );
  if (user.rows.length === 0) {
    return next(new AppError("User not found", 401));
  }

  const { todoId } = req.params;
  const todo = await client.query(
    "SELECT is_complete FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
    [todoId, req.user.id]
  );

  if (todo.rows.length === 0) {
    return next(new AppError("Todo not found", 404));
  }

  const { is_complete } = todo.rows[0];
  const updatedTodo = await client.query(
    "UPDATE todos SET is_complete = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [!is_complete, todoId, req.user.id]
  );

  if (updatedTodo.rows.length === 0) {
    return next(
      new AppError("Couldn't updated todo. Please try again later!!!", 500)
    );
  }

  await client.query("COMMIT");
  client.release();

  res.status(200).json({
    status: "success",
    message: is_complete
      ? "Todo marked completed successfully"
      : "Todo marked uncompleted successfully",
    data: {
      ...updatedTodo.rows[0],
    },
  });
});

const searchTodo = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  req.pgClient = client;
  await client.query("BEGIN");
  const user = client.query(
    "SELECT id, name, email FROM users WHERE id = $1 RETURNING *",
    [req.user.id]
  );
  if (user.rows.length === 0) {
    return next(new AppError("User not found", 401));
  }

  const { q } = req.params;
  const lowercaseQ = q.toLowerCase();
  const matchedResults = await client.query(
    "SELECT * FROM todos WHERE LOWER(title) LIKE '%' || $1 || '%' OR LOWER(description) LIKE '%' || $2 || '%' RETURNING *",
    [lowercaseQ, lowercaseQ]
  );

  if (matchedResults.rows.length === 0) {
    return next(new AppError("No matching records found", 404));
  }

  await client.query("COMMIT");
  client.release();
  res.status(200).json({
    status: "success",
    results: matchedResults.rows.length,
    data: {
      ...matchedResults.rows,
    },
  });
});

export default {
  createTodo,
  getTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
  pinTodo,
  markTodoAsComplete,
  markTodoAsImportant,
  searchTodo,
};
