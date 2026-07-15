import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, ChevronRight, TrafficCone, Zap } from "lucide-react";

const AdminUser = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">

      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.4)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400">
            <TrafficCone size={30} className="animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide mb-2">
          স্মার্ট ট্রাফিক সিস্টেম
        </h1>
        <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase">
          Smart Traffic Management Authority — Bangladesh
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-widest">সিস্টেম সক্রিয়</span>
        </div>
      </motion.div>

      {/* Role Selection Heading */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mb-8 z-10"
      >
        আপনার ভূমিকা নির্বাচন করুন
      </motion.p>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl z-10">

        {/* Admin Card */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/login")}
          className="group relative flex flex-col items-center gap-5 p-8 rounded-3xl border border-blue-500/20 bg-slate-950/60 hover:bg-blue-950/30 hover:border-blue-500/50 backdrop-blur-xl transition-all duration-300 cursor-pointer text-center overflow-hidden shadow-2xl"
        >
          {/* Card Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Icon */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative h-20 w-20 rounded-2xl bg-blue-600/10 border border-blue-500/20 group-hover:border-blue-500/50 flex items-center justify-center text-blue-400 transition-all duration-300">
              <Shield size={40} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-1 tracking-wide">প্রশাসক</h2>
            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-3">Admin / Operator</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              ট্রাফিক কমান্ড সেন্টারে প্রবেশ করুন। ড্যাশবোর্ড, ক্যামেরা ফিড এবং সিস্টেম নিয়ন্ত্রণ করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs group-hover:gap-3 transition-all duration-200">
            <span>লগইন পোর্টালে যান</span>
            <ChevronRight size={14} />
          </div>

          {/* Corner accent */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">
            <Zap size={8} className="text-blue-400" />
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">Restricted</span>
          </div>
        </motion.button>

        {/* Civilians Card */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/register")}
          className="group relative flex flex-col items-center gap-5 p-8 rounded-3xl border border-cyan-500/20 bg-slate-950/60 hover:bg-cyan-950/20 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-300 cursor-pointer text-center overflow-hidden shadow-2xl"
        >
          {/* Card Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Icon */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-cyan-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative h-20 w-20 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 group-hover:border-cyan-500/50 flex items-center justify-center text-cyan-400 transition-all duration-300">
              <Users size={40} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-1 tracking-wide">বেসামরিক নাগরিক</h2>
            <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-3">Civilian / Driver</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              আপনার ডিজিটাল স্মার্ট ট্রাফিক প্রোফাইল এবং ড্রাইভিং রেকর্ড পরিচালনা করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs group-hover:gap-3 transition-all duration-200">
            <span>নিবন্ধন পোর্টালে যান</span>
            <ChevronRight size={14} />
          </div>

          {/* Corner accent */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2 py-0.5">
            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-wider">Open</span>
          </div>
        </motion.button>

      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-12 text-center z-10"
      >
        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest">
          নিরাপদ সংযোগ (SSL Encrypted) · সংস্করণ ১.০.০ · © ২০২৬ স্মার্ট ট্রাফিক অথরিটি
        </p>
      </motion.div>
    </div>
  );
};

export default AdminUser;
