import React, { useState } from "react";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    api.searchTodos(query).then((data) => setResults(data || []));
  };

  return (
    <motion.div
      className="max-w-xl mx-auto mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-10"
      >
        <input
          className="flex-1 px-4 py-2 rounded border focus:ring-2 focus:ring-blue-600"
          type="text"
          value={query}
          placeholder="Search todos..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn-primary">Search</button>
      </form>
      <ul className="p-4 rounded-xl glass hover:shadow-xl transition">
        {results.map((todo) => (
          <li
            key={todo.id}
            className="p-4 rounded bg-white dark:bg-gray-800 shadow"
          >
            <Link
              to={`/todos/${todo.id}`}
              className="text-lg font-bold text-blue-600"
            >
              {todo.title}
            </Link>
            <div className="text-xs text-gray-500">{todo.description}</div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Search;
