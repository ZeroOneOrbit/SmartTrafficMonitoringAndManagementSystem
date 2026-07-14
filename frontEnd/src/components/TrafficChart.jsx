import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const TrafficChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const chartData = [
    { label: "00:00", value: 3200, cx: 40, cy: 160 },
    { label: "04:00", value: 2500, cx: 120, cy: 170 },
    { label: "08:00", value: 12500, cx: 200, cy: 90 },
    { label: "12:00", value: 7800, cx: 280, cy: 125 },
    { label: "16:00", value: 11000, cx: 360, cy: 100 },
    { label: "20:00", value: 18500, cx: 440, cy: 50 },
    { label: "24:00", value: 4200, cx: 520, cy: 150 }
  ];

  const handleMouseEnter = (e, pt) => {
    const rect = e.target.getBoundingClientRect();
    const parentRect = e.target.offsetParent.getBoundingClientRect();
    setHoveredPoint(pt);
    setTooltipPos({
      x: rect.left - parentRect.left + 10,
      y: rect.top - parentRect.top - 40
    });
  };

  return (
    <div 
      onClick={() => setHoveredPoint(null)}
      className="w-full bg-slate-950/60 border border-blue-950/40 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden h-[300px] select-none"
    >
      
      {/* Header section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          ট্রাফিক প্রবাহ (গত ২৪ ঘণ্টা)
        </h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-[10px] font-bold text-slate-300 hover:border-slate-700 cursor-pointer transition-colors duration-200">
          <span>২৪ ঘণ্টা</span>
          <ChevronDown size={12} className="text-slate-500" />
        </button>
      </div>

      {/* SVG Plot container */}
      <div className="relative flex-grow w-full flex items-center justify-center">
        
        {/* Interactive Tooltip popup */}
        {hoveredPoint && (
          <div 
            className="absolute z-20 bg-slate-900 border border-blue-500/30 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold font-sans pointer-events-none shadow-xl flex flex-col gap-0.5"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <span className="text-blue-400 font-mono text-[9px]">{hoveredPoint.label}</span>
            <span>{hoveredPoint.value.toLocaleString()} টি যানবাহন</span>
          </div>
        )}

        <svg viewBox="0 0 560 200" className="w-full h-full">
          {/* Gradients definitions */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          <line x1="40" y1="50" x2="520" y2="50" stroke="rgba(148, 163, 184, 0.04)" strokeWidth="1" />
          <line x1="40" y1="88" x2="520" y2="88" stroke="rgba(148, 163, 184, 0.04)" strokeWidth="1" />
          <line x1="40" y1="125" x2="520" y2="125" stroke="rgba(148, 163, 184, 0.04)" strokeWidth="1" />
          <line x1="40" y1="162" x2="520" y2="162" stroke="rgba(148, 163, 184, 0.04)" strokeWidth="1" />
          
          {/* Y-Axis scale label text */}
          <text x="30" y="53" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">20K</text>
          <text x="30" y="91" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">15K</text>
          <text x="30" y="128" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">10K</text>
          <text x="30" y="165" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">5K</text>
          <text x="30" y="196" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">0</text>

          {/* Area under wave line filled with gradient */}
          <path 
            d="M 40,160 C 80,165 100,170 120,170 C 160,170 180,90 200,90 C 240,90 260,125 280,125 C 320,125 340,100 360,100 C 400,100 420,50 440,50 C 480,50 500,150 520,150 L 520,195 L 40,195 Z" 
            fill="url(#chartGradient)" 
          />

          {/* Smooth bezier path representing flow line */}
          <path 
            d="M 40,160 C 80,165 100,170 120,170 C 160,170 180,90 200,90 C 240,90 260,125 280,125 C 320,125 340,100 360,100 C 400,100 420,50 440,50 C 480,50 500,150 520,150" 
            stroke="#3b82f6" 
            strokeWidth="3.5" 
            fill="none" 
            strokeLinecap="round"
          />

          {/* Interactive Plot Nodes (Circles) */}
          {chartData.map((pt, index) => (
            <circle
              key={index}
              cx={pt.cx}
              cy={pt.cy}
              r={hoveredPoint && hoveredPoint.label === pt.label ? "6" : "4.5"}
              fill={hoveredPoint && hoveredPoint.label === pt.label ? "#3b82f6" : "#0f172a"}
              stroke={hoveredPoint && hoveredPoint.label === pt.label ? "#ffffff" : "#60a5fa"}
              strokeWidth="2.5"
              className="cursor-pointer transition-all duration-200 outline-none"
              onMouseEnter={(e) => handleMouseEnter(e, pt)}
              onMouseLeave={() => setHoveredPoint(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (hoveredPoint && hoveredPoint.label === pt.label) {
                  setHoveredPoint(null);
                } else {
                  handleMouseEnter(e, pt);
                }
              }}
            />
          ))}

          {/* X-Axis labels */}
          {chartData.map((pt, index) => (
            <text
              key={index}
              x={pt.cx}
              y="196"
              fill="rgba(148, 163, 184, 0.4)"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              {pt.label}
            </text>
          ))}

        </svg>

      </div>

    </div>
  );
};

export default TrafficChart;
