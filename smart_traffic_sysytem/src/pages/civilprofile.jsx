import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Shield, Mail, Phone, Calendar, 
  MapPin, Award, FileText, ArrowLeft, LogOut, CheckCircle, RefreshCw, AlertTriangle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const CivilProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLocation, setEditLocation] = useState("");
  const [editContact, setEditContact] = useState("");

  // Load user from localStorage or fallback to a default mock
  useEffect(() => {
    const loggedInId = localStorage.getItem("loggedInUserId");
    const usersList = JSON.parse(localStorage.getItem("systemUsers") || "[]");
    
    let matchedUser = usersList.find(u => u.userId === loggedInId);
    
    if (!matchedUser) {
      // Fallback demo user
      matchedUser = {
        userId: "TMU-583091",
        tmuCode: "583091",
        role: "driver",
        name: "আরিফ হাসান",
        licenceNo: "DL-883904-BD",
        nidNo: "NID-1994029482",
        nationality: "বাংলাদেশী",
        dob: "১২ জানুয়ারি, ১৯৯৪",
        gender: "পুরুষ",
        location: "ধানমন্ডি, ঢাকা",
        contactNo: "+৮৮০ ১৭৯৯-১১২২৩৪",
        email: "arif.driver@smarttraffic.com",
        bloodGroup: "O+",
        vehicleType: "প্রাইভেটকার",
        experience: "৫ বছর"
      };
    }
    
    setCurrentUser(matchedUser);
    setEditLocation(matchedUser.location);
    setEditContact(matchedUser.contactNo);
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#030712]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-blue-500" size={32} />
          <p className="text-sm font-semibold tracking-wide text-slate-400">লোডিং প্রোফাইল...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUserId");
    toast.success("সফলভাবে লগআউট করা হয়েছে।", {
      style: {
        background: "#1f2937",
        color: "#94a3b8"
      }
    });
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Update local storage and state
    const updatedUser = {
      ...currentUser,
      location: editLocation,
      contactNo: editContact
    };
    
    const usersList = JSON.parse(localStorage.getItem("systemUsers") || "[]");
    const idx = usersList.findIndex(u => u.userId === currentUser.userId);
    if (idx !== -1) {
      usersList[idx] = updatedUser;
      localStorage.setItem("systemUsers", JSON.stringify(usersList));
    }
    
    setCurrentUser(updatedUser);
    setIsEditing(false);
    toast.success("তথ্য আপডেট সফল হয়েছে!", {
      style: {
        background: "#1f2937",
        color: "#10b981",
        border: "1px solid rgba(16, 185, 129, 0.2)"
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8 relative">
      <Toaster position="top-center" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-900 z-10">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all duration-200 cursor-pointer text-[10px] sm:text-xs font-semibold shrink-0"
        >
          <ArrowLeft size={12} className="sm:w-3.5 sm:h-3.5" />
          <span>পোর্টাল</span>
        </button>
        <h2 className="text-[10px] sm:text-sm font-bold text-slate-400 tracking-wider text-center truncate px-1">
          {currentUser.role === "driver" ? "ডিজিটাল ড্রাইভার পোর্টাল" : "ডিজিটাল নাগরিক পোর্টাল"}
        </h2>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-red-950/40 text-red-400 hover:text-white hover:bg-red-500/10 transition-all duration-200 cursor-pointer text-[10px] sm:text-xs font-semibold shrink-0"
        >
          <LogOut size={12} className="sm:w-3.5 sm:h-3.5" />
          <span>লগআউট</span>
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 flex-1">
        
        {/* LEFT COLUMN: The Interactive digital smart card (Span 5) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start gap-4">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">
            স্মার্ট কার্ড (ফ্লিপ করতে ট্যাপ করুন)
          </span>

          {/* Flip Card Container */}
          <div 
            className="w-full max-w-sm h-60 cursor-pointer relative"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ perspective: "1000px" }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-full relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              
              {/* CARD FRONT */}
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl p-5 bg-gradient-to-br from-[#0c192c] to-[#040914] border border-blue-500/30 flex flex-col justify-between shadow-2xl select-none"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Holographic grid and chip */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.15)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none rounded-2xl" />
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-500/5 blur-[50px] pointer-events-none" />

                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest leading-none">গণপ্রজাতন্ত্রী বাংলাদেশ</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1">জাতীয় স্মার্ট ট্রাফিক কার্ড</span>
                  </div>
                  {/* Smart SIM Chip layout */}
                  <div className="h-6 w-8 rounded bg-gradient-to-r from-amber-500 to-yellow-600/80 border border-amber-600 opacity-80" />
                </div>

                <div className="flex gap-3 items-center mt-3">
                  {/* Digital Photo Avatar */}
                  <div className="h-16 w-16 rounded border border-blue-500/20 bg-blue-950/60 flex items-center justify-center text-blue-400 font-bold relative overflow-hidden shrink-0">
                    <User size={30} />
                    <div className="absolute bottom-0 w-full bg-blue-500/10 text-[8px] py-0.5 text-center text-cyan-400 font-mono tracking-widest">ACTIVE</div>
                  </div>

                  <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-bold text-white leading-snug truncate">{currentUser.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono tracking-wider">{currentUser.role === "driver" ? `লাইসেন্স: ${currentUser.licenceNo}` : "নাগরিক কার্ড"}</span>
                    <span className="text-[9px] text-cyan-400 font-mono tracking-wider font-bold">TMU: {currentUser.tmuCode || currentUser.userId.replace("TMU-", "")}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-slate-900/60 pt-3 mt-2 text-[8px] font-mono text-slate-400">
                  <div className="flex flex-col">
                    <span>রক্তের গ্রুপ: <span className="text-red-400 font-bold">{currentUser.bloodGroup || "N/A"}</span></span>
                    <span>লিঙ্গ: {currentUser.gender}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span>কার্ড আইডি: {currentUser.userId}</span>
                    <span className="text-cyan-400">স্মার্ট ট্রাফিক অথরিটি</span>
                  </div>
                </div>
              </div>

              {/* CARD BACK */}
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl p-5 bg-gradient-to-br from-[#040914] to-[#0c192c] border border-blue-500/30 flex flex-col justify-between shadow-2xl select-none"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.15)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none rounded-2xl" />
                
                {/* Magnetic Strip mock */}
                <div className="h-6 bg-slate-950 -mx-5 border-y border-slate-900" />

                <div className="flex justify-between items-start mt-2 text-[8px] font-mono text-slate-400">
                  <div className="flex flex-col gap-1">
                    <span>জাতীয়তা: {currentUser.nationality || "বাংলাদেশী"}</span>
                    <span>জন্ম তারিখ: {currentUser.dob}</span>
                    <span>যানবাহন টাইপ: {currentUser.vehicleType || "ব্যক্তিগত"}</span>
                  </div>
                  <div className="flex flex-col text-right gap-1">
                    <span>ইস্যু ডেট: ০১ জানুয়ারি, ২০২৬</span>
                    <span>মেয়াদ উত্তীর্ণ: ৩১ ডিসেম্বর, ২০৩১</span>
                    <span>রোল: {currentUser.role === "driver" ? "চালক (Driver)" : "সাধারণ ইউজার"}</span>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-2 flex flex-col text-[7px] text-slate-500 font-semibold uppercase tracking-wider text-center">
                  <span>কার্ডটি কোনো অবৈধ কাজে ব্যবহার করলে আইনত দণ্ডনীয় অপরাধ।</span>
                  <span className="text-[6px] mt-0.5 text-slate-600">স্মার্ট ট্রাফিক ডাটাবেজ সিস্টেম v1.0.0</span>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Quick Stats Grid */}
          <div className="w-full max-w-sm grid grid-cols-2 gap-3 mt-2">
            <div className="bg-slate-950/30 border border-slate-900 p-4 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">ড্রাইভিং স্কোর</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">১২ / ১২</span>
              <span className="text-[9px] text-slate-600 block mt-0.5">কোনো পেনাল্টি পয়েন্ট নেই</span>
            </div>
            <div className="bg-slate-950/30 border border-slate-900 p-4 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">ভায়োলেশন লিস্ট</span>
              <span className="text-xl font-extrabold text-slate-400 font-mono">০</span>
              <span className="text-[9px] text-slate-600 block mt-0.5">সব ট্রাফিক আইন মান্য</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Profile details and editor form (Span 7) */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-6">
                <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
                  <FileText size={16} /> প্রোফাইল বিবরণী
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isEditing 
                      ? "border-slate-800 text-slate-400 hover:text-white bg-slate-950/60" 
                      : "border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  }`}
                >
                  {isEditing ? "সম্পাদনা বন্ধ করুন" : "তথ্য পরিবর্তন করুন"}
                </button>
              </div>

              {isEditing ? (
                // EDITING FORM
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ব্যবহারকারীর নাম</label>
                      <input 
                        type="text" 
                        disabled 
                        value={currentUser.name} 
                        className="w-full bg-slate-900/40 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed outline-none"
                      />
                      <span className="text-[9px] text-slate-600 mt-1 block">* নিরাপত্তা জনিত কারণে নাম পরিবর্তন সম্ভব নয়।</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">TMU কোড</label>
                      <input 
                        type="text" 
                        disabled 
                        value={currentUser.userId} 
                        className="w-full bg-slate-900/40 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">বর্তমান মোবাইল নম্বর</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="text" 
                          required
                          value={editContact} 
                          onChange={(e) => setEditContact(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500/50 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none transition-all cursor-text"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">লোকেশন / জেলা</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="text" 
                          required
                          value={editLocation} 
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500/50 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none transition-all cursor-text"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-900 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setEditLocation(currentUser.location);
                        setEditContact(currentUser.contactNo);
                        setIsEditing(false);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white font-bold text-xs cursor-pointer transition-colors text-center"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/10 cursor-pointer transition-colors text-center"
                    >
                      আপডেট নিশ্চিত করুন
                    </button>
                  </div>
                </form>
              ) : (
                // VIEW DETAILS PANEL
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Item 1 */}
                    <div className="bg-slate-950/20 border border-slate-900/40 p-3.5 rounded-xl flex items-start gap-3">
                      <User size={16} className="text-cyan-500 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">পুরো নাম</span>
                        <span className="text-xs font-semibold text-white mt-1">{currentUser.name}</span>
                      </div>
                    </div>

                    {/* Item 2 - TMU Code */}
                    <div className="bg-cyan-950/20 border border-cyan-500/20 p-3.5 rounded-xl flex items-start gap-3">
                      <Shield size={16} className="text-cyan-400 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-wider">TMU কোড (পরিচয় নম্বর)</span>
                        <span className="text-lg font-black text-cyan-400 font-mono mt-0.5 tracking-widest select-all">
                          {currentUser.tmuCode || currentUser.userId.replace("TMU-", "")}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">{currentUser.userId}</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="bg-slate-950/20 border border-slate-900/40 p-3.5 rounded-xl flex items-start gap-3">
                      <FileText size={16} className="text-cyan-500 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">জাতীয় পরিচয়পত্র (NID)</span>
                        <span className="text-xs font-semibold text-white font-mono mt-1">{currentUser.nidNo}</span>
                      </div>
                    </div>

                    {/* Item 4 */}
                    {currentUser.licenceNo && (
                      <div className="bg-slate-950/20 border border-slate-900/40 p-3.5 rounded-xl flex items-start gap-3">
                        <Award size={16} className="text-cyan-500 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ড্রাইভিং লাইসেন্স নম্বর</span>
                          <span className="text-xs font-semibold text-white font-mono mt-1">{currentUser.licenceNo}</span>
                        </div>
                      </div>
                    )}

                    {/* Item 5 */}
                    <div className="bg-slate-950/20 border border-slate-900/40 p-3.5 rounded-xl flex items-start gap-3">
                      <Calendar size={16} className="text-cyan-500 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">জন্ম তারিখ</span>
                        <span className="text-xs font-semibold text-white mt-1">{currentUser.dob}</span>
                      </div>
                    </div>

                    {/* Item 6 */}
                    <div className="bg-slate-950/20 border border-slate-900/40 p-3.5 rounded-xl flex items-start gap-3">
                      <MapPin size={16} className="text-cyan-500 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">বর্তমান অবস্থান</span>
                        <span className="text-xs font-semibold text-white mt-1">{currentUser.location}</span>
                      </div>
                    </div>

                    {/* Item 7 */}
                    <div className="bg-slate-950/20 border border-slate-900/40 p-3.5 rounded-xl flex items-start gap-3">
                      <User size={16} className="text-cyan-500 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">লিঙ্গ</span>
                        <span className="text-xs font-semibold text-white mt-1">{currentUser.gender}</span>
                      </div>
                    </div>

                    {/* Item 8 */}
                    <div className="bg-slate-950/20 border border-slate-900/40 p-3.5 rounded-xl flex items-start gap-3">
                      <Mail size={16} className="text-cyan-500 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ইমেইল ঠিকানা</span>
                        <span className="text-xs font-semibold text-white font-mono mt-1">{currentUser.email || "N/A"}</span>
                      </div>
                    </div>

                    {/* Additional fields for driver */}
                    {currentUser.role === "driver" && (
                      <>
                        <div className="bg-slate-950/20 border border-slate-900/40 p-3.5 rounded-xl flex items-start gap-3">
                          <FileText size={16} className="text-cyan-500 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">যানবাহনের শ্রেণী</span>
                            <span className="text-xs font-semibold text-white mt-1">{currentUser.vehicleType || "মোটরসাইকেল/কার"}</span>
                          </div>
                        </div>

                        <div className="bg-slate-950/20 border border-slate-900/40 p-3.5 rounded-xl flex items-start gap-3">
                          <Award size={16} className="text-cyan-500 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ড্রাইভিং অভিজ্ঞতা</span>
                            <span className="text-xs font-semibold text-white mt-1">{currentUser.experience || "N/A"}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Notice bottom */}
            <div className="mt-8 border-t border-slate-900 pt-4 flex gap-3 items-center bg-slate-900/10 p-3 rounded-xl">
              <CheckCircle size={16} className="text-emerald-500 shrink-0" />
              <p className="text-[10px] text-slate-500 leading-snug">
                আপনার লাইসেন্স কার্ড ও ট্রাফিক ডাটা সরাসরি সরকারি স্মার্ট ডাটা নেটওয়ার্কের সাথে সংযুক্ত রয়েছে। যেকোনো ভায়োলেশন হলে লাইভ ড্যাশবোর্ডে তা স্বয়ংক্রিয়ভাবে আপডেট হবে।
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default CivilProfile;
