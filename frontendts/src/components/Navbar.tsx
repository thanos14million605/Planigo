// import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion } from "framer-motion";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      className="sticky top-0 z-50 glass px-6 py-3 flex items-center justify-between"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Link
        to="/"
        className="font-bold text-xl text-blue-600 dark:text-blue-400"
      >
        Planigo
      </Link>
      <div className="flex items-center gap-3">
        {user && (
          <>
            <Link
              to="/todos"
              className={classNames(
                "px-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400",
                {
                  "font-bold underline": location.pathname.startsWith("/todos"),
                }
              )}
            >
              Todos
            </Link>

            <Link
              to="/search"
              className={classNames(
                "px-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400",
                { "font-bold underline": location.pathname === "/search" }
              )}
            >
              Search
            </Link>
          </>
        )}
        {user && (
          <Link
            to="/profile"
            className={classNames(
              "px-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400",
              { "font-bold underline": location.pathname === "/profile" }
            )}
          >
            Profile
          </Link>
        )}
        {user?.role === "admin" && (
          <Link
            to="/admin/users"
            className="px-2 text-red-700 dark:text-red-300"
          >
            Admin
          </Link>
        )}
        <button
          onClick={toggle}
          className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-blue-200 dark:hover:bg-blue-500"
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <FiSun className="w-5 h-5" />
          ) : (
            <FiMoon className="w-5 h-5" />
          )}
        </button>
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all ml-2"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-all ml-2"
            >
              Signup
            </Link>
          </>
        ) : (
          <button
            className="btn-primary"
            onClick={async () => {
              await logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
