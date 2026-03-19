import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

const AdminUsers: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user?.role === "admin") {
      api.getUsers().then((data) => setUsers(data || []));
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    await api.deleteUser(id);
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createUser(form);
    const newUsers = await api.getUsers();
    setUsers(newUsers || []);
    setForm({ name: "", email: "", password: "" });
  };

  if (!user || user.role !== "admin")
    return <div className="mt-16 text-center">Access denied.</div>;

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER */}
      <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
        Admin User Management
      </h2>

      {/* CREATE USER FORM */}
      <motion.form
        onSubmit={handleCreate}
        className="glass p-6 rounded-2xl mb-10 grid md:grid-cols-4 gap-4 items-end"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white/70 dark:bg-gray-800/60"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white/70 dark:bg-gray-800/60"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white/70 dark:bg-gray-800/60"
          required
        />
        <button
          type="submit"
          className="h-[42px] rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-105 transition"
        >
          Create
        </button>
      </motion.form>

      {/* USERS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u, i) => (
          <motion.div
            key={u.id}
            className="glass p-5 rounded-2xl flex flex-col justify-between hover:shadow-2xl transition-all"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* USER INFO */}
            <div className="flex items-center gap-4 mb-4">
              {/* AVATAR */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {u.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                  {u.name}
                </h3>
                <p className="text-sm text-gray-500 break-all">{u.email}</p>
              </div>
            </div>

            {/* ROLE BADGE */}
            <div className="mb-4">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  u.role === "admin"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {u.role || "user"}
              </span>
            </div>

            {/* ACTION */}
            {u.role !== "admin" ? (
              <button
                onClick={() => handleDelete(u.id)}
                className="mt-auto w-full py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 hover:scale-105 transition"
              >
                Delete User
              </button>
            ) : (
              <button
                // onClick={() => handleDelete(u.id)}
                className="mt-auto w-full py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 hover:scale-105 transition"
              >
                Manage Other Users
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminUsers;
