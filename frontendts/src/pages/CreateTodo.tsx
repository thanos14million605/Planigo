import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { motion } from "framer-motion";

const CreateTodo: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createTodo({ title, description });
      navigate("/todos");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating todo.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="max-w-lg mx-auto mt-16 glass p-8 rounded-2xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-green-600 dark:text-green-300 mb-7">
        Create Todo
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          className="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-green-600"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-green-600"
          rows={5}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Todo"}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateTodo;
