import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  User,
  Shield,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  Edit3,
  Save,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";

import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // =========================
  // Officer Details
  // =========================
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    userId: "",
    specialId: "",
    department: "ট্রাফিক অপারেশনস ও এআই কন্ট্রোল",
    area: "",
    careerRole: "",
    email: "",
    contactNo: "",
    zone: "",
    currentLocation: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [tempDetails, setTempDetails] = useState({
    name: "",
    email: "",
    contactNo: "",
  });

  // =========================
  // Get Officer Data
  // =========================
  useEffect(() => {
    const officerData = sessionStorage.getItem("officer");

    if (!officerData) {
      toast.error("অফিসার তথ্য পাওয়া যায়নি");
      return;
    }

    try {
      const officer = JSON.parse(officerData);

      const formattedOfficer = {
        name: officer.name || "",

        userId: officer.specialId
          ? `OFF-${officer.specialId}`
          : "",

        specialId: officer.specialId || "",

        department: "ট্রাফিক অপারেশনস ও এআই কন্ট্রোল",

        area: officer.zone || "",

        careerRole: officer.role || "",

        email: officer.email || "",

        contactNo: officer.phone || "",

        zone: officer.zone || "",

        currentLocation: officer.zone || "",
      };

      setAdminDetails(formattedOfficer);

      setTempDetails({
        name: formattedOfficer.name,
        email: formattedOfficer.email,
        contactNo: formattedOfficer.contactNo,
      });
    } catch (error) {
      console.error("Officer data parsing error:", error);

      toast.error("অফিসার তথ্য লোড করা যায়নি");
    }
  }, []);

  // =========================
  // Edit Toggle
  // =========================
  const handleEditToggle = () => {
    if (!isEditing) {
      setTempDetails({
        name: adminDetails.name,
        email: adminDetails.email,
        contactNo: adminDetails.contactNo,
      });

      setIsEditing(true);
    } else {
      setTempDetails({
        name: adminDetails.name,
        email: adminDetails.email,
        contactNo: adminDetails.contactNo,
      });

      setIsEditing(false);
    }
  };

  // =========================
  // Input Change
  // =========================
  const handleInputChange = (field, value) => {
    setTempDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================
  // Save Profile
  // =========================
  const handleSave = async (e) => {
  e.preventDefault();

  try {
    // Get officer data from sessionStorage
    const officerData = sessionStorage.getItem("officer");

    if (!officerData) {
      toast.error("অফিসার তথ্য পাওয়া যায়নি");
      return;
    }

    const officer = JSON.parse(officerData);

    // Get specialId
    const specialId = officer.specialId;

    if (!specialId) {
      toast.error("Special ID পাওয়া যায়নি");
      return;
    }

    // Send update request
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_API}/officer/me`,

      // Only editable fields
      {
        name: tempDetails.name,
        email: tempDetails.email,
        phone: tempDetails.contactNo,
      },

      // Send specialId through header
      {
        headers: {
          "x-special-id": specialId,
        },
      }
    );

    // If update successful
    if (response.status === 200) {

      // Update the profile UI
      setAdminDetails((prev) => ({
        ...prev,
        name: tempDetails.name,
        email: tempDetails.email,
        contactNo: tempDetails.contactNo,
      }));

      // Update sessionStorage
      const updatedOfficer = {
        ...officer,
        name: tempDetails.name,
        email: tempDetails.email,
        phone: tempDetails.contactNo,
      };

      sessionStorage.setItem(
        "officer",
        JSON.stringify(updatedOfficer)
      );

      // Show success toast
      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");

      // Automatically close edit/update UI
      setIsEditing(false);
    }

  } catch (error) {
    console.error(
      "Profile update error:",
      error
    );

    toast.error(
      error.response?.data?.message ||
      "প্রোফাইল আপডেট করা যায়নি"
    );
  }
};

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">

      {/* ========================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================= */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 lg:block">
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ========================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================= */}

      <main className="lg:ml-64 min-h-screen p-4 md:p-8">

        {/* Glow Effects */}
        <div className="pointer-events-none absolute right-10 top-10 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px]" />

        <div className="pointer-events-none absolute bottom-10 left-10 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px]" />

        {/* ========================================= */}
        {/* MAIN PROFILE CARD */}
        {/* ========================================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto max-w-[1300px] overflow-hidden rounded-3xl border border-blue-950/60 bg-slate-950/40 p-6 shadow-2xl backdrop-blur-xl md:p-8"
        >

          {/* Grid Background */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

          {/* Scanline */}
          <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40" />

          {/* ========================================= */}
          {/* PROFILE HEADER */}
          {/* ========================================= */}

          <div className="relative z-10 flex flex-col items-center justify-between gap-6 border-b border-slate-900 pb-6 md:flex-row md:items-start">

            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">

              {/* Avatar */}
              <div className="relative">

                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 opacity-60 blur-md" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-cyan-400 bg-slate-950 text-cyan-400 shadow-xl md:h-28 md:w-28">
                  <User size={56} className="text-blue-400" />
                </div>

                <span className="absolute bottom-1.5 right-1.5 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                  <span className="relative inline-flex h-4 w-4 rounded-full border border-slate-900 bg-emerald-500" />
                </span>

              </div>

              {/* Name & Role */}
              <div>

                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">

                  <h1 className="text-2xl font-extrabold tracking-wide text-white md:text-3xl">
                    {adminDetails.name || "Loading..."}
                  </h1>

                  <span className="flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-600/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                    <Shield size={10} />
                    অফিসার
                  </span>

                </div>

                <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-400 md:justify-start">
                  <Briefcase size={14} className="text-slate-500" />

                  {adminDetails.careerRole || "Traffic Officer"}
                </p>

                <p className="mt-1 flex items-center justify-center gap-1 font-mono text-xs font-semibold text-blue-400/80 md:justify-start">
                  আইডি: {adminDetails.userId}
                </p>

              </div>

            </div>

            {/* Edit Button */}
            <button
              onClick={handleEditToggle}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-lg transition-all ${
                isEditing
                  ? "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              {isEditing ? (
                <>
                  <X size={14} />
                  <span>বাতিল করুন</span>
                </>
              ) : (
                <>
                  <Edit3 size={14} />
                  <span>সম্পাদনা করুন</span>
                </>
              )}
            </button>

          </div>

          {/* ========================================= */}
          {/* PROFILE FORM */}
          {/* ========================================= */}

          <form
            onSubmit={handleSave}
            className="relative z-10 mt-8"
          >

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* ========================================= */}
              {/* PROFESSIONAL INFORMATION */}
              {/* ========================================= */}

              <div className="space-y-5 rounded-2xl border border-slate-900/60 bg-slate-950/20 p-5">

                <h3 className="flex items-center gap-2 border-b border-slate-900 pb-2 text-sm font-bold uppercase tracking-wide text-cyan-400">
                  <Building size={14} />
                  প্রাতিষ্ঠানিক তথ্য
                </h3>

                {/* Department - Read Only */}
                <ProfileField
                  label="বিভাগ (Department)"
                  icon={<Building size={16} />}
                  value={adminDetails.department}
                  displayValue={adminDetails.department}
                  field="department"
                  isEditing={false}
                  onChange={() => {}}
                />

                {/* Role - Read Only */}
                <ProfileField
                  label="ক্যারিয়ার রোল (Career Role)"
                  icon={<Briefcase size={16} />}
                  value={adminDetails.careerRole}
                  displayValue={adminDetails.careerRole}
                  field="careerRole"
                  isEditing={false}
                  onChange={() => {}}
                />

                {/* Zone - Read Only */}
                <ProfileField
                  label="জোন / থানা (Zone)"
                  icon={<MapPin size={16} />}
                  value={adminDetails.zone}
                  displayValue={adminDetails.zone}
                  field="zone"
                  isEditing={false}
                  onChange={() => {}}
                />

              </div>

              {/* ========================================= */}
              {/* PERSONAL INFORMATION */}
              {/* ========================================= */}

              <div className="space-y-5 rounded-2xl border border-slate-900/60 bg-slate-950/20 p-5">

                <h3 className="flex items-center gap-2 border-b border-slate-900 pb-2 text-sm font-bold uppercase tracking-wide text-cyan-400">
                  <User size={14} />
                  ব্যক্তিগত ও যোগাযোগ
                </h3>

                {/* Name - Editable */}
                <ProfileField
                  label="নাম (Name)"
                  icon={<User size={16} />}
                  value={tempDetails.name}
                  displayValue={adminDetails.name}
                  field="name"
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />

                {/* Email - Editable */}
                <ProfileField
                  label="ইমেইল (Email Address)"
                  icon={<Mail size={16} />}
                  value={tempDetails.email}
                  displayValue={adminDetails.email}
                  field="email"
                  type="email"
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />

                {/* Phone - Editable */}
                <ProfileField
                  label="মোবাইল নম্বর (Contact No)"
                  icon={<Phone size={16} />}
                  value={tempDetails.contactNo}
                  displayValue={adminDetails.contactNo}
                  field="contactNo"
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />

                {/* Current Location - Read Only */}
                <ProfileField
                  label="বর্তমান অবস্থান"
                  icon={<MapPin size={16} />}
                  value={adminDetails.currentLocation}
                  displayValue={adminDetails.currentLocation}
                  field="currentLocation"
                  isEditing={false}
                  onChange={() => {}}
                />

              </div>

            </div>

            {/* ========================================= */}
            {/* USER ID & SPECIAL INFORMATION */}
            {/* ========================================= */}

            <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-900/60 bg-slate-950/20 p-5 md:grid-cols-2">

              {/* User ID */}
              <div>

                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  ইউজার আইডি
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-slate-900 bg-slate-950/40 px-3.5 py-2.5 text-slate-400">

                  <Shield size={14} />

                  <span className="font-mono text-xs font-semibold">
                    {adminDetails.userId}
                  </span>

                </div>

              </div>

              {/* Zone */}
              <div>

                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  অপারেশন জোন
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-slate-900 bg-slate-950/40 px-3.5 py-2.5 text-slate-400">

                  <MapPin size={14} />

                  <span className="font-mono text-xs font-semibold">
                    {adminDetails.zone}
                  </span>

                </div>

              </div>

            </div>

            {/* ========================================= */}
            {/* FORM ACTIONS */}
            {/* ========================================= */}

            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex flex-col justify-end gap-3 sm:flex-row"
              >

                {/* Cancel */}
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-5 py-3 text-xs font-bold text-slate-400 transition-colors hover:text-white sm:w-auto"
                >
                  বাতিল
                </button>

                {/* Save */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-cyan-600 px-6 py-3 text-xs font-bold text-white shadow-lg transition-colors hover:bg-cyan-500 sm:w-auto"
                >
                  <Save size={14} />
                  <span>তথ্য সংরক্ষণ করুন</span>
                </button>

              </motion.div>
            )}

          </form>

          {/* ========================================= */}
          {/* FOOTER */}
          {/* ========================================= */}

          <div className="relative z-10 mt-8 flex flex-wrap justify-between gap-4 border-t border-slate-900/60 pt-4 text-[10px] font-semibold tracking-wider text-slate-500">

            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-cyan-500" />

              <span>
                শেষ অ্যাক্সেস: সিস্টেম লগইন সেশন সক্রিয়
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <CheckCircle size={12} className="text-emerald-500" />

              <span>
                সিকিউরিটি লেভেল: ট্রাফিক অফিসার
              </span>
            </div>

          </div>

        </motion.div>

      </main>

    </div>
  );
};


// =========================================
// Reusable Profile Field Component
// =========================================

const ProfileField = ({
  label,
  icon,
  value,
  displayValue,
  field,
  type = "text",
  isEditing,
  onChange,
}) => {
  return (
    <div>

      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-xl border border-slate-900 bg-slate-950/40 px-3.5 py-3">

        <span className="text-blue-500">
          {icon}
        </span>

        {isEditing ? (
          <input
            type={type}
            value={value || ""}
            onChange={(e) =>
              onChange(field, e.target.value)
            }
            className="w-full border-b border-blue-500/20 bg-transparent text-sm text-white outline-none transition-colors focus:border-blue-500"
            required
          />
        ) : (
          <span className="text-sm font-semibold">
            {displayValue || "N/A"}
          </span>
        )}

      </div>

    </div>
  );
};

export default AdminProfile;