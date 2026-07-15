import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Menu } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MapPanel from "../components/MapPanel";
import StatsRow from "../components/StatsRow";
import TrafficChart from "../components/TrafficChart";
import AIInsights from "../components/AIInsights";
import SystemLog from "../components/SystemLog";
import CameraFeeds from "../components/CameraFeeds";
import AdminProfile from "../components/adprofile";

const AdminDash = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full font-sans relative">
      {/* ── TOAST NOTIFICATIONS ─────────────────────────── */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* ── EMERGENCY BORDER OVERLAY ─────────────────────── */}
      {emergencyMode && (
        <div className="fixed inset-0 z-40 pointer-events-none border-[3px] border-red-500/70 animate-pulse" />
      )}

      {/* ── MOBILE SIDEBAR BACKDROP ──────────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── MOBILE SIDEBAR DRAWER ────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full p-3">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setMobileSidebarOpen(false);
            }}
            emergencyMode={emergencyMode}
            setEmergencyMode={setEmergencyMode}
          />
        </div>
      </aside>

      {/* ── ROOT FLEX CONTAINER ──────────────────────────── */}
      <div className="flex h-screen overflow-hidden">

        {/* ── DESKTOP SIDEBAR (always visible ≥ lg) ───────── */}
        <aside className="hidden lg:flex flex-col w-56 xl:w-60 shrink-0 p-3">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            emergencyMode={emergencyMode}
            setEmergencyMode={setEmergencyMode}
          />
        </aside>

        {/* ── MAIN SCROLLABLE CONTENT ──────────────────────── */}
        <main className="flex-1 flex flex-col overflow-y-auto min-w-0">

          {/* Sticky top padding for header */}
          <div className="px-3 pt-3 pb-0 top-0 z-20">
            {/* Mobile top bar with hamburger */}
            <div className="flex items-center gap-3 mb-3 lg:hidden">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Menu size={20} />
              </button>
              <span className="text-base font-bold text-white tracking-wide">
                স্মার্ট ট্রাফিক AI
              </span>
            </div>

            {/* Header Component */}
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} setActiveTab={setActiveTab} />
          </div>

          {/* ── PAGE BODY ─────────────────────────────────── */}
          <div className="flex-1 px-3 pb-3 pt-3 flex flex-col gap-3">
            {activeTab === "admin-profile" ? (
              <AdminProfile />
            ) : (
              /*
                LARGE SCREENS: 3-column CSS grid
                  Col 1-2 (left wide): Map + Stats + Chart+Log + Cameras
                  Col 3   (right):     AI Insights
              */
              <div className="flex flex-col xl:flex-row gap-3 flex-1">
                {/* ── LEFT / CENTRE COLUMN ─────────────────── */}
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                  {/* ROW 1: Map Panel (tall, flex-grow so it fills available space) */}
                  <div className="flex-1 min-h-[320px] max-h-[420px]">
                    <MapPanel emergencyMode={emergencyMode} />
                  </div>

                  {/* ROW 2: Stats widgets (5 cards) */}
                  <StatsRow />

                  {/* ROW 3: Traffic Chart (left 60%) + System Log (right 40%) */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-3">
                      <TrafficChart />
                    </div>
                    <div className="md:col-span-2">
                      <SystemLog searchTerm={searchTerm} />
                    </div>
                  </div>

                  {/* ROW 4: Camera Feeds strip */}
                  <CameraFeeds />
                </div>

                {/* ── RIGHT COLUMN: AI Insights ─────────────── */}
                <div className="w-full xl:w-72 2xl:w-80 shrink-0">
                  <AIInsights />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDash;
