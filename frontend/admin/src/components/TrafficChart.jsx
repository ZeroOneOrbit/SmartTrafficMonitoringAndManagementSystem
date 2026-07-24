import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

const TrafficChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [totalVehicle, setTotalVehicle] = useState(0);

  // 1. Core Data: Real-world hourly distribution curve of city traffic 
  // Reflects late-night drops, morning rush (8 AM), midday steady flow, and evening gridlock (8 PM).
  const trafficDistribution = [
    { label: "00:00", percentage: 0.035, cx: 40 },
    { label: "04:00", percentage: 0.015, cx: 120 },
    { label: "08:00", percentage: 0.185, cx: 200 }, // Morning rush hour
    { label: "12:00", percentage: 0.130, cx: 280 }, // Mid-day business travel
    { label: "16:00", percentage: 0.175, cx: 360 }, // Early school/office exit
    { label: "20:00", percentage: 0.380, cx: 440 }, // Peak evening congestion
    { label: "24:00", percentage: 0.080, cx: 520 }, // Tapering off
  ];

  useEffect(() => {
    // Reads from localStorage and syncs state
    const updateVehicleCount = () => {
      const storedTotal = Number(localStorage.getItem("totalVehicle")) || 0;
      setTotalVehicle(storedTotal);
    };

    // 2. Midnight Reset Scheduler
    const scheduleMidnightReset = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0); // Sets time target to exactly 12:00 AM next day

      const msUntilMidnight = midnight.getTime() - now.getTime();

      return setTimeout(() => {
        // Clear local storage and reset state
        localStorage.setItem("totalVehicle", "0");
        setTotalVehicle(0);
        
        // Setup the loop for the subsequent days
        scheduleMidnightReset();
      }, msUntilMidnight);
    };

    // Initial state sync
    updateVehicleCount();

    // Check for standard increments every 1 second
    const interval = setInterval(updateVehicleCount, 1000);
    
    // Start the midnight reset schedule
    const midnightTimeout = scheduleMidnightReset();

    return () => {
      clearInterval(interval);
      clearTimeout(midnightTimeout);
    };
  }, []);

  // Compute exact values based on real-world weight distribution
  const chartData = useMemo(() => {
    return trafficDistribution.map((item) => ({
      ...item,
      value: Math.round(totalVehicle * item.percentage),
    }));
  }, [totalVehicle]);

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

  const getYPosition = (value) => {
    const chartTop = 50;
    const chartBottom = 170;
    const chartHeight = chartBottom - chartTop;
    return chartBottom - (value / maxValue) * chartHeight;
  };

  // Generate smooth cubic bezier curves
  const linePath = chartData
    .map((point, index) => {
      const x = point.cx;
      const y = getYPosition(point.value);
      if (index === 0) return `M ${x},${y}`;

      const previousPoint = chartData[index - 1];
      const previousY = getYPosition(previousPoint.value);
      const middleX = previousPoint.cx + (point.cx - previousPoint.cx) / 2;

      return `C ${middleX},${previousY} ${middleX},${y} ${x},${y}`;
    })
    .join(" ");

  const areaPath = `
    ${linePath}
    L 520,170
    L 40,170
    Z
  `;

  const handleMouseEnter = (event, point) => {
    const circle = event.currentTarget;
    const circleRect = circle.getBoundingClientRect();
    const svgRect = circle.ownerSVGElement.getBoundingClientRect();

    setHoveredPoint(point);
    setTooltipPos({
      x: circleRect.left - svgRect.left + 10,
      y: circleRect.top - svgRect.top - 40,
    });
  };

  return (
    <div
      onClick={() => setHoveredPoint(null)}
      className="w-full bg-slate-950/60 border border-blue-950/40 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden h-[350px] select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            ট্রাফিক প্রবাহ (গত ২৪ ঘণ্টা)
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            মোট যানবাহন:{" "}
            <span className="text-blue-400 font-bold">
              {totalVehicle.toLocaleString()}
            </span>
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-[10px] font-bold text-slate-300 hover:border-slate-700 cursor-pointer transition-colors">
          <span>২৪ ঘণ্টা</span>
          <ChevronDown size={12} className="text-slate-500" />
        </button>
      </div>

      {/* Chart Container */}
      <div className="relative flex-grow w-full flex items-center justify-center">
        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-20 bg-slate-900 border border-blue-500/30 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold pointer-events-none shadow-xl flex flex-col gap-0.5"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}
          >
            <span className="text-blue-400 font-mono text-[9px]">
              {hoveredPoint.label}
            </span>
            <span>{hoveredPoint.value.toLocaleString()}টি যানবাহন</span>
          </div>
        )}

        {/* SVG Chart */}
        <svg viewBox="0 0 560 200" className="w-full h-full">
          <defs>
            <linearGradient id="trafficChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[50, 80, 110, 140, 170].map((y) => (
            <line
              key={y}
              x1="40"
              y1={y}
              x2="520"
              y2={y}
              stroke="rgba(148, 163, 184, 0.04)"
            />
          ))}

          {/* Y-Axis Labels */}
          <text x="30" y="53" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="bold" textAnchor="end">
            {maxValue.toLocaleString()}
          </text>
          <text x="30" y="83" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="bold" textAnchor="end">
            {Math.round(maxValue * 0.75).toLocaleString()}
          </text>
          <text x="30" y="113" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="bold" textAnchor="end">
            {Math.round(maxValue * 0.5).toLocaleString()}
          </text>
          <text x="30" y="143" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="bold" textAnchor="end">
            {Math.round(maxValue * 0.25).toLocaleString()}
          </text>
          <text x="30" y="173" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="bold" textAnchor="end">
            0
          </text>

          {/* Area */}
          <path d={areaPath} fill="url(#trafficChartGradient)" />

          {/* Line */}
          <path
            d={linePath}
            stroke="#3b82f6"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {chartData.map((point) => {
            const y = getYPosition(point.value);
            const isHovered = hoveredPoint?.label === point.label;

            return (
              <circle
                key={point.label}
                cx={point.cx}
                cy={y}
                r={isHovered ? 6 : 4.5}
                fill={isHovered ? "#3b82f6" : "#0f172a"}
                stroke={isHovered ? "#ffffff" : "#60a5fa"}
                strokeWidth="2.5"
                className="cursor-pointer"
                onMouseEnter={(event) => handleMouseEnter(event, point)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  if (isHovered) {
                    setHoveredPoint(null);
                  } else {
                    handleMouseEnter(event, point);
                  }
                }}
              />
            );
          })}

          {/* X-Axis Labels */}
          {chartData.map((point) => (
            <text
              key={point.label}
              x={point.cx}
              y="196"
              fill="rgba(148, 163, 184, 0.4)"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default TrafficChart;
