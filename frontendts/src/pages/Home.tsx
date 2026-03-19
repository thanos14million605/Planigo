import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Home: React.FC = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/todos" />;

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-6 min-h-[calc(100vh-80px)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold bg-linear-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome to Planigo
      </motion.h1>

      <motion.p className="text-xl text-gray-700 dark:text-gray-200 mb-15">
        Organize, Pin, Complete & Search your todos!
      </motion.p>

      <Link to="/login" className="btn-primary mt-10">
        Get Started
      </Link>
    </motion.div>
  );
};
export default Home;
