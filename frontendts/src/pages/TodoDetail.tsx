import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FiStar,
  FiCheckCircle,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
} from "react-icons/fi";
import { BsPinAngle } from "react-icons/bs";

type Todo = {
  id: string;
  title: string;
  description: string;
  is_pinned?: boolean;
  is_complete?: boolean;
  is_important?: boolean;
};

const TodoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [todo, setTodo] = useState<Todo | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    api.getTodo(id!).then((data) => {
      setTodo(data);
      setTitle(data.title);
      setDescription(data.description);
    });
  }, [id]);

  if (loading) return null;
  if (!user) return <Navigate to="/" />;
  if (!todo) return <div className="mt-10 text-center">Loading...</div>;

  const handle = async (action: string) => {
    if (action === "pin") await api.pinTodo(id!);
    if (action === "important") await api.importantTodo(id!);
    if (action === "complete") await api.completeTodo(id!);

    if (action === "delete") {
      await api.deleteTodo(id!);
      navigate("/todos");
      return;
    }

    const updated = await api.getTodo(id!);
    setTodo(updated);
  };

  const handleSave = async () => {
    await api.updateTodo(id!, { title, description });
    const updated = await api.getTodo(id!);
    setTodo(updated);
    setEditMode(false);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-12 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="glass rounded-2xl p-8 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          {editMode ? (
            <input
              className="input-modern text-xl font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">
              {todo.title}
            </h2>
          )}

          {/* Edit Toggle */}
          <button
            onClick={() => setEditMode(!editMode)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {editMode ? <FiX /> : <FiEdit />}
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          {editMode ? (
            <textarea
              className="input-modern"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {todo.description}
            </p>
          )}
        </div>

        {/* Status Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => handle("pin")}
            className={`hover:cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${
              todo.is_pinned
                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <BsPinAngle />
            {todo.is_pinned ? "Pinned" : "Pin"}
          </button>

          <button
            onClick={() => handle("important")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${
              todo.is_important
                ? "bg-red-100 text-red-600 dark:bg-red-500/20"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <FiStar />
            {todo.is_important ? "Important" : "Mark Important"}
          </button>

          <button
            onClick={() => handle("complete")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${
              todo.is_complete
                ? "bg-green-100 text-green-600 dark:bg-green-500/20"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <FiCheckCircle />
            {todo.is_complete ? "Completed" : "Mark Complete"}
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center">
          {/* Save button (only in edit mode) */}
          {editMode ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 btn-primary"
            >
              <FiSave />
              Save Changes
            </button>
          ) : (
            <div />
          )}

          {/* Delete */}
          <button
            onClick={() => handle("delete")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            <FiTrash2 />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoDetail;
