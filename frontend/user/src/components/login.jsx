import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, Lock, Shield, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [TMACode, setTMACode] = useState("");
  const [password, setPassword] = useState("");
  const [UserId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!TMACode || !password) {
      toast.error("TMA কোড এবং পাসওয়ার্ড প্রয়োজন।", {
        style: { background: "#1f2937", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }
      });
      return;
    }

    // Accept either 6-digit code or full TMA-XXXXXX format
    const rawCode = TMACode.trim().toUpperCase().replace("TMA-", "");
    if (rawCode.length !== 6 || !/^\d{6}$/.test(rawCode)) {
      toast.error("TMA কোড অবশ্যই ৬ সংখ্যার হতে হবে।", {
        style: { background: "#1f2937", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }
      });
      return;
    }

    setIsLoading(true);
    const fullTMAId = `TMA-${rawCode}`;

    // Search in localStorage users
    const usersList = JSON.parse(localStorage.getItem("systemUsers") || "[123456]");
    const matchedUser = usersList.find(u => u.userId === fullTMAId);

    setTimeout(() => {
      setIsLoading(false);
      if (!matchedUser) {
        toast.error("এই TMA কোডে কোনো নিবন্ধিত ব্যবহারকারী পাওয়া যায়নি।", {
          style: { background: "#1f2937", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }
        });
        return;
      }

      if (matchedUser.password !== password) {
        toast.error("পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।", {
          style: { background: "#1f2937", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }
        });
        return;
      }

      toast.success("লগইন সফল! প্রোফাইল লোড হচ্ছে...", {
        style: { background: "#1f2937", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }
      });
      localStorage.setItem("loggedInUserId", matchedUser.userId);
      setTimeout(() => navigate("/profile"), 1000);
    }, 800);
  };

  // Format TMA input — allow only digits, max 6
  const handleTMAChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 6);
    setTMACode(raw);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-cyan-500/8 blur-[120px] pointer-events-none" />


      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md bg-black/30 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 md:p-9 shadow-2xl overflow-hidden"
      >
        {/* Top scanline accent */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mb-3"
          >
            <div className="absolute -inset-2 rounded-2xl bg-cyan-500/10 blur-lg" />
            {/* Icon */}
                      <div className="relative">
                        <div className="absolute -inset-3 rounded-full bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative h-20 w-20 rounded-2xl bg-blue-600/10 border border-blue-500/20 group-hover:border-blue-500/50 flex items-center justify-center text-blue-400 transition-all duration-300">
                          <Shield size={40} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-xl md:text-2xl font-black text-white tracking-wide"
          >
            প্রশাসক লগইন পোর্টাল
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-slate-400 text-xs mt-1.5 font-semibold"
          >
            Admin Login · Smart Traffic Authority
          </motion.p>
        </div>

        {/* TMA Code hint */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex items-center gap-3 bg-cyan-500/5 border border-cyan-500/15 rounded-2xl px-4 py-3 mb-6"
        >
          <Shield size={16} className="text-cyan-400 shrink-0" />
          <p className="text-[11px] text-slate-400 leading-snug">
            আপনার নিবন্ধনের সময় প্রদত্ত <span className="text-cyan-400 font-bold">৬ সংখ্যার TMA কোড</span> এবং পাসওয়ার্ড দিয়ে লগইন করুন।
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">


          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">
              ইউজার আইডি (User ID)
            </label>
            <div className="flex items-center rounded-2xl border border-slate-800 bg-slate-950 focus-within:border-cyan-500/50 transition-all duration-200 px-4">
              <User size={16} className="text-slate-500 shrink-0" />
              <input
                type="text"
                required
                placeholder="আপনার ইউজার আইডি"
                value={UserId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full bg-transparent px-3 py-3.5 text-white text-sm outline-none placeholder:text-slate-700"
              />
            </div>
          </motion.div>

          {/* TMA Code Field */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">
              TMA কোড (৬ সংখ্যা)
            </label>
            <div className="flex items-center rounded-2xl border border-slate-800 bg-slate-950 focus-within:border-cyan-500/50 transition-all duration-200 px-4 gap-3">
              <KeyRound size={16} className="text-slate-500 shrink-0" />
              {/* Six digit display boxes */}
              <div className="flex items-center gap-0 flex-1 py-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex-1 flex items-center justify-center relative">
                    <span className={`text-lg font-black font-mono tracking-widest transition-all duration-150 ${
                      TMACode[i] ? "text-cyan-400" : "text-slate-700"
                    }`}>
                      {TMACode[i] || "•"}
                    </span>
                    {i < 5 && <span className="absolute right-0 text-slate-800 text-xs">|</span>}
                  </div>
                ))}
              </div>
              {/* Hidden real input */}
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                maxLength={6}
                value={TMACode}
                onChange={handleTMAChange}
                className="absolute opacity-0 w-1 h-1"
                id="TMA-input"
              />
            </div>
            {/* Clickable label overlay to focus hidden input */}
            <label
              htmlFor="TMA-input"
              className="block -mt-[52px] h-[52px] cursor-text"
            />
            <p className="text-[10px] text-slate-600 mt-1.5 font-semibold">
              * নিবন্ধন সম্পন্নের পর প্রদত্ত TMA-XXXXXX কোড থেকে ৬ সংখ্যাটি দিন।
            </p>
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">
              পাসওয়ার্ড
            </label>
            <div className="flex items-center rounded-2xl border border-slate-800 bg-slate-950 focus-within:border-cyan-500/50 transition-all duration-200 px-4">
              <Lock size={16} className="text-slate-500 shrink-0" />
              <input
                type="password"
                required
                placeholder="আপনার পাসওয়ার্ড দিন"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent px-3 py-3.5 text-white text-sm outline-none placeholder:text-slate-700"
              />
            </div>
          </motion.div>

          {/* Login Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black rounded-2xl text-sm transition-all duration-300 shadow-xl shadow-cyan-500/10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed tracking-wide"
          >
            {isLoading ? "যাচাই করা হচ্ছে..." : "লগইন করুন →"}
          </motion.button>
        </form>

        {/* SSL Footer */}
        <div className="mt-5 flex justify-between text-[9px] text-slate-700 font-bold tracking-wider uppercase">
          <span>নিরাপদ সংযোগ (SSL)</span>
          <span>সংস্করণ: ১.০.০</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
