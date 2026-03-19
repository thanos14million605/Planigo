import React from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" />;

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-16 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="glass rounded-3xl p-8 md:p-10 shadow-xl">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full blur-xl opacity-30 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">
              {user.name}
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {user.email}
            </p>

            {user.role && (
              <span className="inline-block mt-3 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20">
                {user.role}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 mb-8"></div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 mb-1">Full Name</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {user.name}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {user.email}
            </p>
          </div>

          {user.role && (
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {user.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
