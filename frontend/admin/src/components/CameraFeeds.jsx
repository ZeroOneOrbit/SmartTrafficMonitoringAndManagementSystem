import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const cameras = [
  { id: "০১", name: "ক্যামেরা ০১", location: "মিরপুর-১০", color: "#22d3ee" },
  { id: "০২", name: "ক্যামেরা ০২", location: "ফার্মগেট", color: "#4ade80" },
  { id: "০৩", name: "ক্যামেরা ০৩", location: "যাত্রাবাড়ী", color: "#fb923c" },
  { id: "০৪", name: "ক্যামেরা ০৪", location: "মতিঝিল", color: "#a78bfa" },
];

// Canvas-animated "camera feed" simulation
const CameraCanvas = ({ color }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let frame = 0;
    const cars = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: 30 + Math.random() * (canvas.height - 60),
      speed: 0.5 + Math.random() * 1.5,
      width: 18 + Math.random() * 10,
      height: 9 + Math.random() * 4,
      lane: i % 3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark road background
      ctx.fillStyle = "#0a0f1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road lanes
      const laneH = canvas.height / 3;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i % 2 === 0 ? "rgba(15,23,42,0.8)" : "rgba(10,15,30,0.6)";
        ctx.fillRect(0, i * laneH, canvas.width, laneH);
      }

      // Dashed lane markings
      ctx.setLineDash([12, 8]);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * laneH);
        ctx.lineTo(canvas.width, i * laneH);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Cars (rectangles)
      cars.forEach((car) => {
        car.x += car.speed;
        if (car.x > canvas.width + car.width) car.x = -car.width;

        // Car body
        ctx.fillStyle = color + "bb";
        ctx.beginPath();
        ctx.roundRect(car.x, car.lane * laneH + laneH / 2 - car.height / 2, car.width, car.height, 3);
        ctx.fill();

        // Headlight glow
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = "white";
        ctx.fillRect(car.x + car.width - 2, car.lane * laneH + laneH / 2 - 2, 2, 4);
        ctx.shadowBlur = 0;
      });

      // Scanline overlay
      if (frame % 3 === 0) {
        const scanY = (frame * 2) % canvas.height;
        const grad = ctx.createLinearGradient(0, scanY, 0, scanY + 4);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.5, "rgba(255,255,255,0.03)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY, canvas.width, 4);
      }

      // Timestamp overlay
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "bold 8px monospace";
      ctx.fillText(new Date().toLocaleTimeString(), 4, 11);

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={180}
      className="w-full h-full rounded-xl block"
    />
  );
};

const CameraFeeds = () => {
  const [activeCamera, setActiveCamera] = useState(null);

  return (
    <>
      {/* Camera Thumbnail Grid */}
      <div className="w-full bg-slate-950/60 border border-blue-950/40 rounded-3xl p-4 backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-slate-900 pb-3">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            লাইভ ক্যামেরা ফিড
          </span>
          <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer tracking-wide">
            সব দেখুন
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cameras.map((cam) => (
            <button
              key={cam.id}
              onClick={() => setActiveCamera(cam)}
              className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 hover:border-blue-500/40 transition-all duration-200 cursor-pointer aspect-video flex flex-col"
            >
              {/* Mini animated road preview */}
              <div className="flex-grow relative overflow-hidden rounded-t-xl">
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                  <div className="w-full h-full relative overflow-hidden">
                    {/* Static preview lines */}
                    <div className="absolute inset-0 bg-[#0a0f1a]" />
                    <div
                      className="absolute top-1/3 left-0 right-0 h-[1px] opacity-20"
                      style={{ background: cam.color }}
                    />
                    <div
                      className="absolute top-2/3 left-0 right-0 h-[1px] opacity-20"
                      style={{ background: cam.color }}
                    />
                    {/* Moving car dots simulation */}
                    <div
                      className="absolute top-[28%] rounded-sm animate-move-car"
                      style={{
                        width: "18%",
                        height: "10%",
                        background: cam.color + "99",
                        left: "10%",
                        animationDuration: `${2 + parseInt(cam.id.replace(/[^\d]/g, "")) * 0.4}s`,
                      }}
                    />
                    <div
                      className="absolute top-[58%] rounded-sm animate-move-car"
                      style={{
                        width: "14%",
                        height: "9%",
                        background: cam.color + "66",
                        left: "55%",
                        animationDuration: `${1.5 + parseInt(cam.id.replace(/[^\d]/g, "")) * 0.3}s`,
                      }}
                    />
                  </div>
                </div>
                {/* LIVE badge */}
                <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-red-600/80 rounded px-1 py-0.5 z-10">
                  <span className="h-1 w-1 rounded-full bg-white animate-ping" />
                  <span className="text-[7px] text-white font-bold">LIVE</span>
                </div>
              </div>

              {/* Label */}
              <div className="py-1 px-2 text-[9px] font-bold text-slate-400 group-hover:text-white transition-colors text-left">
                {cam.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Full-screen Camera Modal */}
      {activeCamera && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveCamera(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-950 border border-blue-900/50 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-900">
              <div>
                <h3 className="text-sm font-bold text-white">{activeCamera.name}</h3>
                <p className="text-[10px] text-slate-500 font-semibold">{activeCamera.location} — লাইভ স্ট্রিম সক্রিয়</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-red-600/20 border border-red-500/30 px-2.5 py-1 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest">লাইভ</span>
                </div>
                <button
                  onClick={() => setActiveCamera(null)}
                  className="p-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Canvas Stream */}
            <div className="p-3 bg-black">
              <CameraCanvas color={activeCamera.color} />
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-900 border-t border-slate-900">
              {[
                { label: "রেজোলিউশন", value: "1080p" },
                { label: "ফ্রেম রেট", value: "30 FPS" },
                { label: "বিটরেট", value: "4.2 Mbps" },
                { label: "সংকেত", value: "শক্তিশালী" }
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center py-2.5 px-2">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                  <span className="text-xs text-white font-bold mt-0.5">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CameraFeeds;
