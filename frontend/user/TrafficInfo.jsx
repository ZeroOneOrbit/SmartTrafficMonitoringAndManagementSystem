import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, Info, Bell, BellOff, Filter, ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const TrafficInfo = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Mock notifications list
  const alerts = [
    {
      id: 1,
      category: "accident",
      title: "মোহাম্মদপুর বাসস্ট্যান্ডে সড়ক দুর্ঘটনা",
      desc: "দুটি যাত্রীবাহী বাসের মুখোমুখি সংঘর্ষের ফলে মোহাম্মদপুর মূল সড়কে যান চলাচল সাময়িক বন্ধ রয়েছে। উদ্ধারকারী দল কাজ করছে। বিকল্প রাস্তা ব্যবহারের অনুরোধ করা যাচ্ছে।",
      severity: "high",
      time: "১০ মিনিট পূর্বে",
      road: "মোহাম্মদপুর মেইন রোড",
      action: "বিকল্প পথ ব্যবহার করুন"
    },
    {
      id: 2,
      category: "blockage",
      title: "উত্তরা আজমপুর ট্র্যাফিক ডাইভারশন",
      desc: "রাস্তা উন্নয়ন কাজের জন্য উত্তরা আজমপুর থেকে হাউস বিল্ডিং অভিমুখী একটি লেন বন্ধ আছে। যানজটের তীব্রতা এড়াতে সময় নিয়ে বের হোন।",
      severity: "medium",
      time: "২৫ মিনিট পূর্বে",
      road: "ঢাকা-ময়মনসিংহ মহাসড়ক",
      action: "ধীর গতিতে চলুন"
    },
    {
      id: 3,
      category: "signal",
      title: "মিরপুর ১০ সিগন্যাল কন্ট্রোলার বিকল",
      desc: "কারিগরি ত্রুটির কারণে মিরপুর ১০ নম্বর গোল চত্বরের সিগন্যাল লাইটগুলো কাজ করছে না। সেখানে ট্রাফিক পুলিশ ম্যানুয়ালি গাড়ি নিয়ন্ত্রণ করছে।",
      severity: "medium",
      time: "৪০ মিনিট পূর্বে",
      road: "মিরপুর রোড",
      action: "পুলিশের সংকেত লক্ষ্য করুন"
    },
    {
      id: 4,
      category: "accident",
      title: "টঙ্গী ফ্লাইওভার সংলগ্ন ট্রাক বিকল",
      desc: "টঙ্গী ফ্লাইওভারের মাঝামাঝি একটি ভারী মালবাহী ট্রাক বিকল হয়ে পড়ে আছে। এতে ঢাকাগামী লেনে ধীরগতি তৈরি হয়েছে। রেকার দল ঘটনাস্থলের দিকে রওয়ানা হয়েছে।",
      severity: "medium",
      time: "১ ঘণ্টা পূর্বে",
      road: "টঙ্গী ফ্লাইওভার",
      action: "ফ্লাইওভারের নিচে দিয়ে চলুন"
    },
    {
      id: 5,
      category: "update",
      title: "বিমানবন্দর সড়কে ট্রাফিক চলাচল স্বাভাবিক",
      desc: "বিমানবন্দর সড়কে সকালের দিকে তৈরি হওয়া জ্যাম এখন পুরোপুরি কেটে গিয়েছে। গাড়ি চলাচল এখন সম্পূর্ণরূপে স্বাভাবিক গতিতে চলছে।",
      severity: "info",
      time: "২ ঘণ্টা পূর্বে",
      road: "এয়ারপোর্ট রোড",
      action: "স্বাভাবিক চলাচল"
    },
    {
      id: 6,
      category: "blockage",
      title: "ফার্মগেট মোড়ে রাজনৈতিক সমাবেশ",
      desc: "ফার্মগেট আনন্দ সিনেমা হলের সামনের সড়কে বিক্ষোভ সমাবেশের জন্য রাস্তায় জ্যাম সৃষ্টি হয়েছে। আশেপাশের সড়কগুলোতে তীব্র চাপ রয়েছে।",
      severity: "high",
      time: "৩ ঘণ্টা পূর্বে",
      road: "ফার্মগেট ক্রসিং",
      action: "বিজয় সরণি রোড ব্যবহার করুন"
    }
  ];

  const handleSubscribeToggle = () => {
    setIsSubscribed(!isSubscribed);
    if (!isSubscribed) {
      toast.success("পুশ নোটিফিকেশন সাবস্ক্রিপশন সফল! গুরুত্বপূর্ণ আপডেটগুলো সরাসরি ব্রাউজারে পাঠানো হবে।", {
        icon: "🔔"
      });
    } else {
      toast.success("পুশ নোটিফিকেশন বন্ধ করা হয়েছে।");
    }
  };

  const filteredAlerts = activeFilter === "all" 
    ? alerts 
    : alerts.filter(a => a.category === activeFilter);

  return (
    <div className="flex flex-col gap-5 h-full">
      
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 border border-slate-900 p-5 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">জরুরি ট্রাফিক ইনফরমেশন বুলেটিন</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">সবচেয়ে দ্রুত ও নির্ভরযোগ্য ট্রাফিক সতর্কবার্তা এবং ডাইভারশন নোটিশ</p>
          </div>
        </div>

        <button
          onClick={handleSubscribeToggle}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            isSubscribed 
              ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white" 
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10"
          }`}
        >
          {isSubscribed ? (
            <>
              <BellOff size={14} />
              <span>নোটিফিকেশন বন্ধ করুন</span>
            </>
          ) : (
            <>
              <Bell size={14} className="animate-bounce" />
              <span>লাইভ পুশ এলার্ট অন করুন</span>
            </>
          )}
        </button>
      </div>

      {/* Filter and Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Filters Side (Span 3) */}
        <div className="lg:col-span-3 bg-slate-950/40 border border-slate-900 rounded-3xl p-5 backdrop-blur-xl space-y-2">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-2 px-1">ক্যাটেগরি ফিল্টার</span>
          
          {[
            { id: "all", name: "সকল সতর্কবার্তা" },
            { id: "accident", name: "সড়ক দুর্ঘটনা" },
            { id: "blockage", name: "রাস্তা অবরুদ্ধ / ডাইভারশন" },
            { id: "signal", name: "সিগন্যাল সমস্যা" },
            { id: "update", name: "গুরুত্বপূর্ণ আপডেট" }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                activeFilter === f.id
                  ? "bg-blue-600/10 border-blue-500/30 text-white"
                  : "bg-transparent border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
              }`}
            >
              <Filter size={10} className={activeFilter === f.id ? "text-blue-400" : "text-slate-500"} />
              <span>{f.name}</span>
            </button>
          ))}
        </div>

        {/* Right Alerts List (Span 9) */}
        <div className="lg:col-span-9 space-y-3">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              // Severity setup
              let cardBorder = "border-slate-900";
              let glow = "bg-slate-950/40";
              let badgeStyle = "bg-slate-900 text-slate-400 border-slate-800";
              let Icon = Info;

              if (alert.severity === "high") {
                cardBorder = "border-red-950/60";
                glow = "bg-red-950/5";
                badgeStyle = "bg-red-500/10 text-red-400 border-red-500/25";
                Icon = ShieldAlert;
              } else if (alert.severity === "medium") {
                cardBorder = "border-yellow-950/60";
                glow = "bg-yellow-950/5";
                badgeStyle = "bg-yellow-500/10 text-yellow-400 border-yellow-500/25";
                Icon = AlertTriangle;
              }

              return (
                <div
                  key={alert.id}
                  className={`border rounded-3xl p-5 ${cardBorder} ${glow} backdrop-blur-xl flex flex-col md:flex-row justify-between gap-4 transition-all duration-200 hover:border-slate-800`}
                >
                  <div className="flex gap-4">
                    <div className={`h-10 w-10 rounded-2xl border flex items-center justify-center shrink-0 ${
                      alert.severity === "high" 
                        ? "bg-red-500/10 border-red-500/30 text-red-400" 
                        : alert.severity === "medium"
                        ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                        : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    }`}>
                      <Icon size={18} className={alert.severity === "high" ? "animate-pulse" : ""} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xs font-black text-white">
                          {alert.title}
                        </h4>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${badgeStyle}`}>
                          {alert.severity === "high" ? "জরুরি" : alert.severity === "medium" ? "সতর্কতা" : "তথ্য"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl">{alert.desc}</p>
                      <div className="flex flex-wrap items-center gap-3 pt-1.5 text-[9px] text-slate-500 font-semibold">
                        <span>সড়ক: <span className="text-slate-300 font-bold">{alert.road}</span></span>
                        <span className="h-1 w-1 rounded-full bg-slate-800"></span>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-between items-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-900/60 md:border-l md:border-slate-900/60 md:pl-5">
                    <div className="text-left md:text-right">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest block">নির্দেশনা</span>
                      <span className={`text-[10px] font-bold block mt-0.5 ${
                        alert.severity === "high" ? "text-red-400 animate-pulse" : "text-slate-200"
                      }`}>{alert.action}</span>
                    </div>
                    <button className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold transition-colors cursor-pointer mt-2">
                      ম্যাপে দেখুন <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
              <CheckCircle size={32} className="text-emerald-500 mb-3" />
              <h4 className="text-xs font-bold text-white">কোনো নোটিফিকেশন পাওয়া যায়নি</h4>
              <p className="text-[10px] text-slate-500 mt-1">আপনার নির্বাচিত ফিল্টারে বর্তমানে কোনো আপডেট বা সতর্কবার্তা নেই।</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default TrafficInfo;
