import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, Shield, Mail, Phone, Calendar, 
  MapPin, Briefcase, Building, Edit3, Save, X, CheckCircle, Clock
} from "lucide-react";
import toast from "react-hot-toast";

const AdminProfile = () => {
  // Mock Admin Details
  const [adminDetails, setAdminDetails] = useState({
    name: "তারেক রহমান",
    userId: "ADM-99420",
    department: "ট্রাফিক অপারেশনস ও এআই কন্ট্রোল",
    area: "ঢাকা মেট্রোপলিটন (উত্তর)",
    careerRole: "সিনিয়র ট্রাফিক কন্ট্রোলার",
    email: "tarek.admin@smarttraffic.gov.bd",
    contactNo: "+৮৮০ ১৭১২-৩৪৫৬৭৮",
    dob: "১৫ মার্চ, ১৯৮৮",
    gender: "পুরুষ",
    currentLocation: "বনানী কমান্ড সেন্টার, ঢাকা",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempDetails, setTempDetails] = useState({ ...adminDetails });

  const handleEditToggle = () => {
    setTempDetails({ ...adminDetails });
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setTempDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setAdminDetails({ ...tempDetails });
    setIsEditing(false);
    toast.success("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!", {
      style: {
        background: "#1f2937",
        color: "#10b981",
        border: "1px solid rgba(16, 185, 129, 0.2)"
      }
    });
  };

  return (
    <div className="w-full max-w-[1300px] mx-auto p-2 md:p-4 text-white">
      {/* Glow Effects */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Main Profile Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-slate-950/40 border border-blue-950/60 rounded-3xl backdrop-blur-xl p-6 md:p-8 shadow-2xl"
      >
        {/* Futurisic Scanline & Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scanline pointer-events-none opacity-40" />

        {/* Profile Header */}
        <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-slate-900 z-10">
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Avatar block */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 opacity-60 blur-md group-hover:opacity-100 transition duration-300" />
              <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full border-2 border-cyan-400 bg-slate-950 flex items-center justify-center text-cyan-400 overflow-hidden font-bold select-none shadow-xl">
                <User size={56} className="text-blue-400" />
              </div>
              <span className="absolute bottom-1.5 right-1.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
                  {adminDetails.name}
                </h1>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                  <Shield size={10} /> এডমিন
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1.5 font-semibold flex items-center justify-center md:justify-start gap-1.5">
                <Briefcase size={14} className="text-slate-500" /> {adminDetails.careerRole}
              </p>
              <p className="text-xs text-blue-400/80 font-semibold font-mono mt-1 flex items-center justify-center md:justify-start gap-1">
                <span>আইডি: {adminDetails.userId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleEditToggle}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-lg ${
              isEditing 
                ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white" 
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10"
            }`}
          >
            {isEditing ? (
              <>
                <X size={14} />
                <span>বাতিল করুন</span>
              </>
            ) : (
              <>
                <Edit3 size={14} />
                <span>সম্পাদনা করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Details Grid & Fields */}
        <form onSubmit={handleSave} className="relative mt-8 z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* COLUMN 1: System & Professional Role details */}
            <div className="space-y-5 bg-slate-950/20 border border-slate-900/60 p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-cyan-400 border-b border-slate-900 pb-2 flex items-center gap-2 uppercase tracking-wide">
                <Building size={14} /> প্রাতিষ্ঠানিক তথ্য
              </h3>

              {/* Department */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">বিভাগ (Department)</label>
                <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-900 px-3.5 py-3 rounded-xl">
                  <Building size={16} className="text-blue-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempDetails.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      className="w-full bg-transparent text-sm text-white outline-none border-b border-blue-500/20 focus:border-blue-500 transition-colors cursor-text"
                      required
                    />
                  ) : (
                    <span className="text-sm font-semibold">{adminDetails.department}</span>
                  )}
                </div>
              </div>

              {/* Career Role */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ক্যারিয়ার রোল (Career Role)</label>
                <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-900 px-3.5 py-3 rounded-xl">
                  <Briefcase size={16} className="text-blue-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempDetails.careerRole}
                      onChange={(e) => handleInputChange("careerRole", e.target.value)}
                      className="w-full bg-transparent text-sm text-white outline-none border-b border-blue-500/20 focus:border-blue-500 transition-colors cursor-text"
                      required
                    />
                  ) : (
                    <span className="text-sm font-semibold">{adminDetails.careerRole}</span>
                  )}
                </div>
              </div>

              {/* Operations Area */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">কর্মক্ষেত্র (Operation Area)</label>
                <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-900 px-3.5 py-3 rounded-xl">
                  <MapPin size={16} className="text-blue-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempDetails.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      className="w-full bg-transparent text-sm text-white outline-none border-b border-blue-500/20 focus:border-blue-500 transition-colors cursor-text"
                      required
                    />
                  ) : (
                    <span className="text-sm font-semibold">{adminDetails.area}</span>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMN 2: Personal & Contact details */}
            <div className="space-y-5 bg-slate-950/20 border border-slate-900/60 p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-cyan-400 border-b border-slate-900 pb-2 flex items-center gap-2 uppercase tracking-wide">
                <User size={14} /> ব্যক্তিগত ও যোগাযোগ
              </h3>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ইমেইল (Email Address)</label>
                <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-900 px-3.5 py-3 rounded-xl">
                  <Mail size={16} className="text-blue-500" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempDetails.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full bg-transparent text-sm text-white outline-none border-b border-blue-500/20 focus:border-blue-500 transition-colors cursor-text"
                      required
                    />
                  ) : (
                    <span className="text-sm font-semibold font-mono">{adminDetails.email}</span>
                  )}
                </div>
              </div>

              {/* Contact No */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">মোবাইল নম্বর (Contact No)</label>
                <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-900 px-3.5 py-3 rounded-xl">
                  <Phone size={16} className="text-blue-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempDetails.contactNo}
                      onChange={(e) => handleInputChange("contactNo", e.target.value)}
                      className="w-full bg-transparent text-sm text-white outline-none border-b border-blue-500/20 focus:border-blue-500 transition-colors cursor-text"
                      required
                    />
                  ) : (
                    <span className="text-sm font-semibold font-mono">{adminDetails.contactNo}</span>
                  )}
                </div>
              </div>

              {/* Current Location */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">বর্তমান অবস্থান (Current Location)</label>
                <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-900 px-3.5 py-3 rounded-xl">
                  <MapPin size={16} className="text-blue-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempDetails.currentLocation}
                      onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                      className="w-full bg-transparent text-sm text-white outline-none border-b border-blue-500/20 focus:border-blue-500 transition-colors cursor-text"
                      required
                    />
                  ) : (
                    <span className="text-sm font-semibold">{adminDetails.currentLocation}</span>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Core Personal Details Card Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 bg-slate-950/20 border border-slate-900/60 p-5 rounded-2xl">
            {/* User ID */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ইউজার আইডি (User ID)</label>
              <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-900 px-3.5 py-2.5 rounded-xl text-slate-400">
                <Shield size={14} />
                <span className="text-xs font-semibold font-mono">{adminDetails.userId}</span>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">জন্ম তারিখ (Date of Birth)</label>
              <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-900 px-3.5 py-2.5 rounded-xl text-slate-400">
                <Calendar size={14} />
                <span className="text-xs font-semibold">{adminDetails.dob}</span>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">লিঙ্গ (Gender)</label>
              <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-900 px-3.5 py-2.5 rounded-xl text-slate-400">
                <User size={14} />
                <span className="text-xs font-semibold">{adminDetails.gender}</span>
              </div>
            </div>
          </div>

          {/* Form Actions (Only visible when editing) */}
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex flex-col sm:flex-row justify-end gap-3"
            >
              <button
                type="button"
                onClick={handleEditToggle}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-cyan-500/10"
              >
                <Save size={14} />
                <span>তথ্য সংরক্ষণ করুন</span>
              </button>
            </motion.div>
          )}

        </form>

        {/* Security / Logs Footnote */}
        <div className="relative mt-8 pt-4 border-t border-slate-900/60 flex flex-wrap justify-between gap-4 text-[10px] text-slate-500 font-semibold tracking-wider z-10">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-cyan-500" />
            <span>শেষ অ্যাক্সেস লগইন: ২ জুলাই, ২০২৬ - সন্ধ্যা ০৭:১৪:৫৭</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={12} className="text-emerald-500" />
            <span>সিকিউরিটি লেভেল: স্তর ৩ (উচ্চতর অ্যাডমিন)</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default AdminProfile;
