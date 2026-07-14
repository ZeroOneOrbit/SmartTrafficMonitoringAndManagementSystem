import React, { useState, useEffect } from "react";
import { Search, ChevronDown, User, LogOut, Settings, Server } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Header = ({ searchTerm, setSearchTerm, setActiveTab }) => {
  const navigate = useNavigate();
  const [time, setTime] = useState("");
  const [latency, setLatency] = useState(28);
  const [profileOpen, setProfileOpen] = useState(false);

  // Time Ticker
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      
      // Pad single digits
      hours = hours < 10 ? "০" + hours : hours.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
      minutes = minutes < 10 ? "০" + minutes : minutes.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
      seconds = seconds < 10 ? "০" + seconds : seconds.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
      
      setTime(`সময়: ${hours}:${minutes}:${seconds}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Latency Oscillation
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 24); // 24ms to 31ms
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    toast.success("সফলভাবে লগআউট করা হয়েছে।");
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 px-6 bg-slate-950/60 border border-blue-950/40 rounded-3xl backdrop-blur-xl">
      
      {/* Title & Location details */}
      <div className="flex flex-col">
        <h2 className="text-lg md:text-xl font-extrabold text-white tracking-wide">
          কমান্ড সেন্টার ইন্টেলিজেন্স
        </h2>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mt-1">
          <span>লোকেশন: <span className="text-blue-400">ঢাকা, বাংলাদেশ</span></span>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-cyan-400">{time}</span>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="flex-1 max-w-md w-full relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="সার্চ করুন এখানে..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-white text-xs outline-none focus:border-blue-500/50 placeholder:text-slate-600 transition-all duration-200"
        />
      </div>

      {/* Server Status & User Profile */}
      <div className="flex items-center justify-between md:justify-end gap-6">
        
        {/* Server Ping */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/30 border border-slate-900/60 px-4 py-2 rounded-xl">
          <Server size={14} className="text-slate-500" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">সার্ভার স্ট্যাটাস</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-emerald-400 font-bold font-mono">সক্রিয়</span>
              <span className="text-[9px] text-slate-600 font-mono">({latency}ms)</span>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 px-3.5 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer"
          >
            {/* Mock User Avatar */}
            <div className="h-8 w-8 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400 overflow-hidden font-bold text-xs select-none">
              <User size={16} />
            </div>
            
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">প্রশাসক</span>
              <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">ADMIN</span>
            </div>
            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Profile Dropdown Items */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-50 animate-fadeIn pointer-events-auto">
              <button 
                onClick={() => { 
                  setProfileOpen(false); 
                  if (setActiveTab) {
                    setActiveTab("admin-profile");
                    toast.success("প্রশাসক প্রোফাইল লোড করা হচ্ছে...", {
                      style: {
                        background: "#1f2937",
                        color: "#60a5fa",
                        border: "1px solid rgba(96, 165, 250, 0.2)"
                      }
                    });
                  } else {
                    toast("প্রোফাইল সেটিংস লোড হচ্ছে...");
                  }
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer"
              >
                <User size={14} className="text-slate-500" />
                <span>আমার প্রোফাইল</span>
              </button>
              <button 
                onClick={() => { setProfileOpen(false); toast("সিস্টেম সেটিংস প্যানেল লোড হচ্ছে..."); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer"
              >
                <Settings size={14} className="text-slate-500" />
                <span>সিস্টেম সেটিংস</span>
              </button>
              <div className="h-[1px] bg-slate-800 my-1" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
              >
                <LogOut size={14} />
                <span>লগআউট</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Header;
