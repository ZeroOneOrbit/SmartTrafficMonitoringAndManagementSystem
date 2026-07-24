import React, { useState, useEffect } from "react";
import { Video, Shield, Lock, Eye, EyeOff, Radio, RefreshCw, BarChart2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

const CameraViewer = ({ selectedCameraName }) => {
  const [activeCam, setActiveCam] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [flowCount, setFlowCount] = useState(48);
  const [avgSpeed, setAvgSpeed] = useState(32);
  const [isBuffering, setIsBuffering] = useState(false);

  // List of cameras with public access settings
  const cameras = [
    { id: "cam-10", name: "Mirpur-10 Roundabout", zone: "Zone A", status: "online", flow: "high", publicAccess: true, resolution: "1080p" },
    { id: "cam-03", name: "Uttara House Building", zone: "Zone A", status: "online", flow: "medium", publicAccess: true, resolution: "1080p" },
    { id: "cam-fg", name: "Farmgate Overpass", zone: "Zone B", status: "online", flow: "high", publicAccess: true, resolution: "720p" },
    { id: "cam-jb", name: "Jatrabari Crossing", zone: "Zone D", status: "online", flow: "high", publicAccess: true, resolution: "1080p" },
    { id: "cam-gs", name: "Gulshan-2 Circle", zone: "Zone C", status: "online", flow: "low", publicAccess: true, resolution: "1080p" },
    { id: "cam-mh", name: "Mohakhali Flyover", zone: "Zone C", status: "online", flow: "medium", publicAccess: true, resolution: "1080p" },
    { id: "cam-sec1", name: "Parliament House Area", zone: "Zone B", status: "secure", flow: "medium", publicAccess: false, resolution: "4K" },
    { id: "cam-sec2", name: "Dhaka Cantonment Gate", zone: "Zone A", status: "secure", flow: "low", publicAccess: false, resolution: "4K" }
  ];

  // Set selected camera from map click if applicable
  useEffect(() => {
    if (selectedCameraName) {
      const match = cameras.find(c => c.name === selectedCameraName);
      if (match) {
        handleCameraSelect(match);
      }
    }
  }, [selectedCameraName]);

  // Set default active camera
  useEffect(() => {
    if (!activeCam) {
      setActiveCam(cameras[0]);
    }
  }, []);

  // Simulate traffic data updates
  useEffect(() => {
    if (!activeCam || !isPlaying || isBuffering) return;

    const interval = setInterval(() => {
      setFlowCount(prev => Math.max(10, Math.min(120, prev + Math.floor(Math.random() * 9) - 4)));
      setAvgSpeed(prev => Math.max(15, Math.min(80, prev + Math.floor(Math.random() * 7) - 3)));
    }, 2000);

    return () => clearInterval(interval);
  }, [activeCam, isPlaying, isBuffering]);

  const handleCameraSelect = (cam) => {
    if (!cam.publicAccess) {
      toast.error(`নিরাপত্তা সতর্কতা: ${cam.name} অ্যাক্সেস সংরক্ষিত! এটি পাবলিকলি অ্যাক্সেসযোগ্য নয়।`, {
        icon: "🔒",
        style: {
          background: "#1f2937",
          color: "#f87171",
          border: "1px solid rgba(248,113,113,0.2)"
        }
      });
      return;
    }

    setIsBuffering(true);
    setActiveCam(cam);
    
    // Simulate loading/buffering delay
    setTimeout(() => {
      setIsBuffering(false);
      setFlowCount(cam.flow === "high" ? 85 : cam.flow === "medium" ? 50 : 20);
      setAvgSpeed(cam.flow === "high" ? 22 : cam.flow === "medium" ? 45 : 62);
      toast.success(`${cam.name} ফিড লোড সম্পন্ন।`);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
      
      {/* LEFT: Feed List Panel (Span 4) */}
      <div className="lg:col-span-4 bg-slate-950/40 border border-slate-900 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between max-h-[500px] overflow-y-auto">
        <div>
          <h3 className="text-sm font-black text-cyan-400 mb-1 flex items-center gap-2">
            <Video size={16} /> ক্যামেরা তালিকা
          </h3>
          <p className="text-[10px] text-slate-500 font-semibold mb-4 leading-snug">
            নিরাপত্তা নির্দেশিকা মেনে পাবলিক এবং ভিআইপি ক্যামেরা তালিকাভুক্ত করা হয়েছে।
          </p>

          <div className="space-y-2">
            {cameras.map((cam) => {
              const isActive = activeCam && activeCam.id === cam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => handleCameraSelect(cam)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-blue-600/10 border-blue-500/50 text-white"
                      : "bg-slate-900/35 border-slate-900/50 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 ${
                      cam.publicAccess 
                        ? (isActive ? "bg-blue-600/20 border-blue-500 text-blue-400" : "bg-slate-950 border-slate-800 text-slate-500")
                        : "bg-red-950/20 border-red-500/20 text-red-500"
                    }`}>
                      {cam.publicAccess ? <Radio size={14} className={isActive ? "animate-pulse" : ""} /> : <Lock size={14} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate">{cam.name}</span>
                      <span className="text-[9px] text-slate-500 mt-0.5">{cam.zone} · {cam.resolution}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {cam.publicAccess ? (
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        cam.flow === "high" 
                          ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                          : cam.flow === "medium"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {cam.flow === "high" ? "তীব্র জ্যাম" : cam.flow === "medium" ? "মধ্যম" : "স্বাভাবিক"}
                      </span>
                    ) : (
                      <span className="text-[8px] bg-red-950/40 border border-red-900/40 text-red-400 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">
                        সংরক্ষিত
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Security Warning notice */}
        <div className="mt-4 pt-4 border-t border-slate-900/60 flex items-start gap-2.5 bg-slate-900/15 p-3 rounded-2xl">
          <ShieldAlert size={14} className="text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-[9px] text-slate-500 leading-normal">
            ব্যক্তিগত বা স্পর্শকাতর সরকারি ক্যামেরাগুলোর ফুটেজ গোপনীয়তা রক্ষার্থে নাগরিক পোর্টালে প্রকাশ করা হয় না।
          </p>
        </div>
      </div>

      {/* RIGHT: Live Video Stream simulator (Span 8) */}
      <div className="lg:col-span-8 bg-slate-950/40 border border-slate-900 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between h-full min-h-[400px]">
        {activeCam && activeCam.publicAccess ? (
          <div className="flex-grow flex flex-col justify-between gap-4">
            
            {/* Header info */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-900">
              <div>
                <h4 className="text-xs font-black text-white">{activeCam.name}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">লোকেশন কোড: {activeCam.id.toUpperCase()} · জোন: {activeCam.zone}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCameraSelect(activeCam)}
                  className="p-2 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} className={isBuffering ? "animate-spin" : ""} />
                </button>
                <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-500/20 px-3 py-1 rounded-xl text-[9px] font-extrabold text-red-400 tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>LIVE FEED</span>
                </div>
              </div>
            </div>

            {/* Video Player Display Container */}
            <div className="relative flex-grow min-h-[250px] bg-black rounded-2xl border border-slate-900 overflow-hidden flex items-center justify-center">
              
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

              {/* Static scanline animation */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none" />
              <div className="absolute w-full h-[2px] bg-cyan-500/25 top-0 left-0 animate-scanline" style={{ animation: "scanline 6s linear infinite" }} />

              {isBuffering ? (
                <div className="flex flex-col items-center gap-2 text-cyan-400">
                  <RefreshCw size={24} className="animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest font-mono">Connecting Feed...</span>
                </div>
              ) : (
                <>
                  {/* Moving Cars Simulation using CSS */}
                  {isPlaying && (
                    <div className="absolute inset-0 flex flex-col justify-around py-10 pointer-events-none overflow-hidden select-none opacity-40">
                      <div className="h-4 bg-slate-900/20 border-y border-slate-800/40 w-full relative">
                        <div className="absolute top-1/2 -translate-y-1/2 text-cyan-400 font-mono text-[9px] font-bold animate-move-car" style={{ animationDuration: "12s" }}>
                          🚙 SPEED: 38km/h [T-028]
                        </div>
                      </div>
                      <div className="h-4 bg-slate-900/20 border-y border-slate-800/40 w-full relative">
                        <div className="absolute top-1/2 -translate-y-1/2 text-yellow-400 font-mono text-[9px] font-bold animate-move-car" style={{ animationDuration: "8s", animationDelay: "1s" }}>
                          🚗 SPEED: 45km/h [T-904]
                        </div>
                      </div>
                      <div className="h-4 bg-slate-900/20 border-y border-slate-800/40 w-full relative">
                        <div className="absolute top-1/2 -translate-y-1/2 text-emerald-400 font-mono text-[9px] font-bold animate-move-car" style={{ animationDuration: "18s", animationDelay: "3s" }}>
                          🚌 SPEED: 22km/h [T-151]
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Corner overlays */}
                  <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded border border-slate-800/50 font-mono text-[8px] text-slate-400 tracking-wider">
                    CAM_IDX: {activeCam.id.toUpperCase()}<br/>
                    GPS: 23.8103N, 90.3996E
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded border border-slate-800/50 font-mono text-[8px] text-slate-400 tracking-wider text-right">
                    AUTO_TRACKING: ON<br/>
                    FPS: 30.00
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded border border-slate-800/50 font-mono text-[8px] text-emerald-400 tracking-wider">
                    STATUS: SECURE FEED
                  </div>

                  {/* Center Crosshair graphic */}
                  <div className="h-10 w-10 border border-cyan-500/20 rounded-full flex items-center justify-center pointer-events-none">
                    <div className="h-1 w-1 bg-cyan-500 rounded-full"></div>
                  </div>
                </>
              )}
            </div>

            {/* Live stream stats data dashboard */}
            <div className="grid grid-cols-3 gap-3 bg-slate-900/40 border border-slate-900 p-4 rounded-2xl">
              <div>
                <span className="text-[9px] text-slate-500 font-bold block mb-0.5">গাড়ি চলাচল সূচক</span>
                <span className="text-base font-extrabold text-cyan-400 font-mono">{flowCount} <span className="text-[10px] text-slate-500 font-semibold font-sans">গাড়ি/মি.</span></span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold block mb-0.5">গড় গতিবেগ</span>
                <span className="text-base font-extrabold text-blue-400 font-mono">{avgSpeed} <span className="text-[10px] text-slate-500 font-semibold font-sans">কিমি/ঘণ্টা</span></span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold block mb-0.5">জ্যামের ঘনত্ব সূচক</span>
                <span className={`text-xs font-black uppercase tracking-wider block mt-1 ${
                  flowCount > 80 
                    ? "text-red-400" 
                    : flowCount > 40
                    ? "text-yellow-400"
                    : "text-emerald-400"
                }`}>
                  {flowCount > 80 ? "তীব্র জ্যাম" : flowCount > 40 ? "মাঝারি" : "খুবই স্বাভাবিক"}
                </span>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <div className="h-16 w-16 bg-red-950/20 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
              <Shield size={32} />
            </div>
            <h4 className="text-base font-black text-white">অ্যাক্সেস সুরক্ষিত / সংরক্ষিত</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
              আপনার নির্বাচিত ক্যামেরাটি স্পর্শকাতর প্রশাসনিক জোনে অবস্থিত। নিরাপত্তা নির্দেশিকা অনুযায়ী জনসাধারণের জন্য এর ফুটেজ উন্মুক্ত নয়।
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default CameraViewer;
