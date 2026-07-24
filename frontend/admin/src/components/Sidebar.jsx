import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  TrafficCone,
  Video,
  AlertTriangle,
  BarChart3,
  Users,
  Power,
  ShieldAlert,
  User,
} from "lucide-react";

import toast from "react-hot-toast";

const Sidebar = ({
  activeTab,
  setActiveTab,
  emergencyMode,
  setEmergencyMode,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [officerData, setOfficerData] = useState(null);

  // =========================
  // Get Officer Data
  // =========================
  useEffect(() => {
    const storedOfficer = sessionStorage.getItem("officer");

    if (storedOfficer) {
      try {
        const officer = JSON.parse(storedOfficer);
        setOfficerData(officer);
      } catch (error) {
        console.error("Invalid officer data in sessionStorage:", error);
      }
    }
  }, []);

  // =========================
  // Check Admin
  // =========================
  const isAdmin =
    officerData?.role?.toLowerCase() === "admin" ||
    officerData?.userType?.toLowerCase() === "admin";

  // =========================
  // Menu Items
  // =========================
  const menuItems = [
    {
      id: "dashboard",
      label: "ড্যাশবোর্ড",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      id: "cctv",
      label: "সিসিটিভি মনিটরিং",
      icon: Video,
      path: "/cctv",
    },
    {
      id: "signals",
      label: "অমীমাংসিত মামলা",
      icon: TrafficCone,
      path: "/violation",
    },
    {
      id: "incidents",
      label: "পর্যালোচিত মামলা",
      icon: AlertTriangle,
      path: "/cases",
    },
    {
      id: "challenges",
      label: "আপত্তিকৃত মামলা",
      icon: BarChart3,
      path: "#",
    },

    // Only admin can see this menu
    ...(isAdmin
      ? [
          {
            id: "users",
            label: "ব্যবহারকারী ব্যবস্থাপনা",
            icon: Users,
            path: "/manage",
          },
        ]
      : []),

    {
      id: "admin-profile",
      label: "আমার প্রোফাইল",
      icon: User,
      path: "/me",
    },
  ];

  // =========================
  // Active Menu Logic
  // =========================
  const getActiveMenu = () => {
    const currentItem = menuItems.find(
      (item) => item.path !== "#" && location.pathname === item.path
    );

    return currentItem?.id || activeTab;
  };

  const currentActiveTab = getActiveMenu();

  // =========================
  // Emergency Mode
  // =========================
  const handleEmergencyToggle = () => {
    const nextState = !emergencyMode;

    setEmergencyMode(nextState);

    if (nextState) {
      toast.error("সতর্কতা: জরুরি মোড সক্রিয় করা হয়েছে!", {
        duration: 5000,
        style: {
          background: "#7f1d1d",
          color: "#fecaca",
          border: "1px solid #f87171",
          fontWeight: "bold",
        },
      });
    } else {
      toast.success(
        "জরুরি মোড নিষ্ক্রিয় করা হয়েছে। স্বাভাবিক ট্রাফিক প্রোটোকল পুনঃস্থাপিত হয়েছে।",
        {
          style: {
            background: "#1e293b",
            color: "#34d399",
            border: "1px solid #059669",
          },
        }
      );
    }
  };

  // =========================
  // Navigation
  // =========================
  const handleNavigation = (item) => {
    // Don't navigate for unavailable pages
    if (item.path === "#") {
      toast("এই ফিচারটি বর্তমানে উপলব্ধ নয়।", {
        icon: "⚠️",
      });
      return;
    }

    setActiveTab(item.id);
    navigate(item.path);
  };

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();

    toast.success("সফলভাবে লগআউট করা হয়েছে।", {
      style: {
        background: "#1e293b",
        color: "#94a3b8",
      },
    });

    navigate("/");
  };

  return (
    <div className="w-full max-w-[280px] flex flex-col justify-between h-full bg-slate-950/70 border border-blue-950/40 p-4 rounded-3xl backdrop-blur-xl relative overflow-hidden">
      {/* Sidebar background neon glow */}
      <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-blue-500/10 blur-[50px] pointer-events-none" />

      {/* Brand Logo */}
      <div className="mb-6 flex flex-col">
        <div className="flex items-center gap-1 px-2 py-3 border-b border-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400">
            <TrafficCone size={22} className="animate-pulse" />
          </div>

          <div>
            <h1 className="text-base font-bold text-white tracking-wide">
              স্মার্ট ট্রাফিক AI
            </h1>

            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest block mt-1">
              SMART TRAFFIC AI
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-grow overflow-y-auto py-2 pr-1 space-y-1 min-h-0 scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;

          // Active based on current URL
          const isActive = currentActiveTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-blue-600/15 border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                  : "text-slate-400 border border-transparent hover:bg-slate-900/60 hover:text-white"
              }`}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-blue-400"
                    : "text-slate-500 group-hover:text-white"
                }
              />

              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="mt-6 pt-4 border-t border-slate-900 space-y-4">
        {/* Emergency Button */}
        <button
          onClick={handleEmergencyToggle}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
            emergencyMode
              ? "bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              : "border border-blue-500/20 bg-blue-600/5 hover:bg-blue-600/15 text-blue-400"
          }`}
        >
          <ShieldAlert
            size={16}
            className={emergencyMode ? "animate-spin" : ""}
          />

          <span>জরুরি মোড সক্রিয় করুন</span>
        </button>

        {/* System Uptime */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-[10px] text-slate-500 font-semibold tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>সিস্টেম আপটাইম</span>
          </span>

          <span className="text-emerald-400 font-bold">(৯৯.৯%)</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-red-500/10"
        >
          <Power size={14} />

          <span>লগআউট</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
