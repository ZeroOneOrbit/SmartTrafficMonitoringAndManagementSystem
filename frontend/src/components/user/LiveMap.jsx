import React, { useEffect, useRef, useState } from "react";
import { MapPin, ShieldAlert, Video, RefreshCw, Layers, Search, Navigation } from "lucide-react";
import toast from "react-hot-toast";

// Standard ES Import for MapLibre GL
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const LiveMap = ({ onSelectCamera, onSelectIncident }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [trafficDensity, setTrafficDensity] = useState("মাঝারি"); // High, Medium, Low
  const [activeLayer, setActiveLayer] = useState("traffic"); // traffic, signals, cameras

  // Mock Dhaka traffic data points
  const [trafficPoints, setTrafficPoints] = useState([
    { id: 1, name: "Mirpur-10 Roundabout", lat: 23.8069, lng: 90.3687, status: "heavy", type: "intersection", signal: "Red", countdown: 45 },
    { id: 2, name: "Uttara House Building", lat: 23.8729, lng: 90.3996, status: "moderate", type: "camera", signal: "Green", countdown: 12 },
    { id: 3, name: "Farmgate Overpass", lat: 23.7561, lng: 90.3872, status: "heavy", type: "camera", signal: "Red", countdown: 30 },
    { id: 4, name: "Jatrabari Crossing", lat: 23.7104, lng: 90.4349, status: "critical", type: "accident", desc: "মালবাহী ট্রাক বিকল" },
    { id: 5, name: "Gulshan-2 Intersection", lat: 23.7925, lng: 90.4162, status: "light", type: "intersection", signal: "Green", countdown: 25 },
    { id: 6, name: "Mohakhali Flyover", lat: 23.7776, lng: 90.4005, status: "moderate", type: "camera", signal: "Green", countdown: 5 }
  ]);

  useEffect(() => {
    const initMap = async () => {
      try {
        if (!mapContainer.current) return;

        // Initialize MapLibre Map
        const map = new maplibregl.Map({
          container: mapContainer.current,
          style: {
            version: 8,
            sources: {
              "osm-tiles": {
                type: "raster",
                tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
                attribution: "© OpenStreetMap contributors"
              }
            },
            layers: [
              {
                id: "osm-layer",
                type: "raster",
                source: "osm-tiles",
                minzoom: 0,
                maxzoom: 19
              }
            ]
          },
          center: [90.3996, 23.8103], // Centered in Dhaka
          zoom: 12,
          maxZoom: 17,
          minZoom: 10
        });

        // Add standard navigation controls
        map.addControl(new maplibregl.NavigationControl(), "top-right");

        map.on("load", () => {
          mapRef.current = map;
          setMapLoaded(true);
          
          // Render Markers onto the Map
          trafficPoints.forEach((point) => {
            // Create container element
            const el = document.createElement("div");
            el.className = "map-marker-container";
            
            // Choose color based on status
            let color = "#10b981"; // Light/Green
            if (point.status === "heavy") color = "#f97316"; // Orange
            if (point.status === "critical") color = "#ef4444"; // Red
            if (point.status === "moderate") color = "#eab308"; // Yellow

            // Setup marker HTML based on type
            let iconMarkup = "";
            if (point.type === "accident") {
              iconMarkup = `<div class="w-8 h-8 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center animate-ping absolute"></div>
                            <div class="relative w-8 h-8 rounded-full bg-red-600 border border-red-950 flex items-center justify-center text-white font-bold text-xs shadow-lg">⚠️</div>`;
            } else if (point.type === "camera") {
              iconMarkup = `<div class="relative w-7 h-7 rounded-full bg-blue-600 border-2 border-slate-950 flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                            </div>`;
            } else {
              // Traffic signal
              iconMarkup = `<div class="relative w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-950 flex flex-col items-center justify-center text-white shadow-lg">
                              <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${point.signal === "Green" ? "#10b981" : "#ef4444"}"></span>
                              <span class="text-[7px] font-bold text-slate-400 leading-none mt-0.5">${point.countdown}</span>
                            </div>`;
            }

            el.innerHTML = iconMarkup;

            // Create Popups
            const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 font-sans min-w-[150px]">
                <h4 class="text-xs font-black text-white mb-1">${point.name}</h4>
                <div class="flex items-center gap-1.5 mt-1 text-[10px]">
                  <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${color}"></span>
                  <span class="text-slate-400 capitalize font-bold">অবস্থা: ${point.status === "heavy" ? "তীব্র জ্যাম" : point.status === "critical" ? "দুর্ঘটনা / অবরুদ্ধ" : point.status === "moderate" ? "ধীর গতি" : "স্বাভাবিক"}</span>
                </div>
                ${point.desc ? `<p class="text-[9px] text-red-400 mt-1 font-semibold">${point.desc}</p>` : ""}
                ${point.signal ? `<p class="text-[9px] text-slate-500 mt-1 font-medium">সিগন্যাল: <span class="font-bold" style="color: ${point.signal === "Green" ? "#10b981" : "#ef4444"}">${point.signal} (${point.countdown}s)</span></p>` : ""}
                <button id="marker-btn-${point.id}" class="mt-2 w-full py-1 text-[9px] font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer text-center">বিস্তারিত দেখুন</button>
              </div>
            `);

            // Attach marker
            new maplibregl.Marker({ element: el })
              .setLngLat([point.lng, point.lat])
              .setPopup(popup)
              .addTo(map);

            // Setup button click event in popup
            popup.on("open", () => {
              const btn = document.getElementById(`marker-btn-${point.id}`);
              if (btn) {
                btn.addEventListener("click", () => {
                  if (point.type === "camera") {
                    onSelectCamera(point.name);
                  } else if (point.type === "accident") {
                    onSelectIncident(point);
                  } else {
                    toast.success(`${point.name}: ট্রাফিক লেভেল বর্তমানে ${point.status}`);
                  }
                });
              }
            });
          });
        });

      } catch (err) {
        console.error("MapLibre GL failed to initialize:", err);
        setMapError(true);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [onSelectCamera, onSelectIncident]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // Simple filter search
    const found = trafficPoints.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      toast.success(`লোকেশন পাওয়া গেছে: ${found.name}`);
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [found.lng, found.lat],
          zoom: 14,
          essential: true
        });
      }
    } else {
      toast.error("লোকেশন পাওয়া যায়নি। মিরপুর বা উত্তরা চেষ্টা করুন।");
    }
  };

  return (
    <div className="w-full h-full relative rounded-3xl border border-slate-900 bg-slate-950/60 p-4 backdrop-blur-xl flex flex-col justify-between overflow-hidden">
      
      {/* Background scanlines & overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />
      
      {/* Map Control Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-1.5 w-full md:w-80 focus-within:border-blue-500/50 transition-colors">
          <Search size={14} className="text-slate-500 shrink-0 mr-2" />
          <input
            type="text"
            placeholder="রাস্তা বা এলাকা অনুসন্ধান করুন (যেমন: Mirpur)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-650"
          />
        </form>

        {/* Legend buttons */}
        <div className="flex gap-2 bg-slate-900/60 p-1 border border-slate-800 rounded-2xl overflow-x-auto self-start md:self-auto max-w-full">
          <button
            onClick={() => setActiveLayer("traffic")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeLayer === "traffic" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers size={10} />
            <span>জ্যাম ডেনসিটি</span>
          </button>
          <button
            onClick={() => setActiveLayer("signals")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeLayer === "signals" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Navigation size={10} />
            <span>সিগন্যাল ও ইন্টারসেকশন</span>
          </button>
        </div>
      </div>

      {/* Map Container Area */}
      <div className="relative flex-grow rounded-2xl border border-slate-900 overflow-hidden min-h-[350px] bg-slate-950">
        
        {/* CSS Dark-Mode Map Filter overlay applied to the maplibre canvas container */}
        <div 
          ref={mapContainer} 
          className="w-full h-full"
          style={{
            filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)",
            display: mapError ? "none" : "block"
          }}
        />

        {/* Fallback interactive SVG Dhaka Grid Map if MapLibre fails or is loading */}
        {(mapError || !mapLoaded) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/90 text-center">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:25px_25px] opacity-20 pointer-events-none" />

            <div className="relative z-10 w-full max-w-2xl h-full flex flex-col justify-between p-4">
              <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-left">
                <div>
                  <h4 className="text-xs font-bold text-white">রিয়েল-টাইম ট্রাফিক নেটওয়ার্ক গ্রিড</h4>
                  <p className="text-[10px] text-slate-500">ডিজিটাল ভেক্টর ঢাকা নেটওয়ার্ক রিপ্রেজেন্টেশন</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 px-3 py-1 rounded-lg text-[9px] font-bold animate-pulse">
                  লাইভ আপডেট সক্রিয়
                </div>
              </div>

              {/* Vector Grid representation */}
              <div className="flex-grow flex items-center justify-center">
                <svg viewBox="0 0 600 350" className="w-full max-h-[280px]">
                  {/* Grid Lines/Roads */}
                  <line x1="50" y1="50" x2="550" y2="50" stroke="#1e293b" strokeWidth="2" strokeDasharray="4,4" />
                  <line x1="50" y1="175" x2="550" y2="175" stroke="rgba(37,99,235,0.2)" strokeWidth="3" />
                  <line x1="50" y1="300" x2="550" y2="300" stroke="#1e293b" strokeWidth="2" />
                  <line x1="300" y1="20" x2="300" y2="330" stroke="rgba(37,99,235,0.2)" strokeWidth="3" />
                  <path d="M 120,50 Q 200,120 120,300" stroke="rgba(148,163,184,0.15)" strokeWidth="2" fill="none" />
                  <path d="M 480,50 Q 400,120 480,300" stroke="rgba(148,163,184,0.15)" strokeWidth="2" fill="none" />

                  {/* Labels */}
                  <text x="300" y="40" fill="rgba(148,163,184,0.4)" fontSize="11" fontWeight="bold" textAnchor="middle">টঙ্গী / উত্তরা</text>
                  <text x="150" y="160" fill="rgba(148,163,184,0.4)" fontSize="11" fontWeight="bold" textAnchor="middle">মিরপুর</text>
                  <text x="450" y="160" fill="rgba(148,163,184,0.4)" fontSize="11" fontWeight="bold" textAnchor="middle">গুলশান / বাড্ডা</text>
                  <text x="300" y="290" fill="rgba(148,163,184,0.4)" fontSize="11" fontWeight="bold" textAnchor="middle">মতিঝিল / যাত্রাবাড়ী</text>

                  {/* Intersections/Nodes */}
                  {trafficPoints.map((pt, idx) => {
                    // Position calculations
                    let x = 300;
                    let y = 175;
                    if (pt.name.includes("Mirpur")) { x = 180; y = 120; }
                    if (pt.name.includes("Uttara")) { x = 300; y = 75; }
                    if (pt.name.includes("Farmgate")) { x = 300; y = 200; }
                    if (pt.name.includes("Jatrabari")) { x = 380; y = 280; }
                    if (pt.name.includes("Gulshan")) { x = 440; y = 110; }
                    if (pt.name.includes("Mohakhali")) { x = 360; y = 160; }

                    let color = "#10b981";
                    if (pt.status === "heavy") color = "#f97316";
                    if (pt.status === "critical") color = "#ef4444";
                    if (pt.status === "moderate") color = "#eab308";

                    return (
                      <g 
                        key={pt.id} 
                        className="cursor-pointer group"
                        onClick={() => {
                          if (pt.type === "camera") {
                            onSelectCamera(pt.name);
                          } else if (pt.type === "accident") {
                            onSelectIncident(pt);
                          } else {
                            toast.success(`${pt.name}: ট্রাফিক লেভেল বর্তমানে ${pt.status}`);
                          }
                        }}
                      >
                        <circle cx={x} cy={y} r="12" fill={`${color}1a`} stroke={`${color}50`} strokeWidth="1" className="group-hover:scale-110 transition-transform" />
                        <circle cx={x} cy={y} r="5" fill={color} className={pt.status === "critical" ? "animate-pulse" : ""} />
                        <text x={x} y={y - 12} fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-1 py-0.5 rounded">
                          {pt.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Bottom stats indicators */}
              <div className="border-t border-slate-900/60 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> সচল</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> ধীর গতি</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> তীব্র জ্যাম</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> অবরুদ্ধ</span>
                </div>
                <span className="font-mono text-slate-600">ভেক্টর ইঞ্জিন v2.1</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Control Footer */}
      <div className="relative z-10 border-t border-slate-900 pt-3 mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 font-semibold">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-400" /> ঢাকা শহর গ্রিড</span>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-700"></span>
          <span>সর্বশেষ আপডেট: ১ মিনিট পূর্বে</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-extrabold">LIVE SYNC</span>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
