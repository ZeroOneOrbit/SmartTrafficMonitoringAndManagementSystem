import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { 
  Map, Video, ShieldAlert, Sparkles, MessageSquare, AlertCircle, 
  Activity, Radio, ShieldCheck, Heart 
} from "lucide-react";
import Navbar from "../navbar";
import Footer from "../footer";

import LiveMap from "./LiveMap";
import CameraViewer from "./CameraViewer";
import TrafficInfo from "./TrafficInfo";
import TrafficAssistant from "./TrafficAssistant";
import ReportSystem from "./ReportSystem";

const UserPortal = () => {
  const [activeTab, setActiveTab] = useState("map"); // map, cameras, alerts, assistant, complaints
  const [selectedCameraName, setSelectedCameraName] = useState(null);

  const handleSelectCameraFromMap = (camName) => {
    setSelectedCameraName(camName);
    setActiveTab("cameras");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col justify-between">
      
      {/* ── TOAST NOTIFICATIONS ─────────────────────────── */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* ── NAVIGATION NAVBAR ───────────────────────────── */}
      <Navbar />

      {/* Glow Backdrops */}
      <div className="absolute top-24 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-24 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none z-0" />

      {/* ── MAIN CONTENT CONTAINER ─────────────────────── */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-12 z-10 space-y-6">
        
        {/* Portal Header Overview Grid */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-5 md:p-6 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <div className="flex justify-center md:justify-start items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest leading-none">লাইভ ড্যাশবোর্ড</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
              স্মার্ট নাগরিক ট্রাফিক পোর্টাল
            </h1>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed max-w-lg">
              ঢাকা শহরের রিয়েল-টাইম ট্রাফিক কন্ট্রোল রুমের ডেটা, ক্যামেরা ভিউ এবং AI সহযোগীর মাধ্যমে আপনার যাতায়াত করুন সহজ ও নিরাপদ।
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto md:min-w-[400px]">
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-3 text-center">
              <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">নিরাপত্তা সূচক</span>
              <div className="flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span className="text-sm font-black text-white font-mono">৯৬%</span>
              </div>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-3 text-center">
              <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">সচল ক্যামেরা</span>
              <div className="flex items-center justify-center gap-1">
                <Radio size={12} className="text-blue-400 animate-pulse" />
                <span className="text-sm font-black text-white font-mono">১২ / ১৫</span>
              </div>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-3 text-center">
              <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">অ্যাক্টিভ এলার্ট</span>
              <div className="flex items-center justify-center gap-1">
                <Activity size={12} className="text-red-400" />
                <span className="text-sm font-black text-white font-mono">০৩</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Switcher */}
        <div className="flex border border-slate-900 bg-slate-950/40 p-1.5 rounded-3xl overflow-x-auto max-w-full gap-1 backdrop-blur-xl">
          {[
            { id: "map", label: "লাইভ ম্যাপ", icon: Map },
            { id: "cameras", label: "পাবলিক ক্যামেরা", icon: Video },
            { id: "alerts", label: "ট্রাফিক আপডেট", icon: ShieldAlert },
            { id: "assistant", label: "এআই সহকারী", icon: Sparkles },
            { id: "complaints", label: "অভিযোগ ও রিপোর্ট", icon: AlertCircle }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "cameras") {
                    setSelectedCameraName(null);
                  }
                }}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all duration-300 cursor-pointer whitespace-nowrap flex-1 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                }`}
              >
                <IconComp size={14} className={isActive ? "text-white" : "text-slate-500"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Area */}
        <div className="min-h-[450px]">
          {activeTab === "map" && (
            <LiveMap 
              onSelectCamera={handleSelectCameraFromMap} 
              onSelectIncident={() => setActiveTab("alerts")} 
            />
          )}

          {activeTab === "cameras" && (
            <CameraViewer selectedCameraName={selectedCameraName} />
          )}

          {activeTab === "alerts" && (
            <TrafficInfo />
          )}

          {activeTab === "assistant" && (
            <TrafficAssistant />
          )}

          {activeTab === "complaints" && (
            <ReportSystem />
          )}
        </div>

      </main>

      {/* ── FOOTER SECTION ─────────────────────────────── */}
      <Footer />
    </div>
  );
};

export default UserPortal;
