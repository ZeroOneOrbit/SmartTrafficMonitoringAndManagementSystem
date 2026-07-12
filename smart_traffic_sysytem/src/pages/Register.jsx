import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrafficCone, User, Shield, FileText, CheckCircle, 
  MapPin, Calendar, Award, Mail, Phone, ChevronRight, ArrowLeft, Lock, Eye, EyeOff
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  
  // Form fields
  const [name, setName] = useState("");
  const [licenceNo, setLicenceNo] = useState("");
  const [nidNo, setNidNo] = useState("");
  const [nationality, setNationality] = useState("বাংলাদেশী");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [experience, setExperience] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Generated result
  const [generatedId, setGeneratedId] = useState("");

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !nidNo || !dob || !location || !gender || !contactNo) {
      toast.error("দয়া করে তারকাচিহ্নিত (*) বাধ্যতামূলক ক্ষেত্রগুলি পূরণ করুন।", {
        style: { background: "#1f2937", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }
      });
      return;
    }

    if (role === "driver" && !licenceNo) {
      toast.error("চালকের জন্য ড্রাইভিং লাইসেন্স নম্বর বাধ্যতামূলক।", {
        style: { background: "#1f2937", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }
      });
      return;
    }

    if (!password || password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।", {
        style: { background: "#1f2937", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মিলছে না।", {
        style: { background: "#1f2937", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }
      });
      return;
    }

    // Generate 6-digit TMU code
    const sixDigit = String(Math.floor(100000 + Math.random() * 900000));
    const newTmuId = `TMU-${sixDigit}`;
    
    const newUser = {
      userId: newTmuId,
      tmuCode: sixDigit,
      role,
      name,
      password, // stored for demo; in production this would be hashed
      licenceNo: licenceNo || "N/A",
      nidNo,
      nationality,
      dob,
      location,
      gender,
      contactNo,
      email: email || "N/A",
      bloodGroup: bloodGroup || "N/A",
      vehicleType: role === "driver" ? (vehicleType || "N/A") : "N/A",
      experience: role === "driver" ? (experience || "N/A") : "N/A"
    };

    const existingUsers = JSON.parse(localStorage.getItem("systemUsers") || "[]");
    existingUsers.push(newUser);
    localStorage.setItem("systemUsers", JSON.stringify(existingUsers));

    setGeneratedId(newTmuId);
    setStep(3);

    toast.success("নিবন্ধন সফল হয়েছে!", {
      style: { background: "#1f2937", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      <div className="relative w-full max-w-xl bg-black/35 backdrop-blur-lg border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />

        {/* Back navigation (step 2 only) */}
        {step === 2 && (
          <button onClick={() => setStep(1)} className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors text-xs font-bold mb-4 cursor-pointer">
            <ArrowLeft size={12} /> ফিরে যান
          </button>
        )}

        {/* Heading */}
        <div className="flex flex-col items-center mb-7 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 mb-3">
            <TrafficCone size={24} className="animate-pulse" />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
            স্মার্ট ট্রাফিক সিস্টেম নিবন্ধন
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            আপনার TMU কোড সহ ডিজিটাল প্রোফাইল তৈরি করুন
          </p>
        </div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1: ROLE SELECTION ────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-xs font-bold text-center text-slate-300 mb-6 uppercase tracking-wider">
                আপনার সিস্টেমের ভূমিকা (Role) নির্বাচন করুন
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect("driver")}
                  className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 hover:border-blue-500/40 transition-all duration-200 text-center cursor-pointer group"
                >
                  <div className="h-14 w-14 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
                    <Award size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">যানবাহন চালক (Driver)</h3>
                    <p className="text-xs text-slate-500 mt-1">ডিজিটাল ড্রাইভিং লাইসেন্স এবং যানবাহন রেকর্ড।</p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 mt-1">
                    নিবন্ধন করুন <ChevronRight size={10} />
                  </span>
                </button>

                <button
                  onClick={() => handleRoleSelect("user")}
                  className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 hover:border-cyan-500/40 transition-all duration-200 text-center cursor-pointer group"
                >
                  <div className="h-14 w-14 rounded-full bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">সাধারণ নাগরিক (Civilian)</h3>
                    <p className="text-xs text-slate-500 mt-1">স্মার্ট নাগরিক পোর্টাল এবং ট্রাফিক ডাটা।</p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 mt-1">
                    নিবন্ধন করুন <ChevronRight size={10} />
                  </span>
                </button>
              </div>

              <div className="pt-6 border-t border-slate-900 text-center">
                <p className="text-xs text-slate-500">
                  ইতিমধ্যেই অ্যাকাউন্ট আছে?{" "}
                  <button
                    onClick={() => navigate("/login-civil")}
                    className="text-cyan-400 hover:text-cyan-300 font-bold transition duration-200 cursor-pointer"
                  >
                    নাগরিক লগইন করুন →
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: REGISTRATION FORM ─────────────────────── */}
          {step === 2 && (
            <motion.form
              key="step2"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex justify-between">
                <span>বিবরণী পূরণ করুন ({role === "driver" ? "চালক" : "নাগরিক"})</span>
                <span className="text-blue-400 font-bold">* বাধ্যতামূলক</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] sm:max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">

                {/* Name */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">নাম *</label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <User size={14} className="text-slate-500" />
                    <input type="text" required placeholder="আপনার পুরো নাম" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-2.5 text-white text-xs outline-none cursor-text" />
                  </div>
                </div>

                {/* NID No */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">এনআইডি নম্বর *</label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <FileText size={14} className="text-slate-500" />
                    <input type="text" required placeholder="NID নম্বর" value={nidNo} onChange={(e) => setNidNo(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-2.5 text-white text-xs outline-none cursor-text font-mono" />
                  </div>
                </div>

                {/* Driving Licence */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">
                    ড্রাইভিং লাইসেন্স {role === "driver" ? "*" : "(ঐচ্ছিক)"}
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <Award size={14} className="text-slate-500" />
                    <input type="text" required={role === "driver"} placeholder="লাইসেন্স নম্বর" value={licenceNo} onChange={(e) => setLicenceNo(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-2.5 text-white text-xs outline-none cursor-text font-mono" />
                  </div>
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">জন্ম তারিখ *</label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <Calendar size={14} className="text-slate-500" />
                    <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-2.5 text-white text-xs outline-none cursor-pointer" />
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">মোবাইল নম্বর *</label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <Phone size={14} className="text-slate-500" />
                    <input type="text" required placeholder="মোবাইল নম্বর" value={contactNo} onChange={(e) => setContactNo(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-2.5 text-white text-xs outline-none cursor-text font-mono" />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">জেলা / অবস্থান *</label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <MapPin size={14} className="text-slate-500" />
                    <input type="text" required placeholder="শহর বা জেলা" value={location} onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-2.5 text-white text-xs outline-none cursor-text" />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">লিঙ্গ *</label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <select required value={gender} onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-3 text-white text-xs outline-none cursor-pointer">
                      <option value="" className="bg-slate-950">লিঙ্গ নির্বাচন করুন</option>
                      <option value="পুরুষ" className="bg-slate-950">পুরুষ</option>
                      <option value="নারী" className="bg-slate-950">নারী</option>
                      <option value="অন্যান্য" className="bg-slate-950">অন্যান্য</option>
                    </select>
                  </div>
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">জাতীয়তা</label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <MapPin size={14} className="text-slate-500" />
                    <input type="text" placeholder="বাংলাদেশী" value={nationality} onChange={(e) => setNationality(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-2.5 text-white text-xs outline-none cursor-text" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">ইমেইল (ঐচ্ছিক)</label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <Mail size={14} className="text-slate-500" />
                    <input type="email" placeholder="ইমেইল এড্রেস" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-2.5 text-white text-xs outline-none cursor-text font-mono" />
                  </div>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">রক্তের গ্রুপ</label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-3 text-white text-xs outline-none cursor-pointer">
                      <option value="" className="bg-slate-950">রক্তের গ্রুপ নির্বাচন করুন</option>
                      {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g => (
                        <option key={g} value={g} className="bg-slate-950">{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vehicle Type (Driver only) */}
                {role === "driver" && (
                  <>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">যানবাহনের ধরন</label>
                      <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                        <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}
                          className="w-full bg-transparent px-2.5 py-3 text-white text-xs outline-none cursor-pointer">
                          <option value="" className="bg-slate-950">যানবাহন নির্বাচন করুন</option>
                          <option value="মোটরসাইকেল" className="bg-slate-950">মোটরসাইকেল</option>
                          <option value="প্রাইভেটকার" className="bg-slate-950">প্রাইভেটকার</option>
                          <option value="বাস" className="bg-slate-950">বাস</option>
                          <option value="ট্রাক" className="bg-slate-950">ট্রাক</option>
                          <option value="অটোরিকশা" className="bg-slate-950">অটোরিকশা</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">ড্রাইভিং অভিজ্ঞতা (বছর)</label>
                      <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                        <input type="text" placeholder="যেমন: ৩ বছর" value={experience} onChange={(e) => setExperience(e.target.value)}
                          className="w-full bg-transparent px-2.5 py-2.5 text-white text-xs outline-none cursor-text" />
                      </div>
                    </div>
                  </>
                )}

                {/* ── Password ── */}
                <div className="md:col-span-2 border-t border-slate-900/60 pt-4">
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Lock size={11} /> অ্যাকাউন্ট সুরক্ষা
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">পাসওয়ার্ড *</label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <Lock size={14} className="text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-2.5 text-white text-xs outline-none cursor-text"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-slate-300 cursor-pointer">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">পাসওয়ার্ড নিশ্চিত করুন *</label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3">
                    <Lock size={14} className="text-slate-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-2.5 text-white text-xs outline-none cursor-text"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-500 hover:text-slate-300 cursor-pointer">
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[10px] text-red-400 mt-1 font-semibold">⚠ পাসওয়ার্ড মিলছে না</p>
                  )}
                  {confirmPassword && password === confirmPassword && password.length >= 6 && (
                    <p className="text-[10px] text-emerald-400 mt-1 font-semibold">✓ পাসওয়ার্ড নিশ্চিত হয়েছে</p>
                  )}
                </div>

              </div>

              <button type="submit"
                className="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all duration-200 shadow-lg cursor-pointer">
                নিবন্ধন সম্পন্ন করুন
              </button>
            </motion.form>
          )}

          {/* ── STEP 3: SUCCESS SCREEN ─────────────────────────── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-6"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full bg-emerald-500/15 blur-xl animate-pulse" />
                  <CheckCircle size={60} className="text-emerald-400 relative" />
                </div>
                <h2 className="text-xl font-black text-white">নিবন্ধন সম্পন্ন!</h2>
                <p className="text-xs text-slate-400">আপনার ডিজিটাল TMU কোড তৈরি হয়েছে।</p>
              </div>

              {/* Generated Credentials Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 blur-xl rounded-full" />

                <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase tracking-wider">আপনার TMU কোড:</span>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-black text-cyan-400 font-mono tracking-[0.2em] select-all">
                    {generatedId.replace("TMU-", "")}
                  </span>
                  <span className="text-xs text-slate-600 font-mono">({generatedId})</span>
                </div>

                {/* Six-dot visual */}
                <div className="flex gap-2 mt-3 mb-4">
                  {generatedId.replace("TMU-", "").split("").map((digit, i) => (
                    <div key={i} className="flex-1 h-10 flex items-center justify-center bg-slate-900 border border-cyan-500/20 rounded-lg">
                      <span className="text-sm font-black text-cyan-400 font-mono">{digit}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-400 border-t border-slate-900 pt-3">
                  <div><span className="block text-slate-500 font-bold">নাম:</span><span className="font-semibold text-white">{name}</span></div>
                  <div><span className="block text-slate-500 font-bold">ভূমিকা:</span><span className="font-semibold text-white uppercase">{role === "driver" ? "চালক" : "নাগরিক"}</span></div>
                  <div><span className="block text-slate-500 font-bold">NID:</span><span className="font-semibold text-white font-mono">{nidNo}</span></div>
                  {role === "driver" && licenceNo && (
                    <div><span className="block text-slate-500 font-bold">লাইসেন্স:</span><span className="font-semibold text-white font-mono">{licenceNo}</span></div>
                  )}
                </div>
              </div>

              <div className="text-xs text-amber-500 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-left">
                ⚠ আপনার <strong>৬ সংখ্যার TMU কোড</strong> এবং পাসওয়ার্ড মনে রাখুন। লগইনের সময় এই দুটো তথ্য প্রয়োজন হবে।
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    localStorage.setItem("loggedInUserId", generatedId);
                    navigate("/profile");
                  }}
                  className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-all duration-200 shadow-lg cursor-pointer"
                >
                  প্রোফাইলে প্রবেশ করুন
                </button>
                <button
                  onClick={() => navigate("/login-civil")}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-all duration-200 cursor-pointer"
                >
                  নাগরিক লগইন পেজ →
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Register;
