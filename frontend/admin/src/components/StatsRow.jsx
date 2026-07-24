import React, { useEffect, useState } from "react";

import {
  Car,
  FileWarning,
  FileCheck,
  FileX,
} from "lucide-react";

import axios from "axios";
import toast from "react-hot-toast";

const StatsRow = () => {
  // =========================
  // Get Total Vehicles
  // =========================
  const getTotalVehicle = () => {
    const value = localStorage.getItem(
      "totalVehicle"
    );

    return Number(value) || 0;
  };

  // =========================
  // Get Violations Length
  // =========================
  const getViolationLength = () => {
    const storedViolations =
      localStorage.getItem("violations");

    if (!storedViolations) {
      return 0;
    }

    try {
      const violations =
        JSON.parse(storedViolations);

      return Array.isArray(violations)
        ? violations.length
        : 0;
    } catch (error) {
      console.error(
        "Error parsing violations:",
        error
      );

      return 0;
    }
  };

  // =========================
  // States
  // =========================
  const [total, setTotal] = useState(() => {
    return getTotalVehicle();
  });

  const [unfcase, setUnfcase] = useState(() => {
    return getViolationLength();
  });

  const [casesLength, setCasesLength] =
    useState(0);

  // =========================
  // Update LocalStorage Stats
  // =========================
  useEffect(() => {
    const updateStats = () => {
      setTotal(getTotalVehicle());
      setUnfcase(getViolationLength());
    };

    // Initial update
    updateStats();

    // Update when localStorage changes
    window.addEventListener(
      "storage",
      updateStats
    );

    // Update total vehicles
    window.addEventListener(
      "totalVehicleUpdated",
      updateStats
    );

    // Update violations
    window.addEventListener(
      "violationsUpdated",
      updateStats
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "storage",
        updateStats
      );

      window.removeEventListener(
        "totalVehicleUpdated",
        updateStats
      );

      window.removeEventListener(
        "violationsUpdated",
        updateStats
      );
    };
  }, []);

  // =========================
  // Fetch Reviewed Cases
  // Every 5 Seconds
  // =========================
  useEffect(() => {
    const getCases = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/violation/admin/vdata`
        );

        console.log(
          "Final Cases Response:",
          response.data
        );

        const newData =
          response.data?.vFData || [];

        const officerData =
          sessionStorage.getItem(
            "officer"
          );

        if (!officerData) {
          toast.error(
            "Officer information not found"
          );

          setCasesLength(0);

          return;
        }

        const getOfficer =
          JSON.parse(officerData);

        let filteredCases = [];

        // Admin sees all cases
        if (
          getOfficer.role === "admin"
        ) {
          filteredCases = newData;
        }

        // Officer sees only zone cases
        else {
          filteredCases =
            newData.filter(
              (caseItem) =>
                caseItem.location ===
                getOfficer.zone
            );
        }

        setCasesLength(
          filteredCases.length
        );

        console.log(
          "Total Final Cases:",
          filteredCases.length
        );

      } catch (error) {
        console.error(
          "Error fetching cases:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load reviewed cases"
        );

        setCasesLength(0);
      }
    };

    // Fetch immediately
    getCases();

    // Fetch every 5 seconds
    const interval = setInterval(
      getCases,
      5000
    );

    // Cleanup interval
    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================
  // Stats
  // =========================
  const stats = [
    {
      title: "মোট যানবাহন",
      value: total,
      status: "গত ২৪ ঘণ্টায়",
      icon: Car,
      color:
        "text-blue-400 border-blue-500/20 bg-blue-500/5",
      statusColor:
        "text-slate-600",
    },

    {
      title: "অমীমাংসিত মামলা",
      value: unfcase,
      status:
        "পর্যালোচনার অপেক্ষায়",
      icon: FileWarning,
      color:
        "text-amber-400 border-amber-500/20 bg-amber-500/5",
      statusColor:
        "text-amber-400",
    },

    {
      title: "পর্যালোচিত মামলা",
      value: casesLength,
      status:
        "পর্যালোচনা সম্পন্ন",
      icon: FileCheck,
      color:
        "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      statusColor:
        "text-emerald-400",
    },

    {
      title: "আপত্তিকৃত মামলা",
      value: 0,
      status:
        "আপত্তি দাখিল হয়েছে",
      icon: FileX,
      color:
        "text-red-400 border-red-500/20 bg-red-500/5",
      statusColor:
        "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;

        return (
          <div
            key={idx}
            className="
              flex
              flex-col
              justify-between
              p-3
              sm:p-4
              bg-slate-950/60
              border
              border-blue-950/40
              rounded-2xl
              backdrop-blur-xl
              relative
              overflow-hidden
              transition-all
              duration-300
              hover:border-slate-800
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
                {stat.title}
              </span>

              <div
                className={`
                  p-1.5
                  rounded-lg
                  border
                  ${stat.color}
                `}
              >
                <Icon size={14} />
              </div>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-black text-white font-sans tracking-wide">
                {stat.value}
              </span>
            </div>

            {/* Status */}
            <div className="mt-2">
              <span
                className={`text-[9px] font-semibold tracking-wider ${stat.statusColor}`}
              >
                {stat.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsRow;