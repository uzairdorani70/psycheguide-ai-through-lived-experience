import { useState, useEffect } from "react";
import api from "../api/axios";
import { notify } from "../utils/toast.js";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  ChevronLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(
    localStorage.getItem("username") || "",
  );

  const rawEmail = localStorage.getItem("email");
  const email = rawEmail && rawEmail !== "undefined" ? rawEmail : null;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      localStorage.clear();
      navigate("/login");
    }
  }, [email, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    if (password && password !== confirmPassword) {
      setStatus({
        type: "error",
        msg: "Passwords do not match. Please try again.",
      });
      return;
    }

    setLoading(true);
    try {
      await api.put(`/auth/update-profile/${encodeURIComponent(email)}`, {
        username,
        new_password: password || null,
      });

      localStorage.setItem("username", username);

          notify.success("Profile updated successfully!");;
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
    } catch (err) {
        notify.error(err.response?.data?.detail || "update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-transparent outline flex flex-col">
        {/* HEADER */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft size={24} />
          </button>
        </header>

        {/* MAIN */}
        <main className="flex flex-col md:flex-row gap-8 flex-1 p-6 md:p-12 items-stretch bg-[linear-gradient(135deg, #93c5fd,#d1d5db)]">
          {/* LEFT SIDE */}
          <div className="w-full md:w-1/2 flex">
            <div className="flex-1 bg-transparent rounded-2xl shadow border flex flex-col items-center justify-center p-10">
              <div className="h-36 w-36 border rounded-full flex items-center justify-center text-blue-600 text-5xl font-bold mb-6">
                {username?.charAt(0)?.toUpperCase()}
              </div>

              <h2 className="text-2xl font-bold">{username}</h2>

              <div className="mt-3 flex items-center gap-2 text-gray-900 text-sm">
                <Shield size={14} />
                {email}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-1/2 flex"
          >
            <div className="flex-1 bg-transparent rounded-2xl shadow border p-8 md:p-12 flex flex-col justify-center">
              <form onSubmit={handleUpdate} className="space-y-5">
                {/* STATUS */}
                {status.msg && (
                  <div
                    className={`p-4 rounded-xl flex items-center gap-2 text-sm font-semibold ${
                      status.type === "success"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    {status.msg}
                  </div>
                )}

                {/* USERNAME */}
                <div>
                  <label className="text-xs font-bold text-gray-900">
                    Display Name
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mt-1 p-3 rounded-xl bg-transparent outline"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-xs font-bold text-gray-900">
                    New Password
                  </label>

                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 pr-10 rounded-xl bg-transparent outline"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM */}
                <div>
                  <label className="text-xs font-bold text-gray-900">
                    Confirm Password
                  </label>

                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 pr-10 rounded-xl bg-transparent outline"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default Profile;
