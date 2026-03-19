import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

type Todo = {
  todo_id: string;
  title: string;
  description: string;
  is_pinned?: boolean;
  is_completed?: boolean;
  is_important?: boolean;
  user_name?: string;
  user_email?: string;
};

const Todos: React.FC = () => {
  const { user, loading } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.getTodos({ page }).then((res) => {
      setTodos(Array.isArray(res.data) ? res.data : []);
      setTotal(res.results || 0);
    });
  }, [page]);

  if (loading) return null;
  if (!user) return <Navigate to="/" />;

  return (
    <motion.div
      className="max-w-6xl mx-auto mt-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Todos
        </h2>

        <Link to="/todos/new" className="btn-primary w-fit">
          + Create Todo
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {todos.map((todo) => (
          <motion.div
            key={todo.todo_id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="glass rounded-2xl p-5 flex flex-col justify-between hover:shadow-2xl transition-all"
          >
            {/* Top Section */}
            <div>
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 line-clamp-1">
                {todo.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                {todo.description}
              </p>

              {/* Status badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {todo.is_pinned && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20">
                    📌 Pinned
                  </span>
                )}
                {todo.is_important && (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-500/20">
                    ❗ Important
                  </span>
                )}
                {todo.is_completed && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-500/20">
                    ✔ Completed
                  </span>
                )}
              </div>

              {/* Author */}
              {todo.user_name && (
                <p className="text-xs text-gray-400">
                  Created by{" "}
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {todo.user_name}
                  </span>
                </p>
              )}
            </div>

            {/* Bottom Section */}
            <div className="mt-4 flex justify-between items-center">
              <Link
                to={`/todos/${todo.todo_id}`}
                className="text-sm font-medium text-blue-600 hover:text-purple-600 transition"
              >
                View Details →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-30 hover:scale-105 transition"
        >
          Prev
        </button>

        <span className="text-gray-700 dark:text-gray-300 font-medium">
          Page {page}
        </span>

        <button
          disabled={total < 1}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-30 hover:scale-105 transition"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Todos;
