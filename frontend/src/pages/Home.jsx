import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Heart,
  Sparkles,
  Star,
  Brain,
  Activity,
  Lock,
  CheckCircle2,
  Users,
  TrendingUp,
  Clock,
  Quote,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";


/* ─── tiny helpers ─────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

/* floating ambient orb */
const Orb = ({ cls }) => (
  <div
    className={`absolute rounded-full blur-3xl pointer-events-none select-none ${cls}`}
  />
);

/* animated particle dots */
const Particles = ({ dark }) => {
  const dots = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 2.5 + 1,
    d: Math.random() * 8 + 5,
    delay: Math.random() * 4,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute rounded-full ${dark ? "bg-indigo-400/20" : "bg-indigo-300/30"}`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{ y: [0, -28, 0], opacity: [0.25, 1, 0.25] }}
          transition={{
            duration: p.d,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpa = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  /* theme */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  /* navbar shadow on scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);


  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter((i) => i !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };
  /* ── data ─────────────────────────────── */

  const features = [
    {
      icon: Brain,
      color: "indigo",
      title: "Deep Empathy AI",
      desc: "Trained to sense emotional nuance — not just words, but feelings behind them.",
    },
    {
      icon: ShieldCheck,
      color: "emerald",
      title: "End-to-End Privacy",
      desc: "Fully encrypted sessions. Your data is yours — never sold, never shared. Period.",
    },
    {
      icon: Activity,
      color: "purple",
      title: "Mood Analytics",
      desc: "Track your emotional journey with beautiful charts and weekly personal insights.",
    },
    {
      icon: MessageCircle,
      color: "sky",
      title: "Instant Support",
      desc: "No waiting rooms. No scheduling. Support is ready the moment you need it.",
    },
    {
      icon: Heart,
      color: "rose",
      title: "Judgment‑Free Zone",
      desc: "Talk about anything. PsycheGuide listens without bias, criticism, or judgment.",
    },
    {
      icon: Lock,
      color: "amber",
      title: "Secure & Anonymous",
      desc: "Sign up with just your email. Your identity stays private by default.",
    },
  ];

  const steps = [
    {
      n: "01",
      title: "Create Account",
      desc: "Sign up in seconds — no credit card needed.",
    },
    {
      n: "02",
      title: "Start a Session",
      desc: "Tell PsycheGuide how you're feeling. There's no wrong way to begin.",
    },
    {
      n: "03",
      title: "Get Personalised Help",
      desc: "Our AI adapts and offers coping strategies + compassionate dialogue.",
    },
    {
      n: "04",
      title: "Track Your Progress",
      desc: "Review mood history and analytics to see how far you've come.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "University Student",
      avatar: "https://i.pravatar.cc/80?u=sm9",
      stars: 5,
      text: "PsycheGuide helped me through exam anxiety at 3 AM when I had no one to talk to. It felt genuinely human — I couldn't believe it was AI.",
    },
    {
      name: "James K.",
      role: "Software Engineer",
      avatar: "https://i.pravatar.cc/80?u=jk7",
      stars: 5,
      text: "The mood analytics are incredible. I can actually see patterns in my anxiety now and that's helped me make real lifestyle changes.",
    },
    {
      name: "Aisha R.",
      role: "Therapist (Personal Use)",
      avatar: "https://i.pravatar.cc/80?u=ar3",
      stars: 5,
      text: "Even as a mental health professional I use PsycheGuide for my own check-ins. The privacy-first approach is exactly what the industry needs.",
    },
  ];

  const palette = {
    indigo: {
      icon: "text-indigo-600 dark:text-indigo-400",
      ring: "bg-indigo-50 dark:bg-indigo-500/10",
    },
    emerald: {
      icon: "text-emerald-600 dark:text-emerald-400",
      ring: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    purple: {
      icon: "text-purple-600 dark:text-purple-400",
      ring: "bg-purple-50 dark:bg-purple-500/10",
    },
    sky: {
      icon: "text-sky-600 dark:text-sky-400",
      ring: "bg-sky-50 dark:bg-sky-500/10",
    },
    rose: {
      icon: "text-rose-600 dark:text-rose-400",
      ring: "bg-rose-50 dark:bg-rose-500/10",
    },
    amber: {
      icon: "text-amber-600 dark:text-amber-400",
      ring: "bg-amber-50 dark:bg-amber-500/10",
    },
  };

const faqs = [
  {
    question: "What is PsycheGuide?",
    answer:
      "PsycheGuide is an AI-powered mental wellness platform designed to support emotional well-being through guided conversations, mood tracking, and personalized insights. It helps users reflect on their thoughts, understand their emotions, and build healthier mental habits over time.",
  },
  {
    question: "Is PsycheGuide free to use?",
    answer:
      "Yes, PsycheGuide offers free access to its core features such as chatting with the AI, basic mood tracking, and emotional support tools. Advanced features like deeper analytics, personalized mental health reports, or premium insights may be available in future paid versions.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, your privacy is a top priority. All user data is securely stored and handled using encryption and secure backend practices. Conversations are not shared publicly and are only used to improve your personal experience within the platform.",
  },
  {
    question: "Can PsycheGuide replace therapy?",
    answer:
      "No. PsycheGuide is not a replacement for professional mental health therapy or clinical diagnosis. It is designed as a supportive tool to help you understand your emotions and provide comfort, but serious mental health concerns should always be addressed by licensed professionals.",
  },
  {
    question: "Can I track my mood?",
    answer:
      "Yes, PsycheGuide allows you to track your daily emotions and mental states over time. This helps you identify emotional patterns, triggers, and progress in your mental well-being journey, making it easier to understand yourself better.",
  },
  {
    question: "What should I do in a crisis?",
    answer:
      "If you are experiencing a mental health crisis or feeling unsafe, please immediately reach out to a trusted person, family member, or professional helpline in your area. PsycheGuide is designed for support and reflection, not emergency intervention.",
  },
];


  /* ── JSX ─────────────────────────────── */
  return (
    <>
      <div
        className={`min-h-screen w-full overflow-x-hidden transition-colors duration-500 ${isDark ? "bg-[#070b14] text-white" : "bg-[#f8faff] text-slate-900"}`}
      >
        {/* ══ NAVBAR ══════════════════════════════════════════ */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? isDark
                ? "bg-[#070b14]/90 backdrop-blur-2xl border-b border-white/5 shadow-xl shadow-black/30"
                : "bg-white/90 backdrop-blur-2xl border-b border-slate-100 shadow-lg shadow-black/5"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
            {/* logo */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="bg-white/10 p-4 rounded-md w-fit backdrop-blur-md flex items-center gap-3">
                <img src="/logo.png" className="w-8 h-8" />
                <span className="font-black text-xl">PsycheGuide</span>
              </div>
            </div>

            {/* desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {[
                ["#features", "Features"],
                ["#how-it-works", "How It Works"],
                ["#testimonials", "Testimonials"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className={`relative text-sm font-semibold transition-colors duration-300
      ${
        isDark
          ? "text-slate-400 hover:text-white"
          : "text-slate-500 hover:text-slate-900"
      }
      
      after:content-[''] after:absolute after:left-0 after:-bottom-1
      after:w-0 after:h-[2px] after:bg-current
      after:transition-all after:duration-300
      hover:after:w-full
      `}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* actions */}
            <div className="flex items-center gap-3 lg:gap-x-10">
              {/* theme toggle */}
              <button
                onClick={() => setIsDark((d) => !d)}
                aria-label="Toggle theme"
                className={`p-2.5 rounded-full border transition-all active:scale-95 ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-slate-100 border-slate-200 hover:bg-slate-200"}`}
              >
                {isDark ? (
                  <Sun size={17} className="text-amber-500" />
                ) : (
                  <Moon size={17} className="text-indigo-400" />
                )}
              </button>

              <button
                onClick={() => navigate("/login")}
                className={`hidden md:block px-6 py-2.5 text-sm font-bold rounded-md 
  border transition-all duration-300 active:scale-95

  ${
    isDark
      ? "text-white/70 border-white/10 hover:border-white/20 hover:text-white hover:bg-white/5"
      : "text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-100"
  }`}
              >
                Sign In
              </button>

              {/* hamburger */}
              <button
                className="md:hidden p-2 rounded-xl"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* mobile menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`overflow-hidden border-b ${isDark ? "bg-[#070b14] border-white/5" : "bg-white border-slate-100"}`}
              >
                <div className="px-6 py-5 flex flex-col gap-4">
                  {[
                    ["#features", "Features"],
                    ["#how-it-works", "How It Works"],
                    ["#testimonials", "Testimonials"],
                  ].map(([href, label]) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`relative w-fit text-sm font-semibold transition-colors duration-300
      ${
        isDark
          ? "text-slate-300 hover:text-white"
          : "text-slate-700 hover:text-slate-900"
      }
      after:content-[''] after:absolute after:left-0 after:-bottom-1
      after:w-0 after:h-[2px] after:bg-current
      after:transition-all after:duration-300
      hover:after:w-full
      `}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ══ HERO ════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-28 px-6 overflow-hidden"
          style={{
            backgroundImage: isDark
              ? `
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.85),
        rgba(0, 0, 0, 0.55)
      ),
      url('/bg-dark.jpg')
    `
              : `
      linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.85),
        rgba(255, 255, 255, 0.59)
      ),
      url('/bg-dark.jpg')
    `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          

          {/* ambient orbs */}
          <Orb
            cls={`w-[700px] h-[700px] -top-48 -left-48 ${
              isDark ? "bg-indigo-600/10" : "bg-indigo-200/50"
            }`}
          />
          <Orb
            cls={`w-[500px] h-[500px] top-1/3 -right-32 ${
              isDark ? "bg-purple-600/10" : "bg-purple-200/40"
            }`}
          />
          <Orb
            cls={`w-[350px] h-[350px] bottom-0 left-1/3 ${
              isDark ? "bg-sky-600/8" : "bg-sky-200/30"
            }`}
          />

          <Particles dark={isDark} />

          <motion.div
            style={{ y: heroY, opacity: heroOpa }}
            className="relative z-10 max-w-5xl mx-auto text-center"
          >
            {/* headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.04] mb-6"
            >
              Personalized Mental Wellness
              <span className="block bg-gradient-to-r from-blue-500 via-blue-900 to-cyan-500 bg-clip-text text-transparent pb-2">
                Through Lived Experiences
              </span>
            </motion.h1>

            {/* subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              PsycheGuide is your empathetic AI companion — available 24/7 to
              help you navigate anxiety, stress, and emotions with total privacy
              and zero judgment.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.44 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
            >
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/signup")}
                  className="group relative w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 
          bg-gradient-to-r from-blue-600 to-blue-900 text-white 
          font-bold sm:font-black text-sm sm:text-base 
          rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 
          shadow-lg sm:shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 
          transition-all hover:scale-[1.02] sm:hover:scale-[1.03] active:scale-95 overflow-hidden"
                >
                  Begin Your Journey
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className={`w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 
          font-semibold sm:font-bold text-sm sm:text-base 
          rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 
          border transition-all ${
            isDark
              ? "border-white/10 text-white/70 bg-white/5"
              : "border-slate-200 text-slate-700 bg-white"
          }`}
                >
                  Sign In
                </button>
              </div>
            </motion.div>

            {/* social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.58 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <img
                      key={n}
                      src={`https://i.pravatar.cc/60?u=u${n}`}
                      className="w-9 h-9 rounded-full border-2 object-cover"
                    />
                  ))}
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  Trusted by{" "}
                  <span className="font-black text-blue-500">12,000+</span>
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* scroll cue */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500"
          >
            <span className="text-xs font-medium">Scroll</span>
            <ChevronDown size={18} />
          </motion.div>
        </section>
        {/* ══ FEATURES ════════════════════════════════════════ */}
        <section id="features" className="py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* HEADER */}
            <motion.div {...fadeUp()} className="text-center mb-12 md:mb-16">
              <span
                className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] block mb-4 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Why PsycheGuide
              </span>

              <h2
                className={`text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mb-5 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Built for your wellbeing,
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  not for your data.
                </span>
              </h2>

              <p
                className={`text-sm sm:text-base md:text-lg max-w-xl mx-auto font-medium ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Every feature is carefully crafted to make mental health support
                more accessible, personal, and private.
              </p>
            </motion.div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {features.map((f, i) => {
                const c = palette[f.color];

                return (
                  <motion.div
                    key={f.title}
                    {...fadeUp(i * 0.05)}
                    whileHover={{ y: -5 }}
                    className={`p-5 sm:p-6 md:p-7 rounded-2xl md:rounded-3xl border transition-all cursor-default
            ${
              isDark
                ? "bg-white/[0.03] border-white/5 hover:border-white/10"
                : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-md"
            }`}
                  >
                    {/* ICON */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 transition-transform duration-300
              ${c.ring} ${c.icon}`}
                    >
                      <f.icon size={20} className="sm:w-6 sm:h-6" />
                    </div>

                    {/* TITLE */}
                    <h3
                      className={`text-xs sm:text-sm font-black uppercase tracking-wider mb-2 sm:mb-3 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {f.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p
                      className={`text-xs sm:text-sm leading-relaxed font-medium ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {f.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ════════════════════════════════════ */}
        <section
          id="how-it-works"
          className={`py-20 md:py-28 px-4 sm:px-6 transition-all ${
            isDark ? "bg-white/[0.02]" : "bg-white"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            {/* HEADER */}
            <motion.div {...fadeUp()} className="text-center mb-12 md:mb-16">
              <span
                className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] block mb-4 ${
                  isDark ? "text-blue-400" : "text-blue-700"
                }`}
              >
                Simple Process
              </span>

              <h2
                className={`text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mb-5 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
               start Mental healing in{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  4 easy steps.
                </span>
              </h2>
            </motion.div>

            {/* STEPS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  {...fadeUp(i * 0.08)}
                  className={`relative p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border flex gap-4 sm:gap-6 group hover:border-blue-500/30 transition-all ${
                    isDark
                      ? "bg-white/[0.03] border-white/5"
                      : "bg-slate-50/80 border-slate-100"
                  }`}
                >
                  {/* STEP NUMBER */}
                  <span
                    className={`text-3xl sm:text-4xl md:text-5xl font-black font-mono leading-none shrink-0 transition-colors ${
                      isDark
                        ? "text-blue-500 group-hover:text-blue-400"
                        : "text-blue-200 group-hover:text-blue-400"
                    }`}
                  >
                    {s.n}
                  </span>

                  {/* CONTENT */}
                  <div>
                    <h3
                      className={`text-sm sm:text-base font-black mb-2 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {s.title}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed font-medium ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ════════════════════════════════════ */}
        <section id="testimonials" className="py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp()} className="text-center mb-16">
              <span
                className={`text-xs font-black uppercase tracking-[0.2em] block mb-4 ${isDark ? "text-blue-600" : "text-cyan-600"}`}
              >
                Real Stories
              </span>
              <h2
                className={`text-4xl md:text-5xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
              >
                People who found their
                <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
                  {" "}
                  calm.
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  {...fadeUp(i * 0.09)}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`p-7 rounded-3xl border relative flex flex-col gap-5 ${isDark ? "bg-white/[0.03] border-white/5" : "bg-white border-slate-100 shadow-sm"}`}
                >
                  <Quote
                    size={26}
                    className={`absolute top-6 right-6 ${isDark ? "text-white/5" : "text-slate-100"}`}
                  />

                  <div className="flex gap-0.5">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star
                        key={j}
                        size={13}
                        className="text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>

                  <p
                    className={`text-sm leading-relaxed font-medium flex-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    "{t.text}"
                  </p>

                  <div
                    className={`flex items-center gap-3 pt-4 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}
                  >
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <p
                        className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {t.name}
                      </p>
                      <p
                        className={`text-xs font-semibold ${isDark ? "text-slate-500" : "text-slate-400"}`}
                      >
                        {t.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA BANNER ══════════════════════════════════════ */}
        <section className="py-8 px-6 relative overflow-hidden">
          <motion.div
            {...fadeUp()}
            className={`max-w-4xl mx-auto relative overflow-hidden rounded-xl p-4 md:p-10 text-center transition-all duration-500
      ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
          : "bg-gradient-to-br from-blue-400 via-blue-600 to-cyan-500 shadow-[0_30px_80px_rgba(59,130,246,0.35)]"
      }
    `}
          >
            {/* background pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* glowing orbs */}
            <Orb
              cls={`w-72 h-72 -top-24 -left-24 blur-2xl ${
                isDark ? "bg-cyan-500/10" : "bg-white/10"
              }`}
            />
            <Orb
              cls={`w-72 h-72 -bottom-24 -right-24 blur-2xl ${
                isDark ? "bg-purple-500/10" : "bg-cyan-300/20"
              }`}
            />

            <div className="relative z-10">
              {/* badge */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-md border transition-all
        ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/15 border-white/20"
        }`}
              >
                <Sparkles size={14} className="text-yellow-300" />
                <span className="text-white text-xs font-bold tracking-widest uppercase">
                  Free Forever Plan
                </span>
              </div>

              {/* heading */}
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
                Take control of your mind
                <br />
                <span className={isDark ? "text-cyan-300" : "text-cyan-100"}>
                  start your healing journey today
                </span>
              </h2>

              {/* description */}
              <p
                className={`text-base md:text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed ${
                  isDark ? "text-white/70" : "text-white/80"
                }`}
              >
                PsycheGuide helps you understand your emotions, track your
                mental health, and get AI-powered support whenever you need it —
                in just seconds.
              </p>

              {/* CTA button */}
              <button
                onClick={() => navigate("/signup")}
                className={`group px-8 md:px-10 py-3 md:py-4 font-black text-sm md:text-base rounded-2xl inline-flex items-center gap-3 shadow-xl hover:scale-[1.04] active:scale-95 transition-all ${
                  isDark
                    ? "bg-white text-black hover:shadow-white/10"
                    : "bg-white text-blue-700 hover:shadow-2xl"
                }`}
              >
                Start Free — No Credit Card
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              {/* privacy text */}
              <p
                className={`text-xs font-medium mt-6 tracking-wide ${
                  isDark ? "text-white/40" : "text-white/60"
                }`}
              >
                🔒 Private by design — your data stays secure and encrypted
              </p>
            </div>
          </motion.div>
        </section>

        {/* ══ FAQ  ══════════════════════════════════════════ */}
        <section id="faq" className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">
                Frequently Asked Questions
              </h2>

              <p
                className={`mt-3 ${isDark ? "text-white/60" : "text-gray-500"}`}
              >
                Everything you need to know about PsycheGuide
              </p>
            </div>

            {/* FAQ */}
            <div className="space-y-4">
              {faqs.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-md border p-4 transition-all duration-300 ${
                    isDark
                      ? "bg-white/5 border-white/10 backdrop-blur-md"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  {/* Question Row */}
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-3">
                      {/* Number */}
                      <span
                        className={`font-bold text-sm  flex items-center justify-center rounded-full `}
                      >
                        {index + 1}.
                      </span>

                      {/* Question */}
                      <span
                        className={`font-semibold md:text-md ${
                          isDark ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.question}
                      </span>
                    </div>

                    <ChevronDown
                      className={`transition-transform duration-300 ${
                        openItems.includes(index) ? "rotate-180" : ""
                      } ${isDark ? "text-white/70" : "text-gray-600"}`}
                    />
                  </button>

                  {/* Answer */}
                  {openItems.includes(index) && (
                    <p
                      className={`mt-3 text-sm leading-relaxed ml-10 ${
                        isDark ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      {item.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ══ FOOTER ══════════════════════════════════════════ */}
        <footer
          className={`relative border-t py-16 px-6 overflow-hidden transition-all  ${isDark ? "border-white/5 bg-[#05070f]" : "border-slate-100 bg-white"}`}
        >
          {/* soft background glow */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,#3b82f615,transparent_60%)]" />

          <div className="max-w-6xl mx-auto relative z-10">
            {/* TOP GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {/* LOGO + ABOUT */}
              <div>
                <div
                  className="flex items-center gap-3 mb-4 cursor-pointer"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <div className="bg-white/10 p-4 rounded-md w-fit backdrop-blur-md flex items-center gap-3">
                    <img src="/logo.png" className="w-8 h-8" />
                    <span className="font-black text-xl">PsycheGuide</span>
                  </div>
                </div>

                <p
                  className={`text-sm ${isDark ? "text-white/50" : "text-slate-600"}`}
                >
                  AI-powered mental wellness platform helping you understand
                  emotions, track mood, and improve mental health.
                </p>
              </div>

              {/* FEATURES */}
              <div>
                <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-blue-500">
                  Features
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>AI Chat Support</li>
                  <li>Mood Tracking</li>
                  <li>Emotion Insights</li>
                  <li>Personal Journaling</li>
                </ul>
              </div>

              {/* HOW IT WORKS */}
              <div>
                <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-blue-500">
                  How It Works
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>1. Start a conversation</li>
                  <li>2. Share your feelings</li>
                  <li>3. Get AI insights</li>
                  <li>4. Track your progress</li>
                </ul>
              </div>

              {/* QUICK LINKS */}
              <div>
                <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-blue-500">
                  Explore
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#features"
                      className="hover:text-blue-500 transition"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#testimonials"
                      className="hover:text-blue-500 transition"
                    >
                      Testimonials
                    </a>
                  </li>

                  <li>
                    <a
                      href="#how-it-works"
                      className="hover:text-blue-500 transition"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-blue-500 transition">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-12 gap-6">
              {/* Social */}
              <div className="flex gap-4">
                <a href="#" className="text-sm hover:text-blue-500 transition">
                  LinkedIn
                </a>
                <a href="#" className="text-sm hover:text-gray-400 transition">
                  GitHub
                </a>
                <a
                  href="mailto:contact@psycheguide.com"
                  className="text-sm hover:text-red-400 transition"
                >
                  Google / Email
                </a>
              </div>

              {/* copyright */}
              <p
                className={`text-xs ${isDark ? "text-white/40" : "text-slate-500"}`}
              >
                © 2026 PsycheGuide — All rights reserved
              </p>
            </div>

            {/* disclaimer */}
            <div
              className={`mt-10 pt-6 border-t text-center ${
                isDark
                  ? "border-white/5 text-white/50"
                  : "border-slate-100 text-slate-600"
              }`}
            >
              <p className="text-sm max-w-2xl mx-auto">
                Made with ❤️ for mental wellness. PsycheGuide is not a
                replacement for professional therapy — it is a supportive AI
                companion.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
