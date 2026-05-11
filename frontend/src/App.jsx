import React, { useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';
import Home from "./pages/Home";
import Chat from './pages/Chat';
import Dashboard from "./pages/Dashboard";
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from "./pages/Profile";
import Resources from "./pages/Resources"




const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // Purposely ensuring the global HTML root is forced to light mode 
    // to restrict the dark theme logic exclusively to the Chat component as per requirements.
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.backgroundColor = ''; 
  }, [theme]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/resources" element={<Resources />} />

        {/* Protected Routes (In sab ko wrap karna zaroori hai) */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Profile ko bhi yahan wrap karein */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
    
  );
}
export default App;