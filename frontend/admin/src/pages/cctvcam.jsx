import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Menu, MapPin, Wifi, Video } from "lucide-react";
import Sidebar from "../components/Sidebar";

const CctvCam = () => {
  const [cameras, setCameras] = useState([]);
  const [activeCamera, setActiveCamera] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("camera");
  const [emergencyMode, setEmergencyMode] = useState(false);


 

useEffect(() => {
  const camLoader = async () => {
    try {
      setLoading(true);
      setError("");

      const officerData = sessionStorage.getItem("officer");

      if (!officerData) {
        setError("Officer data not found");
        return;
      }

      const officer = JSON.parse(officerData);
      const thanaId = officer?.zone;
      const role = officer?.role

      if (!thanaId) {
        setError("Officer zone not found");
        return;
      }

      if (!role){
        setError(
            "Officer Role not found "
        )
      }
      console.log("Thana ID:", thanaId);

      let res;

      if (role.toLowerCase() === "admin") {
        // Admin: get all cameras
        res = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/camera`
        );
      } else {
        // Officer: get cameras for specific thana
        res = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/camera/thana`,
          {
            headers: {
              "area": thanaId,
            },
          }
        );
      }

      setCameras(res.data?.data || []);

    } catch (err) {
      console.error("Camera loading error:", err);

      setError(
        err.response?.data?.message ||
        "ক্যামেরা লোড করা যায়নি"
      );

    } finally {
      setLoading(false);
    }
  };

  camLoader();
}, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ───────────────── DESKTOP SIDEBAR ───────────────── */}

      <aside className="hidden lg:block fixed top-0 left-0 z-40 h-screen w-64">

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          emergencyMode={emergencyMode}
          setEmergencyMode={setEmergencyMode}
        />

      </aside>


      {/* ───────────────── MOBILE SIDEBAR DRAWER ───────────────── */}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
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


      {/* ───────────────── MOBILE OVERLAY ───────────────── */}

      {mobileSidebarOpen && (

        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />

      )}


      {/* ───────────────── MAIN CONTENT ───────────────── */}

      <main className="lg:ml-64 min-h-screen">

        {/* HEADER */}

        <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">

          <div className="flex h-full items-center justify-between px-4 sm:px-6">

            {/* Mobile Menu Button */}

            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white lg:hidden"
            >
              <Menu size={20} />
            </button>


            {/* Page Title */}

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-500/10 p-2">

                <Video
                  size={20}
                  className="text-blue-400"
                />

              </div>

              <div>

                <h1 className="text-lg font-bold">
                  CCTV ক্যামেরা
                </h1>

                <p className="text-xs text-slate-500">
                  লাইভ ট্রাফিক ক্যামেরা পর্যবেক্ষণ
                </p>

              </div>

            </div>


            {/* Camera Count */}

            <div className="hidden rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 sm:block">

              <span className="text-xs text-slate-400">
                মোট ক্যামেরা
              </span>

              <span className="ml-2 font-bold text-blue-400">
                {cameras.length}
              </span>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <section className="p-4 sm:p-6">

          {/* PAGE HEADER */}

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-white">
              লাইভ ক্যামেরা ফিড
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              সকল ট্রাফিক ক্যামেরার লাইভ প্রিভিউ দেখুন
            </p>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="flex min-h-[300px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />

                <p className="mt-4 text-sm text-slate-400">
                  ক্যামেরা লোড হচ্ছে...
                </p>

              </div>

            </div>

          )}


          {/* ERROR */}

          {!loading && error && (

            <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center">

              <p className="text-red-400">
                {error}
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading && !error && cameras.length === 0 && (

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">

              <Video
                size={40}
                className="mx-auto mb-4 text-slate-600"
              />

              <p className="text-slate-500">
                কোনো ক্যামেরা পাওয়া যায়নি
              </p>

            </div>

          )}


          {/* CAMERA GRID */}

          {!loading && !error && cameras.length > 0 && (

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

              {cameras.map((cam) => (

                <div
                  key={cam.camid}
                  className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/20"
                >

                  {/* VIDEO PREVIEW */}

                  <button
                    onClick={() => setActiveCamera(cam)}
                    className="relative block aspect-video w-full cursor-pointer overflow-hidden bg-black"
                  >

                    <img
                      src={cam.streamUrl}
                      alt={cam.cameraName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Dark Overlay */}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />


                    {/* LIVE */}

                    <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg bg-red-600/90 px-2 py-1">

                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />

                      <span className="text-[10px] font-bold">
                        LIVE
                      </span>

                    </div>


                    {/* ONLINE */}

                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1">

                      <Wifi
                        size={12}
                        className="text-green-400"
                      />

                      <span className="text-[10px] text-green-400">
                        ONLINE
                      </span>

                    </div>


                    {/* Camera ID */}

                    <span className="absolute bottom-3 left-3 text-xs font-bold text-white">

                      {cam.camid}

                    </span>

                  </button>


                  {/* CAMERA INFO */}

                  <div className="p-4">

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="font-bold text-slate-200">
                          {cam.cameraName}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {cam.cameraType}
                        </p>

                      </div>

                      <span className="rounded-md bg-green-500/10 px-2 py-1 text-[10px] font-bold uppercase text-green-400">

                        {cam.status}

                      </span>

                    </div>


                    {/* Location */}

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">

                      <MapPin size={13} />

                      <span>
                        {cam.location?.latitude},{" "}
                        {cam.location?.longitude}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>


      {/* ───────────────── CAMERA MODAL ───────────────── */}

      {activeCamera && (

        <div
          onClick={() => setActiveCamera(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl"
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>

                <h2 className="font-bold">
                  {activeCamera.cameraName}
                </h2>

                <p className="text-xs text-slate-500">
                  {activeCamera.camid}
                </p>

              </div>


              <button
                onClick={() => setActiveCamera(null)}
                className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white"
              >

                <X size={18} />

              </button>

            </div>


            {/* LARGE LIVE STREAM */}

            <div className="bg-black p-3">

              <img
                src={activeCamera.streamUrl}
                alt={activeCamera.cameraName}
                className="max-h-[75vh] w-full rounded-xl object-contain"
              />

            </div>


            {/* FOOTER */}

            <div className="grid grid-cols-2 border-t border-slate-800 sm:grid-cols-4">

              <div className="p-4 text-center">

                <p className="text-[10px] text-slate-500">
                  CAMERA ID
                </p>

                <p className="mt-1 text-sm font-bold">
                  {activeCamera.camid}
                </p>

              </div>


              <div className="p-4 text-center">

                <p className="text-[10px] text-slate-500">
                  TYPE
                </p>

                <p className="mt-1 text-sm font-bold">
                  {activeCamera.cameraType}
                </p>

              </div>


              <div className="p-4 text-center">

                <p className="text-[10px] text-slate-500">
                  STATUS
                </p>

                <p className="mt-1 text-sm font-bold text-green-400">
                  {activeCamera.status}
                </p>

              </div>


              <div className="p-4 text-center">

                <p className="text-[10px] text-slate-500">
                  THANA
                </p>

                <p className="mt-1 text-sm font-bold">
                  {activeCamera.thanaId}
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default CctvCam;