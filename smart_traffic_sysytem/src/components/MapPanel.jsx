import React, { useState } from "react";
import { MapPin, Check, ChevronDown, Video, Eye, Map as MapIcon, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

const MapPanel = ({ emergencyMode }) => {
  const [viewMode, setViewMode] = useState("live"); // live, map
  const [selectedLoc, setSelectedLoc] = useState("ঢাকা সেক্টর ৮ - মিরপুর");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const locations = [
    "ঢাকা সেক্টর ৮ - মিরপুর",
    "উত্তরা সেক্টর ৩ - হাউস বিল্ডিং",
    "টঙ্গী ফায়ার স্টেশন মোড়",
    "যাত্রাবাড়ী চৌরাস্তা",
    "ফার্মগেট ওভারব্রিজ"
  ];

  const handleLocationChange = (loc) => {
    setSelectedLoc(loc);
    setDropdownOpen(false);
    toast.success(`লোকেশন পরিবর্তন করা হয়েছে: ${loc}`);
  };

  const handleNodeClick = (nodeName) => {
    toast.success(`${nodeName} লাইভ ক্যামেরা সংযোগ সফল।`);
  };

  return (
    <div className="w-full h-full relative rounded-3xl border border-blue-950/40 bg-slate-950/60 p-4 backdrop-blur-xl flex flex-col justify-between overflow-hidden">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {/* Top Controls Overlay */}
      <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        
        {/* Location Dropdown Selector */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-2.5 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl text-xs font-bold text-white transition-all duration-200 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:border-slate-700 w-full sm:w-auto"
          >
            <div className="flex items-center gap-2 text-blue-400">
              <MapPin size={14} />
              <span className="text-slate-500 font-medium">পছন্দের লোকেশন</span>
            </div>
            <span className="text-slate-200">{selectedLoc}</span>
            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-30">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocationChange(loc)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer text-left"
                >
                  <span>{loc}</span>
                  {selectedLoc === loc && <Check size={14} className="text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex bg-slate-900 border border-slate-800/80 p-1 rounded-2xl self-end sm:self-auto shadow-md">
          <button
            onClick={() => setViewMode("live")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              viewMode === "live" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye size={12} />
            <span>লাইভ ভিউ</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              viewMode === "map" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MapIcon size={12} />
            <span>মানচিত্র ভিউ</span>
          </button>
        </div>
      </div>

      {/* Interactive SVG Map Vector representation of Dhaka Grid */}
      <div className="relative flex-grow flex items-center justify-center min-h-[300px]">
        
        {/* Dynamic Warning Alert Overlay for Emergency Mode */}
        {emergencyMode && (
          <div className="absolute top-2 right-2 bg-red-950/60 border border-red-500/30 text-red-400 rounded-2xl py-2 px-4 flex items-center gap-2 z-20 animate-pulse text-xs font-bold pointer-events-none">
            <ShieldAlert size={14} className="animate-bounce" />
            <span>জরুরি নিয়ন্ত্রণ সক্রিয়</span>
          </div>
        )}

        <svg 
          viewBox="0 0 800 500" 
          className={`w-full h-full max-h-[450px] transition-all duration-500 ${viewMode === "live" ? "opacity-100" : "opacity-75 grayscale contrast-125"}`}
        >
          {/* SVG Dhaka Map Boundaries & Road grids */}
          {/* Main Highway lines */}
          <path d="M 100,50 L 700,50" stroke="#1e293b" strokeWidth="2" strokeDasharray="5,5" fill="none" />
          <path d="M 400,20 L 400,480" stroke="rgba(37, 99, 235, 0.15)" strokeWidth="4" fill="none" /> {/* Central Axis */}
          <path d="M 100,250 L 700,250" stroke="rgba(37, 99, 235, 0.15)" strokeWidth="4" fill="none" /> {/* Horiz Axis */}
          
          {/* Interconnecting local road networks */}
          <path d="M 250,50 C 350,150 250,350 400,350" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="2" fill="none" />
          <path d="M 400,50 C 450,180 600,100 550,250" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="2" fill="none" />
          <path d="M 150,150 L 650,400" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1.5" fill="none" />
          <path d="M 120,400 L 600,100" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1.5" fill="none" />
          <path d="M 400,250 C 250,200 200,450 400,450" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="2" fill="none" />
          <path d="M 400,250 C 550,300 650,250 680,450" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="2" fill="none" />

          {/* Dhaka Division Sectors & Regions Label names */}
          <text x="400" y="45" fill="rgba(148, 163, 184, 0.4)" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Tongi</text>
          <text x="430" y="100" fill="rgba(148, 163, 184, 0.4)" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Uttara</text>
          <text x="350" y="180" fill="rgba(148, 163, 184, 0.4)" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Mirpur</text>
          <text x="480" y="270" fill="rgba(148, 163, 184, 0.4)" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Gulshan</text>
          <text x="250" y="220" fill="rgba(148, 163, 184, 0.4)" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Mohammadpur</text>
          <text x="180" y="130" fill="rgba(148, 163, 184, 0.4)" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Savar</text>
          <text x="630" y="220" fill="rgba(148, 163, 184, 0.4)" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Badda</text>
          <text x="680" y="110" fill="rgba(148, 163, 184, 0.3)" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Purbachal</text>
          <text x="330" y="420" fill="rgba(148, 163, 184, 0.4)" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Keraniganj</text>
          <text x="590" y="440" fill="rgba(148, 163, 184, 0.4)" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Jatrabari</text>

          {/* Central Label "Dhaka" */}
          <text x="400" y="240" fill="rgba(255, 255, 255, 0.25)" fontSize="28" fontWeight="black" textAnchor="middle" letterSpacing="4" fontFamily="sans-serif">Dhaka</text>
          <text x="400" y="270" fill="rgba(255, 255, 255, 0.15)" fontSize="20" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">ঢাকা</text>

          {/* Map Node details: Traffic signal, camera, incident pins */}

          {/* Node 1: Green Traffic Light in Savar */}
          <g className="cursor-pointer group" onClick={() => handleNodeClick("সাভার সিগন্যাল")}>
            <circle cx="280" cy="110" r="14" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" />
            <circle cx="280" cy="110" r="7" fill="#10b981" className="animate-pulse" />
            {/* Traffic Light graphic overlay */}
            <path d="M280,106 L280,114 M277,110 L283,110" stroke="#047857" strokeWidth="1" />
          </g>

          {/* Node 2: Red Traffic Light in Tongi */}
          <g className="cursor-pointer group" onClick={() => handleNodeClick("টঙ্গী সিগন্যাল")}>
            <circle cx="400" cy="110" r="14" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1.5" />
            <circle cx="400" cy="110" r="7" fill={emergencyMode ? "#10b981" : "#ef4444"} className="animate-pulse" />
          </g>

          {/* Node 3: Camera Node in Mirpur */}
          <g className="cursor-pointer group" onClick={() => handleNodeClick("মিরপুর জংশন ক্যামেরা")}>
            <circle cx="530" cy="330" r="12" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />
            <circle cx="530" cy="330" r="6" fill="#3b82f6" />
            <rect x="526" y="327" width="8" height="6" fill="white" rx="1" />
            <polygon points="534,328 537,326 537,334 534,332" fill="white" />
          </g>

          {/* Node 4: Alert warning pin (Incident) */}
          <g className="cursor-pointer group" onClick={() => handleNodeClick("মোহাম্মদপুর সড়ক দুর্ঘটনা")}>
            <circle cx="340" cy="350" r="15" fill="rgba(239, 68, 68, 0.2)" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="1" className="animate-ping" />
            <path d="M340,340 L348,356 L332,356 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
            <text x="340" y="353" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">!</text>
          </g>

          {/* Node 5: Green Traffic Light in Jatrabari */}
          <g className="cursor-pointer group" onClick={() => handleNodeClick("যাত্রাবাড়ী সিগন্যাল")}>
            <circle cx="320" cy="495" r="14" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" />
            <circle cx="320" cy="495" r="7" fill="#10b981" />
          </g>

          {/* Node 6: Active Ambulance / Emergency Tracker moving */}
          <g className="cursor-pointer group" onClick={() => handleNodeClick("জরুরি ইউনিট ই-১০১")}>
            <circle cx="505" cy="295" r="16" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
            {/* Pulsing beacon circle */}
            <circle cx="505" cy="295" r="8" fill="#ef4444" className="animate-pulse" />
            {/* White cross symbol on beacon */}
            <path d="M505,291 L505,299 M501,295 L509,295" stroke="white" strokeWidth="2.5" />
          </g>

          {/* Node 7: Active Signal near Badda */}
          <g className="cursor-pointer group" onClick={() => handleNodeClick("বাড্ডা ওভারপাস")}>
            <circle cx="585" cy="265" r="14" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" />
            <circle cx="585" cy="265" r="7" fill={emergencyMode ? "#ef4444" : "#10b981"} />
          </g>
          
        </svg>

      </div>

      {/* Map Footer indicators */}
      <div className="relative z-10 border-t border-slate-900 pt-3 mt-3 flex items-center justify-between text-[10px] text-slate-500 font-semibold tracking-wider">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>সিগন্যাল সচল</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>জ্যাম / দুর্ঘটনা এলাকা</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span>ক্যামেরা পিন</span>
          </span>
        </div>
        <span>স্কেল: ১:১০,০০০</span>
      </div>

    </div>
  );
};

export default MapPanel;
