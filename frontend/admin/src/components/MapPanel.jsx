import React, { useState } from "react";
import { MapPin, Check, ChevronDown, Video, Eye, Map as MapIcon, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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


  const mapContainer = useRef(null)
  useEffect(()=>{
        const center = [90.4900, 23.6183];
         const map = new maplibregl.Map({
              container: mapContainer.current,
        
              // OpenFreeMap Dark Theme
              style: "https://tiles.openfreemap.org/styles/dark",
        
              center: center,
        
              zoom: 17,
            });

          map.on("load", ()=>{
            new maplibregl.Marker({
              color: "green"

            }).setLngLat(center).addTo(map)
          })
        return () => map.remove();
  },[])

 


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
        
      </div>

      {/* Interactive SVG Map Vector representation of Dhaka Grid */}
      <div
       ref={mapContainer}
      className="relative flex-grow flex items-center justify-center min-h-[300px] bg-white"
     
      >
        
        {/* Dynamic Warning Alert Overlay for Emergency Mode */}
      

        

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
