import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";

import {
  Car,
  MapPin,
  Clock,
  FileText,
  User,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Banknote,
} from "lucide-react";

const Cases = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [casesData, setCasesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH FINAL CASES
  // =========================================
const getCases = async () => {
  try {
    setLoading(true);

    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/violation/admin/vdata`
    );

    console.log("Final Cases Response:", response.data);

    const newData = response.data?.vFData || [];

    const getOfficer = JSON.parse(
      sessionStorage.getItem("officer")
    );

    if (!getOfficer) {
      toast.error("Officer information not found");
      setCasesData([]);
      return;
    }

    // Admin can see all final cases
    if (getOfficer.role === "admin") {
      setCasesData(newData);
    }

    // Normal officer can see only their zone cases
    else {
      const filterData = newData.filter(
        (caseItem) =>
          caseItem.location === getOfficer.zone
      );

      setCasesData(filterData);
    }

  } catch (error) {
    console.error("Error fetching cases:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to load cases"
    );
  } finally {
    setLoading(false);
  }
};

  // =========================================
  // INITIAL FETCH
  // =========================================
  useEffect(() => {
    getCases();
  }, []);

  // =========================================
  // FORMAT DATE
  // =========================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    const formattedDate = new Date(date);

    if (isNaN(formattedDate.getTime())) {
      return "Invalid Date";
    }

    return formattedDate.toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =========================================
  // FORMAT VIOLATION TYPE
  // =========================================
  const formatViolationType = (type) => {
    if (!type) return "Unknown";

    return type
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // =========================================
  // CASE STATUS STYLE
  // =========================================
  const getCaseStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "filed":
        return "bg-blue-500/10 text-blue-400";

      case "pending":
        return "bg-yellow-500/10 text-yellow-400";

      case "paid":
        return "bg-green-500/10 text-green-400";

      case "closed":
        return "bg-slate-500/10 text-slate-400";

      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  // =========================================
  // FINE STATUS STYLE
  // =========================================
  const getFineStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "text-green-400";

      case "pending":
        return "text-yellow-400";

      case "unpaid":
        return "text-red-400";

      default:
        return "text-slate-400";
    }
  };

  // =========================================
  // GET MONGODB ID
  // =========================================
  const getCaseId = (id) => {
    if (!id) return "N/A";

    if (typeof id === "object" && id.$oid) {
      return id.$oid;
    }

    return id;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* ========================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================= */}

      <aside
        className="
          fixed
          left-0
          top-0
          z-40
          hidden
          h-screen
          w-64
          lg:block
        "
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          emergencyMode={emergencyMode}
          setEmergencyMode={setEmergencyMode}
        />
      </aside>

      {/* ========================================= */}
      {/* MOBILE SIDEBAR */}
      {/* ========================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-full
          w-64
          transition-transform
          duration-300
          lg:hidden
          ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
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

      {/* ========================================= */}
      {/* MOBILE OVERLAY */}
      {/* ========================================= */}

      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* ========================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================= */}

      <main className="min-h-screen lg:ml-64">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <header
          className="
            sticky
            top-0
            z-30
            border-b
            border-slate-700
            bg-[#0f172a]/95
            backdrop-blur-md
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              px-4
              py-5
              sm:px-6
              lg:px-8
            "
          >

            <div>
              <h1 className="text-2xl font-bold text-white">
                Final Cases
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Review all finalized traffic violation cases
              </p>
            </div>

            <div
              className="
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-2
                text-center
              "
            >
              <p className="text-xs text-slate-400">
                Total Cases
              </p>

              <p className="text-xl font-bold text-blue-400">
                {casesData.length}
              </p>
            </div>

          </div>
        </header>

        {/* ========================================= */}
        {/* CONTENT */}
        {/* ========================================= */}

        <section className="p-4 sm:p-6 lg:p-8">

          {/* ========================================= */}
          {/* LOADING */}
          {/* ========================================= */}

          {loading && (
            <div className="flex min-h-[400px] items-center justify-center">

              <div className="flex flex-col items-center gap-3">

                <Loader2
                  size={40}
                  className="animate-spin text-blue-400"
                />

                <p className="text-slate-400">
                  Loading cases...
                </p>

              </div>

            </div>
          )}

          {/* ========================================= */}
          {/* EMPTY STATE */}
          {/* ========================================= */}

          {!loading && casesData.length === 0 && (
            <div
              className="
                flex
                min-h-[400px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-slate-700
                bg-slate-800/50
              "
            >
              <FileText
                size={60}
                className="mb-4 text-slate-500"
              />

              <h2 className="text-xl font-semibold text-slate-300">
                No Cases Found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                There are no finalized cases available.
              </p>
            </div>
          )}

          {/* ========================================= */}
          {/* CASE CARDS */}
          {/* ========================================= */}

          {!loading && casesData.length > 0 && (
            <div
              className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
            >

              {casesData.map((item, index) => (

                <div
                  key={getCaseId(item._id) || index}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-700
                    bg-slate-800/80
                    shadow-lg
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-blue-500/50
                    hover:shadow-blue-900/20
                  "
                >

                  {/* ========================================= */}
                  {/* CARD HEADER */}
                  {/* ========================================= */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-slate-700
                      bg-slate-900/60
                      px-5
                      py-4
                    "
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-red-500/10
                          text-red-400
                        "
                      >
                        <AlertTriangle size={23} />
                      </div>

                      <div className="min-w-0">

                        <p className="text-xs text-slate-400">
                          Case ID
                        </p>

                        <p className="max-w-[150px] truncate text-sm font-semibold text-white">
                          {getCaseId(item._id)}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        capitalize
                        ${getCaseStatusStyle(item.caseStatus)}
                      `}
                    >
                      {item.caseStatus || "N/A"}
                    </span>

                  </div>

                  {/* ========================================= */}
                  {/* CARD BODY */}
                  {/* ========================================= */}

                  <div className="space-y-4 p-5">

                    {/* VIOLATION TYPE */}

                    <div className="flex items-start gap-3">

                      <FileText
                        size={19}
                        className="mt-0.5 shrink-0 text-yellow-400"
                      />

                      <div>

                        <p className="text-xs text-slate-400">
                          Violation Type
                        </p>

                        <p className="font-semibold text-white">
                          {formatViolationType(
                            item.violationType
                          )}
                        </p>

                      </div>

                    </div>

                    {/* VEHICLE INFORMATION */}

                    <div className="flex items-start gap-3">

                      <Car
                        size={19}
                        className="mt-0.5 shrink-0 text-blue-400"
                      />

                      <div>

                        <p className="text-xs text-slate-400">
                          Vehicle Information
                        </p>

                        <p className="font-semibold capitalize text-white">
                          {item.carType || "N/A"}
                        </p>

                        <p className="text-sm text-slate-400">
                          Vehicle No:{" "}
                          <span className="text-slate-200">
                            {item.vehicleNumber || "N/A"}
                          </span>
                        </p>

                        <p className="text-sm text-slate-400">
                          License No:{" "}
                          <span className="text-slate-200">
                            {item.licenseNumber || "N/A"}
                          </span>
                        </p>

                      </div>

                    </div>

                    {/* LOCATION */}

                    <div className="flex items-start gap-3">

                      <MapPin
                        size={19}
                        className="mt-0.5 shrink-0 text-red-400"
                      />

                      <div>

                        <p className="text-xs text-slate-400">
                          Location
                        </p>

                        <p className="font-medium text-white">
                          {item.location || "N/A"}
                        </p>

                      </div>

                    </div>

                    {/* VIOLATION TIME */}

                    <div className="flex items-start gap-3">

                      <Clock
                        size={19}
                        className="mt-0.5 shrink-0 text-purple-400"
                      />

                      <div>

                        <p className="text-xs text-slate-400">
                          Violation Time
                        </p>

                        <p className="text-sm text-white">
                          {formatDate(item.time)}
                        </p>

                      </div>

                    </div>

                    {/* FINE INFORMATION */}

                    <div className="flex items-start gap-3">

                      <Banknote
                        size={19}
                        className="mt-0.5 shrink-0 text-orange-400"
                      />

                      <div>

                        <p className="text-xs text-slate-400">
                          Fine Information
                        </p>

                        <p
                          className={`
                            font-semibold
                            capitalize
                            ${getFineStatusStyle(
                              item.fine?.status
                            )}
                          `}
                        >
                          Status:{" "}
                          {item.fine?.status || "N/A"}
                        </p>

                        <p className="text-sm text-slate-300">
                          Fee:{" "}
                          <span className="font-semibold text-orange-400">
                            ৳ {item.fine?.fee || "0"}
                          </span>
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ========================================= */}
                  {/* OFFICER INFORMATION */}
                  {/* ========================================= */}

                  <div
                    className="
                      border-t
                      border-slate-700
                      bg-slate-900/40
                      px-5
                      py-4
                    "
                  >

                    <div className="mb-3 flex items-center gap-2">

                      <User
                        size={18}
                        className="text-cyan-400"
                      />

                      <p className="font-semibold text-slate-200">
                        Officer Information
                      </p>

                    </div>

                    <div className="space-y-1 text-sm">

                      <p className="text-slate-400">
                        Name:{" "}
                        <span className="text-white">
                          {item.officerRef?.name || "N/A"}
                        </span>
                      </p>

                      <p className="text-slate-400">
                        Rank:{" "}
                        <span className="capitalize text-white">
                          {item.officerRef?.rank || "N/A"}
                        </span>
                      </p>

                      <p className="text-slate-400">
                        Area:{" "}
                        <span className="text-white">
                          {item.officerRef?.area || "N/A"}
                        </span>
                      </p>

                    </div>

                  </div>

                  {/* ========================================= */}
                  {/* EVIDENCE */}
                  {/* ========================================= */}

                  {item.evedience?.driveURI && (

                    <div className="border-t border-slate-700 p-5">

                      <a
                        href={item.evedience.driveURI}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-blue-600
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-white
                          transition
                          hover:bg-blue-500
                        "
                      >
                        <ExternalLink size={17} />

                        View Evidence

                      </a>

                    </div>

                  )}

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
};

export default Cases;