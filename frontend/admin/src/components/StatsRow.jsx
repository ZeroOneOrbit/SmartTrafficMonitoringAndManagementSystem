import React from "react";
import { Car, TrafficCone, ShieldAlert, AlertOctagon, Activity } from "lucide-react";

const StatsRow = () => {
  const stats = [
    {
      title: "মোট যানবাহন",
      value: "৪,৭৭১",
      change: "+৪.২%",
      timeframe: "গত ২৪ ঘণ্টায়",
      icon: Car,
      color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
      changeColor: "text-emerald-400"
    },
    {
      title: "সক্রিয় সিগন্যাল",
      value: "১৮",
      status: "সক্রিয়",
      total: "মোট ২৪",
      icon: TrafficCone,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      statusColor: "text-emerald-400"
    },
    {
      title: "জরুরি যানবাহন",
      value: "০৪",
      status: "চলমান",
      timeframe: "গত ২৪ ঘণ্টায়",
      icon: ShieldAlert,
      color: "text-red-400 border-red-500/20 bg-red-500/5",
      statusColor: "text-red-400 font-bold"
    },
    {
      title: "ঘটনা রিপোর্ট",
      value: "২৩",
      status: "রিপোর্ট",
      timeframe: "গত ২৪ ঘণ্টায়",
      icon: AlertOctagon,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
      statusColor: "text-amber-400"
    },
    {
      title: "ট্রাফিক ফ্লো",
      value: "১২,৮০০",
      change: "+৮.৫%",
      timeframe: "গড় যানবাহন",
      icon: Activity,
      color: "text-violet-400 border-violet-500/20 bg-violet-500/5",
      changeColor: "text-emerald-400"
    }
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div 
            key={idx}
            className="flex flex-col justify-between p-3 sm:p-4 bg-slate-950/60 border border-blue-950/40 rounded-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:border-slate-800"
          >
            {/* Upper Section */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
                {stat.title}
              </span>
              <div className={`p-1.5 rounded-lg border ${stat.color}`}>
                <Icon size={14} />
              </div>
            </div>

            {/* Value Section */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-black text-white font-sans tracking-wide">
                {stat.value}
              </span>
              {stat.change && (
                <span className={`text-[10px] font-bold ${stat.changeColor}`}>
                  {stat.change}
                </span>
              )}
              {stat.status && (
                <span className={`text-[10px] font-bold ${stat.statusColor}`}>
                  {stat.status}
                </span>
              )}
            </div>

            {/* Footer Section */}
            <div className="mt-2 text-[9px] text-slate-600 font-semibold tracking-wider">
              {stat.timeframe && <span>{stat.timeframe}</span>}
              {stat.total && <span>{stat.total}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsRow;
