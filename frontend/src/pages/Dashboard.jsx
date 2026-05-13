import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  User,
  LogOut,
  Loader2,
  LayoutDashboard,
  BookOpen,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

const getDonutColors = (title, value) => {
  const t = title.toLowerCase();

  if (t.includes("mood")) {
    return value >= 50 ? ["#9ca3af", "#e5e7eb"] : ["#16a34a", "#e5e7eb"]; // green
  }

  if (t.includes("session")) {
    return ["#3b82f6", "#e5e7eb"];
  }

  if (t.includes("crisis")) {
    return ["#ef4444", "#e5e7eb"];
  }

  return ["#6366f1", "#e5e7eb"];
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_chats: 0,
    crisis_alerts: 0,
    mood_data: [],
  });

  const getAiMessage = (moodStatus) => {
    if (moodStatus === "Stable") {
      return "You are maintaining a healthy emotional balance today. Keep up your positive habits.";
    }

    if (moodStatus === "Moderate") {
      return "Your emotional state shows some fluctuations. A short break or reflection may help.";
    }

    return "It seems like you're going through a tough moment. Be kind to yourself today.";
  };
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [moodStatus, setMoodStatus] = useState("Stable");

  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get(`/dashboard/stats/${email}`);
      setStats(res.data);
      setLoading(false);
    };
    fetchStats();
  }, [email]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const updateMoodFromAI = async (text) => {
    try {
      const res = await api.post("/ai/predict", {
        text,
      });

      const prediction = res.data.prediction;

      setMoodStatus(
        prediction === "critical"
          ? "Low"
          : prediction === "moderate"
            ? "Moderate"
            : "Stable",
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const runAI = async () => {
      if (stats.mood_data && stats.mood_data.length > 0) {
        const text = stats.mood_data.map((m) => m.score).join(" ");

        await updateMoodFromAI(text);
      }
    };

    runAI();
  }, [stats.mood_data]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  const mood = 75;
  const sessions = Math.min(stats.total_chats, 100);
  const alerts = Math.min(stats.crisis_alerts, 100);

  const makeDonut = (value) => [
    { name: "value", value },
    { name: "rest", value: 100 - value },
  ];

  const moodData = makeDonut(mood);
  const sessionData = makeDonut(sessions);
  const alertData = makeDonut(alerts);

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative z-50 w-72 h-screen shrink-0 bg-[#0b0f19] text-white p-5 flex flex-col overflow-hidden
        transform transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div className="bg-white/10 p-4 rounded-md w-fit backdrop-blur-md flex items-center gap-3">
            <img src="/logo.png" className="w-8 h-8" alt="" />
            <span className="font-black text-xl">PsycheGuide</span>
          </div>

          <button type="button" className="md:hidden" onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="shrink-0">
            <Nav
              icon={<User />}
              label="Profile"
              onClick={() => navigate("/profile")}
            />
            <Nav
              icon={<BookOpen />}
              label="Lived Experiences"
              onClick={() => navigate("/resources")}
            />
            <Nav
              icon={<MessageSquare />}
              label="Chat AI"
              onClick={() => navigate("/chat")}
            />
            <Nav icon={<LayoutDashboard />} label="Dashboard" active />
          </div>

          <div className="flex-1 min-h-4" aria-hidden />

          <button
            type="button"
            onClick={logout}
            className="shrink-0 w-full bg-red-500/10 text-red-400 py-3 rounded-xl font-bold"
          >
            <LogOut size={18} className="inline mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-10 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="flex justify-between items-center mb-6">
          <button type="button" className="md:hidden" onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>

          <h1 className="text-2xl font-bold">
            Hello, <span className="text-blue-600">{username}</span>
          </h1>

          <div className="relative group">
            <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-full shadow cursor-pointer">
              <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {username[0]}
              </div>

              <div className="hidden md:block leading-tight">
                <p className="text-sm font-semibold">{username}</p>
                <p className="text-xs text-gray-500">Profile</p>
              </div>
            </div>

            <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {username[0]}
                </div>

                <div>
                  <p className="font-bold text-gray-800">{username}</p>
                  <p className="text-xs text-gray-500 break-all">{email}</p>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                Mental Health Dashboard User
              </div>
            </div>
          </div>
        </div>

        {alerts > 30 && (
          <div className="mb-6 bg-red-100 text-red-600 p-3 rounded-xl flex items-center gap-2">
            <AlertTriangle size={18} />
            You may be experiencing strong stress or emotional pressure.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DonutCard
            title="Mood Stability"
            data={moodData}
            value={moodStatus}
          />
          <DonutCard title="Sessions" data={sessionData} value={sessions} />
          <DonutCard title="Crisis Alerts" data={alertData} value={alerts} />
        </div>

        <div className="mt-10 bg-white p-6 rounded-2xl shadow">
          <h2 className="font-bold mb-4">Weekly Mood Trend</h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.mood_data}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-md font-medium text-blue-600 text-center mt-3 pb-6">
          {getAiMessage(moodStatus)}
        </p>
      </div>
    </div>
  );
};

const Nav = ({ icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl mb-2 transition
    ${active ? "bg-blue-600" : "hover:bg-white/10"}`}
  >
    {icon}
    {label}
  </button>
);

const DonutCard = ({ title, data, value }) => {
  const [primaryColor, secondaryColor] = getDonutColors(title, value);

  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
      <h3 className="font-bold mb-4 text-blue-600">{title}</h3>

      <div className="h-48">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} dataKey="value">
              <Cell fill={primaryColor} />
              <Cell fill={secondaryColor} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p
        className="text-center font-bold text-lg"
        style={{ color: primaryColor }}
      >
        {typeof value === "number" ? `${value}%` : value}
      </p>
    </div>
  );
};

export default Dashboard;