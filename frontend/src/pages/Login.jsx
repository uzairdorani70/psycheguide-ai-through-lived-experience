import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { notify} from "../utils/toast.js";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("email", formData.email);
      localStorage.setItem("username", res.data.username);

      notify.success("Login successful ");
    

      setTimeout(() => {
        navigate("/dashboard");
      }, 400);
    } catch (err) {
      notify.error(err.response?.data?.detail || "Invalid Email or Password ");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center text-gray-900 p-4 sm:p-6 font-sans relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl flex flex-col md:flex-row-reverse 
       rounded-xl shadow-2xl  overflow-hidden"
      >
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-14 lg:p-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex flex-col justify-between relative">
          <div className="bg-white/20 p-4 rounded-2xl w-fit backdrop-blur-md border border-white/20 flex items-center gap-3">
            <img src="/logo.png" className="w-8 h-8" />
            <span className="font-black text-xl">PsycheGuide</span>
          </div>

          <div className="mt-12 md:mt-0">
            <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              Your safe space <br />
              <span className="text-indigo-200">anytime, anywhere</span>
            </h2>

            <p className="text-indigo-100 text-base md:text-lg">
              Sign in to continue your mental wellness journey with AI support.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-indigo-200 mt-8">
            <ShieldCheck size={18} />
            Secure & Private
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full bg-white  md:w-1/2 p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-black mb-2">Welcome Back</h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-600 
            hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-1"
          >
            ← Back to Home
          </button>

          <p className="text-slate-500 mb-6">Sign in to continue</p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="text-sm font-bold">Email</label>
              <div className="relative mt-1">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  placeholder="your@gmail.com"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-bold">Password</label>
              <div className="relative mt-1">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <a
                  href="/forgot-password"
                  className="text-blue-600 text-sm hover:underline block text-right mt-1"
                >
                  Forgot Password?
                </a>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Don't have an account?{" "}
            <Link className="text-blue-600 font-bold" to="/signup">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
