import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Lock,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
} from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const MIN_LENGTH = 8;

  const getStrength = () => {
    if (newPassword.length < MIN_LENGTH) return "Too Short";
    if (newPassword.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/))
      return "Strong";
    return "Medium";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ validation
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    if (newPassword.length < MIN_LENGTH) {
      toast.error(`Password must be at least ${MIN_LENGTH} characters ❌`);
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        email,
        new_password: newPassword,
      });

      toast.success("Password updated successfully 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid or expired link ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8"
      >
        {/* HEADER */}
        <div className="mb-6 text-center">
          <div className="bg-blue-600 p-3 rounded-xl inline-flex mb-4">
            <ShieldCheck className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-gray-500 text-sm">
            Enter your email and new password
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-4 text-sm font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1"
        >
          ← Back to Home
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full pl-10 py-3 border rounded-lg outline-none focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="New Password"
              className="w-full pl-10 pr-10 py-3 border rounded-lg outline-none focus:border-blue-500"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* STRENGTH */}
          {newPassword && (
            <p className="text-xs font-semibold">
              Strength:{" "}
              <span
                className={
                  getStrength() === "Strong"
                    ? "text-green-600"
                    : getStrength() === "Medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                }
              >
                {getStrength()}
              </span>
            </p>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type={showConfirm ? "text" : "password"}
              required
              placeholder="Confirm Password"
              className="w-full pl-10 pr-10 py-3 border rounded-lg outline-none focus:border-blue-500"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* SUBMIT */}
          <button
            disabled={
              loading ||
              newPassword.length < MIN_LENGTH ||
              newPassword !== confirmPassword
            }
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
