import React, { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

const initialLogs = [
  { time: "12:42:30", category: "SIGNAL_12", text: "STATUS_CHANGED: OPTIMAL", type: "info" },
  { time: "12:42:18", category: "CAMERA_08", text: "MOTION_DETECTED", type: "warn" },
  { time: "12:42:10", category: "AI_MODEL", text: "TRAFFIC_PREDICTED", type: "info" },
  { time: "12:42:05", category: "ALERT_05", text: "CONGESTION_DETECTED", type: "error" },
  { time: "12:41:58", category: "SYSTEM", text: "DATA_SYNC_COMPLETE", type: "success" }
];

const poolLogs = [
  { category: "SIGNAL_04", text: "CYCLE_TRIGGERED: EAST_BOUND", type: "info" },
  { category: "CAMERA_11", text: "OBJECT_IDENTIFIED: AMBULANCE", type: "success" },
  { category: "AI_MODEL", text: "CONGESTION_RISK_EVALUATED: SECTOR_8", type: "warn" },
  { category: "ALERT_14", text: "SPEED_LIMIT_EXCEEDED: OP-104", type: "error" },
  { category: "SYSTEM", text: "BACKWARD_PROPAGATION_REFRESHED", type: "info" },
  { category: "SIGNAL_18", text: "MANUAL_OVERRIDE: DISMISSED", type: "success" }
];

const SystemLog = ({ searchTerm }) => {
  const [logs, setLogs] = useState(initialLogs);

  // Dynamically feed new system logs
  useEffect(() => {
    const logInterval = setInterval(() => {
      const date = new Date();
      const timeStr = date.toTimeString().split(" ")[0];
      const randomTemplate = poolLogs[Math.floor(Math.random() * poolLogs.length)];
      
      const newLog = {
        time: timeStr,
        ...randomTemplate
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 14)]); // Limit to 15 logs
    }, 5000);

    return () => clearInterval(logInterval);
  }, []);

  // Filter logs using header search input
  const filteredLogs = logs.filter((log) => {
    const rawString = `${log.time} ${log.category} ${log.text}`.toLowerCase();
    return rawString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full bg-slate-950/60 border border-blue-950/40 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden h-[240px]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
        <div className="flex items-center gap-2 text-blue-400">
          <Terminal size={16} className="animate-pulse" />
          <h3 className="text-xs font-bold tracking-widest uppercase">
            সিস্টেম লগ
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-blue-600/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
          <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">লাইভ</span>
        </div>
      </div>

      {/* Terminal log feed */}
      <div className="flex-grow overflow-y-auto space-y-2 pr-1 text-left font-mono text-[10px] leading-relaxed">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, idx) => {
            let textColor = "text-slate-400";
            if (log.type === "warn") textColor = "text-amber-400";
            if (log.type === "error") textColor = "text-red-400 font-semibold";
            if (log.type === "success") textColor = "text-emerald-400";
            if (log.type === "info") textColor = "text-blue-400";

            return (
              <div key={idx} className="flex gap-2 items-start border-b border-slate-900/40 pb-1 break-words">
                <span className="text-slate-600 font-sans">[{log.time}]</span>
                <span className="text-blue-500 font-bold uppercase select-none">{log.category}:</span>
                <span className={textColor}>{log.text}</span>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs">
            কোনো ম্যাচ পাওয়া যায়নি।
          </div>
        )}
      </div>

    </div>
  );
};

export default SystemLog;
