import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, Send, CheckCircle2, Bot, ShieldCheck } from "lucide-react";

import { notify} from "../utils/toast.js";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });
    try {
      await api.post("/auth/forgot-password", { email });
      notify.success(
        "If this email is registered, a reset link has been sent to your inbox. Please check your email.",
      );
    } catch (err) {
      notify.error(err.response?.data?.detail || "Something went wrong. Please try again.");
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 p-6 font-sans relative overflow-hidden transition-colors duration-500">
      {/* Clean White Background Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl flex flex-col md:flex-row bg-white dark:bg-[#111827] rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden border border-slate-100 dark:border-white/10 relative z-10"
      >
        {/* Left Side: Illustration / Branding Area */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex flex-col justify-between relative overflow-hidden animate-gradient-xy">
          <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none mix-blend-overlay"></div>

          <div className="relative z-10">
            <div className="bg-white/20 p-4 rounded-2xl w-fit backdrop-blur-md border border-white/20 shadow-lg inline-flex items-center gap-3">
              <img
                src="/logo.png"
                alt="PsycheGuide Logo"
                className="w-8 h-8 object-contain drop-shadow-md"
              />
              <span className="text-2xl font-black tracking-tight drop-shadow-sm">
                PsycheGuide
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-16 md:mt-0">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-black leading-tight mb-6"
            >
              Don't worry,
              <br />
              <span className="text-indigo-200">we've got you.</span>
            </motion.h2>
            <p className="text-indigo-100 text-lg leading-relaxed font-medium">
              Enter your email address to receive a secure password reset link
              to access your account again.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 mt-8 md:mt-0 text-sm font-medium text-indigo-200">
            <ShieldCheck size={18} />
            <span>Secure Password Recovery Flow</span>
          </div>
        </div>

        {/* Right Side: Recovery Form Area */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-center bg-white/50 dark:bg-transparent">
          <div className="mb-10">
            <div className="h-14 w-14 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 p-3 shadow-inner">
              <Mail
                size={28}
                className="text-blue-600 dark:text-indigo-400"
              />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              Recover Password
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-base">
              We'll send you an email to reset it.
            </p>
          </div>

          {status.msg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3 border ${
                status.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
              }`}
            >
              {status.type === "success" && (
                <CheckCircle2 size={18} className="shrink-0" />
              )}
              {status.msg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Registered Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="your@gmail.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-[#1e293b]/80 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl outline-none transition-all font-medium text-slate-900 dark:text-white shadow-sm focus:shadow-md focus:shadow-blue   -500/10 dark:placeholder-slate-500"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full mt-4 bg-indigo-600 text-white py-4 rounded-xl font-black text-[15px] flex items-center justify-center gap-2 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  Send Reset Link <Send size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;