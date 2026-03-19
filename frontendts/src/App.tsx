// import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import Navbar from "./components/Navbar";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Todos from "./pages/Todos.tsx";
import TodoDetail from "./pages/TodoDetail.tsx";
import Profile from "./pages/Profile.tsx";
import Search from "./pages/Search.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import CreateTodo from "./pages/CreateTodo.tsx";

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-all duration-500">
          {" "}
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/todos/:id" element={<TodoDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/todos/new" element={<CreateTodo />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
