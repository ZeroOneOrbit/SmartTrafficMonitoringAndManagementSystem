import React, { useEffect, useState } from "react";
import { X, MapPin, Video, Wifi, LucideSquareDashedMousePointer } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CameraFeeds = () => {
  const [cameras, setCameras] = useState([]);
  const [activeCamera, setActiveCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  // Load cameras from backend
  useEffect(() => {
    const camLoader = async () => {
      try {
        setLoading(true);

        const officerData = sessionStorage.getItem("officer")

        if(!officerData){
          setError("officer not found")
        }
        const officer= JSON.parse(officerData)
        const thanaId = officer?.zone;
        const role = officer?.role;
         if (!thanaId) {
        setError("Officer zone not found");
        return;
      }
      if (!role){
        setError("Officer role not found ")
      }
        let res
        if(role.toLowerCase()=="admin"){
          res= await axios.get(
            `${import.meta.env.VITE_SERVER_API}/camera`
          )
        } 
        else{
          res= await axios.get(
            `${import.meta.env.VITE_SERVER_API}/camera/thana`,
            {
            headers: {
              "area": thanaId,
            },
          }
          )
        }


       

        setCameras(res.data.data || []);

      } catch (err) {
        console.error("Failed to load cameras:", err);

        setError("ক্যামেরা লোড করা যায়নি");

      } finally {
        setLoading(false);
      }
    };

    camLoader();
  }, []);

  

  return (
    <>
      {/* Camera Feed Container */}
      <div className="w-full bg-slate-950/60 border border-blue-950/40 rounded-3xl p-4 backdrop-blur-xl relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-900 pb-3">

          <div className="flex items-center gap-2">
            <Video size={15} className="text-blue-400" />

            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              লাইভ ক্যামেরা ফিড
            </span>
          </div>

          <span className="text-[10px] text-slate-500">
            {cameras.length} টি ক্যামেরা
          </span>

          <button
          onClick={() => navigate("/cctv")}
          className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer tracking-wide"
          >
          সব দেখুন
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center text-red-400 py-8 text-sm">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && cameras.length === 0 && (
          <div className="text-center text-slate-500 py-8 text-sm">
            কোনো ক্যামেরা পাওয়া যায়নি
          </div>
        )}

        {/* Camera Grid */}
        {!loading && !error && cameras.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            {cameras.slice(0,4).map((cam) => (

              <button
                key={cam.camid}
                onClick={() => setActiveCamera(cam)}
                className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 hover:border-blue-500/50 transition-all duration-200 cursor-pointer text-left"
              >

                {/* Live Stream Preview */}
                <div className="relative aspect-video overflow-hidden bg-black">

                  <img
                    src={cam.streamUrl}
                    alt={cam.cameraName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* LIVE Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600/90 rounded px-2 py-1 z-10">

                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />

                    <span className="text-[8px] text-white font-bold">
                      LIVE
                    </span>

                  </div>

                  {/* Status */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded px-2 py-1">

                    <Wifi
                      size={10}
                      className="text-green-400"
                    />

                    <span className="text-[8px] text-green-400">
                      ONLINE
                    </span>

                  </div>

                  {/* Camera ID */}
                  <div className="absolute bottom-2 left-2 text-[9px] text-white font-bold">

                    {cam.camid}

                  </div>

                </div>

                {/* Camera Information */}
                <div className="p-2">

                  <p className="text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors">

                    {cam.cameraName}

                  </p>

                  <div className="flex items-center gap-1 mt-1">

                    <MapPin
                      size={10}
                      className="text-slate-500"
                    />

                    <span className="text-[8px] text-slate-500">

                      {cam.location?.latitude},{" "}
                      {cam.location?.longitude}

                    </span>

                  </div>

                </div>

              </button>

            ))}

          </div>
        )}

      </div>

      {/* Full Screen Camera Modal */}
      {activeCamera && (

        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveCamera(null)}
        >

          <div
            className="relative w-full max-w-5xl bg-slate-950 border border-blue-900/50 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-900">

              <div>

                <h3 className="text-sm font-bold text-white">

                  {activeCamera.cameraName}

                </h3>

                <p className="text-[10px] text-slate-500 font-semibold">

                  {activeCamera.camid} — লাইভ স্ট্রিম সক্রিয়

                </p>

              </div>

              <div className="flex items-center gap-3">

                {/* Live Status */}
                <div className="flex items-center gap-1.5 bg-red-600/20 border border-red-500/30 px-2.5 py-1 rounded-full">

                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />

                  <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest">

                    লাইভ

                  </span>

                </div>

                {/* Close */}
                <button
                  onClick={() => setActiveCamera(null)}
                  className="p-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >

                  <X size={16} />

                </button>

              </div>

            </div>

            {/* Actual Live Stream */}
            <div className="bg-black p-3">

              <img
                src={activeCamera.streamUrl}
                alt={activeCamera.cameraName}
                className="w-full max-h-[70vh] object-contain rounded-xl"
              />

            </div>

            {/* Camera Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-900 border-t border-slate-900">

              <div className="flex flex-col items-center py-3">

                <span className="text-[9px] text-slate-500 font-bold">
                  ক্যামেরা ID
                </span>

                <span className="text-xs text-white font-bold mt-1">
                  {activeCamera.camid}
                </span>

              </div>

              <div className="flex flex-col items-center py-3">

                <span className="text-[9px] text-slate-500 font-bold">
                  ধরন
                </span>

                <span className="text-xs text-white font-bold mt-1">
                  {activeCamera.cameraType}
                </span>

              </div>

              <div className="flex flex-col items-center py-3">

                <span className="text-[9px] text-slate-500 font-bold">
                  স্ট্যাটাস
                </span>

                <span className="text-xs text-green-400 font-bold mt-1">
                  {activeCamera.status}
                </span>

              </div>

              <div className="flex flex-col items-center py-3">

                <span className="text-[9px] text-slate-500 font-bold">
                  থানা
                </span>

                <span className="text-xs text-white font-bold mt-1">
                  {activeCamera.thanaId}
                </span>

              </div>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default CameraFeeds;