import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Loader2, Sparkles, Menu, Plus, MessageSquare, LogOut, Settings, Moon, Sun, LayoutDashboard, AlertCircle, RefreshCcw, Mail, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Chat = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const [showSettings, setShowSettings] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  const scrollRef = useRef(null);
  const settingsRef = useRef(null);
  const navigate = useNavigate();
  
  const rawEmail = localStorage.getItem("email");
  const email = (rawEmail && rawEmail !== "undefined") ? rawEmail : null;
  const username = localStorage.getItem("username") || "User";
  const firstLetter = username.charAt(0).toUpperCase();

  // Guard: if email is missing/stale, force re-login
  useEffect(() => {
    if (!email) {
      localStorage.clear();
      navigate("/login");
    }
  }, [email, navigate]);

  // Click outside to close settings logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch All Conversations list
  const fetchConversations = async () => {
    try {
      const res = await api.get(`/chat/conversations/${email}`);
      setConversations(res.data);
    } catch (err) { 
      console.error("Fetch Conversations Error:", err); 
    }
  };

  useEffect(() => {
    if (email) fetchConversations();
  }, [email]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || limitReached) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await api.post("/chat/message", { 
        username: email, 
        message: input,
        conversation_id: activeConversationId
      });

      if (res.data) {
        if (res.data.reply) {
          setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
        }
        
        if (!activeConversationId && res.data.conversation_id) {
           setActiveConversationId(res.data.conversation_id);
           fetchConversations(); 
        }

        if (res.data.limit_reached) {
          setLimitReached(true);
        }
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((prev) => [...prev, { role: "ai", content: "Error: AI not responding. Please check backend." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setLimitReached(false);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const clearAllHistory = async () => {
    if (conversations.length === 0) return;
    if (
      !window.confirm(
        "Delete all chat sessions? This cannot be undone."
      )
    )
      return;

    setClearingAll(true);
    try {
      await Promise.all(
        conversations.map((c) => api.delete(`/chat/session/${c._id}`))
      );
      setConversations([]);
      handleNewChat();
    } catch (err) {
      console.error("Clear all history failed:", err);
      alert("Could not clear all history. Check your connection or backend route DELETE /chat/session/:id.");
    } finally {
      setClearingAll(false);
    }
  };

  const loadConversation = async (convId) => {
    try {
      const res = await api.get(`/chat/history/${convId}`);
      const formattedMessages = [];
      res.data.forEach(chat => {
          formattedMessages.push({ role: "user", content: chat.message });
          formattedMessages.push({ role: "ai", content: chat.ai_response });
      });
      setMessages(formattedMessages);
      setActiveConversationId(convId);
      setLimitReached(formattedMessages.length >= 200); 
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (err) {
      console.error("Load Conv Error:", err);
    }
  };

  const deleteConversation = async (id) => {
    if (!window.confirm("Delete this chat session?")) return;
    try {
      await api.delete(`/chat/session/${id}`);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (activeConversationId === id) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete the conversation.");
    }
  };

  return (
    <div className={theme === 'dark' ? 'bg-black' : 'bg-slate-50'}>
      <div className={`flex h-screen font-sans transition-colors duration-500 overflow-hidden relative ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
        
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* --- SIDEBAR --- */}
        <motion.div 
          className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out h-full flex flex-col overflow-hidden border-r z-40 shrink-0 ${theme === 'dark' ? 'bg-[#050505] border-white/10' : 'bg-[#f9f9f9] border-slate-200'}`}
        >
          <div className="p-5 flex flex-1 min-h-0 w-[280px] flex-col">
            <button 
                onClick={handleNewChat} 
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-[15px] font-bold mb-3 border shadow-sm ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 hover:bg-white/5 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}
            >
              <Plus size={20} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} /> New Chat
            </button>

            <button
              type="button"
              onClick={clearAllHistory}
              disabled={conversations.length === 0 || clearingAll}
              className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all mb-4 shrink-0 disabled:opacity-40 disabled:pointer-events-none ${
                theme === "dark"
                  ? "border-white/10 bg-transparent text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              }`}
            >
              {clearingAll ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Trash2 size={18} />
              )}
              Clear all history
            </button>
            
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-1.5 pr-2 custom-scrollbar">
              <p className={`text-[10px] font-black uppercase tracking-widest px-2 mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Your Conversations</p>
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold transition-all border ${
                      activeConversationId === conv._id
                        ? theme === "dark"
                          ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                          : "bg-indigo-50 text-indigo-700 border-indigo-100"
                        : theme === "dark"
                          ? "text-slate-300 border-transparent hover:bg-white/10"
                          : "text-slate-600 border-transparent hover:bg-slate-200"
                    }`}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => loadConversation(conv._id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          loadConversation(conv._id);
                        }
                      }}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 truncate"
                    >
                      <MessageSquare
                        size={16}
                        className={`shrink-0 ${
                          activeConversationId === conv._id
                            ? theme === "dark"
                              ? "text-indigo-400"
                              : "text-indigo-600"
                            : "text-slate-400"
                        }`}
                      />
                      <span className="truncate">{conv.title || "Chat Session"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv._id);
                      }}
                      className={`shrink-0 p-2 rounded-lg transition-colors ${
                        theme === "dark"
                          ? "text-slate-500 hover:bg-red-500/15 hover:text-red-400"
                          : "text-slate-400 hover:bg-red-50 hover:text-red-600"
                      }`}
                      title="Delete conversation"
                      aria-label="Delete conversation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className={`px-2 text-xs italic pb-2 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>No conversations yet.</p>
              )}
            </div>
          </div>

          <div className={`p-4 border-t space-y-1 relative w-[280px] ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`} ref={settingsRef}>
            <AnimatePresence>
              {showSettings && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`absolute bottom-20 left-4 w-60 shadow-xl rounded-2xl border p-2 z-50 overflow-hidden ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-slate-200'}`}
                >
                  <p className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Theme Preferences</p>
                  <button onClick={(e) => { e.stopPropagation(); toggleTheme("light"); setShowSettings(false); }} className={`flex items-center justify-between w-full p-3 rounded-xl text-sm font-bold transition-all ${theme === 'light' ? 'bg-indigo-50 text-indigo-600' : (theme === 'dark' ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-100 text-slate-700')}`}>
                    <div className="flex items-center gap-3"><Sun size={18}/> Light</div>
                    {theme === 'light' && <div className="h-2 w-2 bg-indigo-600 rounded-full" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleTheme("dark"); setShowSettings(false); }} className={`flex items-center justify-between w-full p-3 mt-1 rounded-xl text-sm font-bold transition-all ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : (theme === 'light' ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/5 text-slate-300')}`}>
                    <div className="flex items-center gap-3"><Moon size={18}/> Dark</div>
                    {theme === 'dark' && <div className="h-2 w-2 bg-indigo-400 rounded-full" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button onClick={() => setShowSettings(!showSettings)} className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-200 text-slate-700'}`}>
              <Settings size={18} className="text-slate-500"/> Settings
            </button>
            <button onClick={() => navigate("/dashboard")} className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-200 text-slate-700'}`}>
              <LayoutDashboard size={18} className="text-slate-500" /> Dashboard
            </button>
            <button onClick={() => {localStorage.clear(); navigate("/")}} className={`flex items-center gap-3 w-full p-3 mt-1 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-200 text-slate-700'}`}>
              <LogOut size={18} className="text-slate-500"/> Logout
            </button>
          </div>
        </motion.div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 flex flex-col relative min-h-0 h-full bg-transparent z-10 w-full transition-colors duration-500">
          <header className={`flex items-center justify-between px-6 py-4 sticky top-0 border-b z-20 ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className={`md:hidden p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
                <Menu size={24} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} />
              </button>
              <div className="flex flex-col">
                <span className={`font-bold text-lg tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>PsycheGuide</span>
              </div>
            </div>

            {/* Top Header Profile with Google-Style Hover Card */}
            <div className="relative group">
              <div className={`h-10 w-10 text-white rounded-full shadow-lg flex items-center justify-center font-black cursor-pointer transition-transform active:scale-95 ${theme === 'dark' ? 'bg-indigo-500 shadow-indigo-500/10' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
                {firstLetter}
              </div>

              {/* Hover Card */}
              <div className={`absolute top-full right-0 mt-3 w-50 border rounded-2xl p-5 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] transform translate-y-2 group-hover:translate-y-0 ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-slate-200'}`}>
                    <p className={`font-bold text-lg leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{username}</p>
                    <p className={`text-sm mt-1 flex items-center justify-center gap-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Mail size={12} className="opacity-70" /> {email}
                    </p>
              </div>
            </div>
          </header>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 md:px-0 pt-8 pb-32 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-8">
              {messages.length === 0 ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                  <div className={`h-20 w-20 rounded-3xl flex items-center justify-center mb-8 border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-indigo-50 border-indigo-100'}`}>
                    <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                  </div>
                  <h1 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Welcome, {username}</h1>
                  <p className={`text-xl font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Start a new conversation to get started.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-6 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex flex-shrink-0 items-center justify-center font-bold text-sm ${msg.role === "ai" ? 'bg-transparent' : 'bg-indigo-600 text-white shadow-md'}`}>
                        {msg.role === "ai" ? <img src="/logo.png" alt="AI" className="w-9 h-9 object-contain" /> : firstLetter}
                      </div>

                      <div className={`max-w-[85%] md:max-w-[80%] text-[17px] leading-relaxed font-medium ${
                        msg.role === "user" 
                        ? (theme === 'dark' ? 'bg-[#1a1a1a] px-6 py-4 rounded-2xl text-white' : 'bg-[#f0f4f9] px-6 py-4 rounded-2xl text-slate-800')
                        : (theme === 'dark' ? 'text-white whitespace-pre-wrap pt-2 px-2' : 'text-slate-800 whitespace-pre-wrap pt-2 px-2')
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  
                  {limitReached && (
                     <div className={`border p-6 rounded-2xl flex flex-col items-center gap-4 text-center mx-4 select-none ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'}`}>
                        <AlertCircle className="text-rose-500" size={32} />
                        <div>
                            <p className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-700'}`}>Conversation Limit Reached</p>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-rose-500/80' : 'text-rose-600'}`}>To maintain focus and quality, conversations are limited to 10 messages. Please save your progress and start a new session.</p>
                        </div>
                        <button 
                            onClick={handleNewChat}
                            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20"
                        >
                            <RefreshCcw size={18} /> New Conversation
                        </button>
                     </div>
                  )}
                </div>
              )}
              
              {isTyping && (
                <div className="flex gap-6">
                  <div className="h-10 w-10 rounded-xl bg-transparent flex items-center justify-center">
                    <img src="/logo.png" alt="AI" className="w-9 h-9 object-contain opacity-50" />
                  </div>
                  <div className={`flex items-center gap-2 h-12 px-6 rounded-2xl ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#f0f4f9]'}`}>
                     <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                     <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                     <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} className="h-12" />
            </div>
          </div>

          <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t via-transparent to-transparent z-20 ${theme === 'dark' ? 'from-black' : 'from-slate-50'}`}>
            <div className="max-w-3xl mx-auto relative">
              <form onSubmit={handleSendMessage} className={`relative flex items-center rounded-[2rem] p-2 pr-3 border transition-all duration-300 shadow-sm ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 focus-within:border-white/20' : 'bg-[#f0f4f9] border-transparent focus-within:border-indigo-100 focus-within:bg-white'} ${limitReached ? 'opacity-50 pointer-events-none' : ''}`}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={limitReached ? "Conversation limit reached" : "Message PsycheGuide..."}
                  disabled={limitReached}
                  className={`w-full py-4 px-6 bg-transparent outline-none text-lg font-medium ${theme === 'dark' ? 'text-white placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'}`}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isTyping || limitReached} 
                  className={`p-3.5 rounded-full flex items-center justify-center transition-all ${
                    input.trim() && !isTyping && !limitReached
                    ? "text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20" 
                    : (theme === 'dark' ? 'text-white/10 bg-transparent' : 'text-slate-300 bg-transparent')
                  }`}
                >
                  {isTyping ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                </button>
              </form>
              <p className={`text-center text-xs font-bold mt-4 tracking-wide uppercase opacity-70 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
                PsycheGuide AI Companion · Version 2.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;