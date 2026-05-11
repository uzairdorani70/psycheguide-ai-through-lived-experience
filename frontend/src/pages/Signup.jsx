import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match ");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Registration successful ! Please login");

      setTimeout(() => {
        navigate("/login");
      }, 600);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl flex flex-col md:flex-row-reverse 
        bg-white dark:bg-[#111827] 
        rounded-lg shadow-lg  
        border border-slate-100 dark:border-white/10 overflow-hidden"
      >
        {/* LEFT SIDE */}
        <div
          className="w-full md:w-1/2 p-6 sm:p-10 md:p-14 lg:p-16 
        bg-gradient-to-br from-blue-600 to-blue-700 text-white flex flex-col justify-between"
        >
          <div className="bg-white/20 p-4 rounded-2xl w-fit backdrop-blur-md flex items-center gap-3">
            <img src="/logo.png" className="w-8 h-8" />
            <span className="font-black text-xl">PsycheGuide</span>
          </div>

          <div className="mt-12 md:mt-0">
            <h2 className="text-2xl md:text-5xl font-black leading-tight mb-4">
              Start your journey <br />
              <span className="text-blue-200">to better wellness</span>
            </h2>

            <p className="text-blue-100 text-base md:text-lg">
              Join thousands improving their mental health with AI support.
            </p>
          </div>

          <div className="flex items-center gap-2 text-blue-200 text-sm mt-8">
            <ShieldCheck size={18} />
            100% Secure & Confidential
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-black text-blue-700 mb-2">
            Create Account
          </h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-4 text-sm font-bold text-slate-600 dark:text-slate-300 
            hover:text-blue-600 transition flex items-center gap-1"
          >
            ← Back to Home
          </button>

          <p className="text-slate-500 mb-6">Get started with PsycheGuide</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* USERNAME */}
            <Input
              icon={<User size={18} />}
              placeholder="Full Name"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />

            {/* EMAIL */}
            <Input
              icon={<Mail size={18} />}
              placeholder="Email"
              type="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            {/* PASSWORD */}
            <PasswordInput
              icon={<Lock size={18} />}
              placeholder="Password"
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            {/* CONFIRM PASSWORD */}
            <PasswordInput
              icon={<Lock size={18} />}
              placeholder="Confirm Password"
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
            />

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

/* ---------------- Components ---------------- */

const Input = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
    <input
      {...props}
      className="w-full pl-10 py-3 border rounded-xl focus:outline-none"
      required
    />
  </div>
);

const PasswordInput = ({ icon, show, toggle, ...props }) => (
  <div className="relative">
    <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
    <input
      {...props}
      type={show ? "text" : "password"}
      className="w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none"
      required
    />
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-3 text-gray-400"
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

export default Signup;
