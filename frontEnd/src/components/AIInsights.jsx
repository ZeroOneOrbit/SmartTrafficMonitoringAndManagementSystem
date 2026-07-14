import React, { useState, useEffect } from "react";
import { BrainCircuit, RefreshCw, ChevronRight, Activity, Zap } from "lucide-react";
import toast from "react-hot-toast";

const AIInsights = () => {
  const [timeLeft, setTimeLeft] = useState(150); // 2 minutes and 30 seconds = 150s

  // Optimization Timer countdown
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 300; // Reset to 5 mins
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Format seconds to MM:SS in Bengali numbers
  const formatTimeBengali = (sec) => {
    const minStr = Math.floor(sec / 60).toString().padStart(2, "0");
    const secStr = (sec % 60).toString().padStart(2, "0");
    
    // Map digits to Bengali digits
    const bengaliDigits = "০১২৩৪৫৬৭৮৯";
    const mappedMin = minStr.replace(/\d/g, (d) => bengaliDigits[d]);
    const mappedSec = secStr.replace(/\d/g, (d) => bengaliDigits[d]);
    
    return `${mappedMin}:${mappedSec} মিনিট`;
  };

  const handleOptimizeSignals = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "সিগন্যাল অপ্টিমাইজ করা হচ্ছে...",
        success: "সবগুলি সিগন্যাল অপ্টিমাইজ করা হয়েছে! সময় বাঁচবে ০২:৩০ মিনিট।",
        error: "অপ্টিমাইজেশন ব্যর্থ হয়েছে।"
      },
      {
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid rgba(59, 130, 246, 0.2)"
        }
      }
    );
    // Reset timer
    setTimeLeft(300); // 5 minutes
  };

  const handleTrackEmergency = () => {
    toast.success("জরুরি অ্যাম্বুলেন্স ই-১০১ ট্র্যাকিং সক্রিয় করা হয়েছে। ম্যাপ ভিউ দেখুন।", {
      style: { background: "#1e293b", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)" }
    });
  };

  const handleReroute = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: "বিকল্প রুট হিসাব করা হচ্ছে...",
        success: "বিকল্প রুট সফলভাবে গণনায় এসেছে। ৩টি নোড রি-রাইউট করা হয়েছে।",
        error: "ব্যর্থ হয়েছে।"
      },
      {
        style: { background: "#1e293b", color: "#fff", border: "1px solid rgba(139, 92, 246, 0.2)" }
      }
    );
  };

  return (
    <div className="w-full bg-slate-950/60 border border-blue-950/40 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden h-[330px]">
      
      {/* Background radial accent */}
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-blue-500/5 blur-[40px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 text-blue-400 border-b border-slate-900 pb-3 mb-3">
        <BrainCircuit size={16} className="animate-pulse" />
        <h3 className="text-xs font-bold tracking-widest uppercase">
          AI অ্যানালিটিক্স ইনসাইট
        </h3>
      </div>

      {/* Grid Elements */}
      <div className="flex-grow space-y-3.5">
        
        {/* Element 1: Traffic Jam Forecast */}
        <div className="bg-slate-900/30 border border-slate-900/60 p-3 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-bold tracking-wider mb-1.5">
            <span className="text-slate-500 uppercase">ট্রাফিক জ্যাম পূর্বাভাস</span>
            <span className="text-red-400 font-extrabold flex items-center gap-0.5">
              <Zap size={10} className="animate-bounce" />
              <span>উচ্চ ঝুঁকি</span>
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
            <span>মিরপুর - ফার্মগেট করিডর</span>
            <span className="text-red-400 font-mono">৭৮%</span>
          </div>

          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full rounded-full w-[78%] animate-pulse" />
          </div>
        </div>

        {/* Element 2: Signal Optimization */}
        <div className="bg-slate-900/30 border border-slate-900/60 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">সিগন্যাল অপ্টিমাইজেশন</span>
            <span className="text-xs font-bold text-slate-400 mt-0.5">সময় সাশ্রয় হবে</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-sm font-black font-sans text-blue-400 tracking-wide">
              {formatTimeBengali(timeLeft)}
            </span>
            <button 
              onClick={handleOptimizeSignals}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-200 cursor-pointer"
            >
              <RefreshCw size={12} className="animate-spin-slow" />
            </button>
          </div>
        </div>

      </div>

      {/* Quick Actions List */}
      <div className="mt-4 border-t border-slate-900 pt-3 space-y-1.5">
        <span className="block text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1">
          দ্রুত অ্যাকশন
        </span>
        
        {/* Action 1 */}
        <button 
          onClick={handleOptimizeSignals}
          className="w-full flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-slate-900/60 text-[10px] font-bold text-slate-400 hover:text-white transition-all duration-150 cursor-pointer"
        >
          <span>সিগন্যাল অপ্টিমাইজ করুন</span>
          <ChevronRight size={12} className="text-slate-600" />
        </button>

        {/* Action 2 */}
        <button 
          onClick={handleTrackEmergency}
          className="w-full flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-slate-900/60 text-[10px] font-bold text-slate-400 hover:text-white transition-all duration-150 cursor-pointer"
        >
          <span>জরুরি যানবাহন ট্র্যাক করুন</span>
          <ChevronRight size={12} className="text-slate-600" />
        </button>

        {/* Action 3 */}
        <button 
          onClick={handleReroute}
          className="w-full flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-slate-900/60 text-[10px] font-bold text-slate-400 hover:text-white transition-all duration-150 cursor-pointer"
        >
          <span>ট্রাফিক রিরাইউট করুন</span>
          <ChevronRight size={12} className="text-slate-600" />
        </button>
      </div>

    </div>
  );
};

export default AIInsights;
