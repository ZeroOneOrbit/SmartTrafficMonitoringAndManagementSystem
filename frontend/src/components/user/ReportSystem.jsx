import React, { useState, useEffect } from "react";
import { Send, Image, Video, MapPin, CheckCircle, AlertCircle, FileText, Trash2, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const ReportSystem = () => {
  const [category, setCategory] = useState("violation");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState("image"); // image, video
  const [complaints, setComplaints] = useState([]);

  // Load complaints from localStorage or set defaults
  useEffect(() => {
    const saved = localStorage.getItem("publicReports");
    if (saved) {
      setComplaints(JSON.parse(saved));
    } else {
      const defaults = [
        {
          id: 1,
          category: "illegal-parking",
          description: "ধানমন্ডি ২৭ নম্বর সড়কে মূল রাস্তার ওপর অবৈধভাবে ডাবল লাইনে গাড়ি পার্কিং করে প্রতিবন্ধকতা সৃষ্টি করা হচ্ছে।",
          location: "ধানমন্ডি ২৭, ঢাকা",
          media: null,
          status: "pending",
          date: "১৮ জুলাই, ২০২৬"
        },
        {
          id: 2,
          category: "broken-signal",
          description: "মিরপুর-২ নম্বর মোড়ের ট্রাফিক সিগন্যাল লাইটটি ভাঙা এবং হলুদ লাইট ক্রমাগত জ্বলছে, কোনো স্বয়ংক্রিয় পরিবর্তন হচ্ছে না।",
          location: "মিরপুর ২, ঢাকা",
          media: null,
          status: "investigating",
          date: "১৭ জুলাই, ২০২৬"
        }
      ];
      setComplaints(defaults);
      localStorage.setItem("publicReports", JSON.stringify(defaults));
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file.name);
      setMediaType(file.type.startsWith("video") ? "video" : "image");
      toast.success(`ফাইল সংযুক্ত করা হয়েছে: ${file.name}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !location) {
      toast.error("অনুগ্রহ করে বর্ণনা এবং লোকেশন ক্ষেত্রটি পূরণ করুন।");
      return;
    }

    const newReport = {
      id: Date.now(),
      category,
      description,
      location,
      media: mediaFile ? { name: mediaFile, type: mediaType } : null,
      status: "pending",
      date: new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
    };

    const updated = [newReport, ...complaints];
    setComplaints(updated);
    localStorage.setItem("publicReports", JSON.stringify(updated));

    // Reset Form
    setDescription("");
    setLocation("");
    setMediaFile(null);
    toast.success("আপনার রিপোর্ট সফলভাবে ট্রাফিক কন্ট্রোল ডাটাবেজে জমা হয়েছে।", {
      icon: "🎉"
    });
  };

  const handleDelete = (id) => {
    const updated = complaints.filter(c => c.id !== id);
    setComplaints(updated);
    localStorage.setItem("publicReports", JSON.stringify(updated));
    toast.success("রিপোর্ট বাতিল করা হয়েছে।");
  };

  // Convert categories keys to Bengali names
  const categoryNames = {
    "violation": "ট্রাফিক নিয়ম লঙ্ঘন",
    "broken-signal": "ভাঙা ট্রাফিক সিগন্যাল",
    "accident": "সড়ক দুর্ঘটনা",
    "illegal-parking": "অবৈধ পার্কিং",
    "blockage": "রাস্তা অবরুদ্ধ",
    "suspicious": "সন্দেহজনক কার্যকলাপ",
    "damaged-road": "ক্ষতিগ্রস্ত রাস্তা"
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
      
      {/* LEFT: Submission Form Panel (Span 6) */}
      <div className="lg:col-span-6 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="text-sm font-black text-cyan-400 mb-1 flex items-center gap-2">
              <FileText size={16} /> নাগরিক অভিযোগ ও রিপোর্টিং ফর্ম
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold mb-4 leading-normal">
              আইন অমান্যকারী ও ভঙ্গুর ট্রাফিক পরিকাঠামোর লাইভ বিবরণ, ছবি বা ভিডিও আপলোড করে ট্রাফিক কর্তৃপক্ষকে সহায়তা করুন।
            </p>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider">অভিযোগের ধরন</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500/50 rounded-2xl px-3.5 py-3 text-xs text-white outline-none cursor-pointer"
            >
              <option value="violation">🚦 ট্রাফিক নিয়ম লঙ্ঘন (Violation)</option>
              <option value="broken-signal">🔌 ভাঙা ট্রাফিক সিগন্যাল</option>
              <option value="accident">⚠️ সড়ক দুর্ঘটনা (Accident)</option>
              <option value="illegal-parking">🚗 অবৈধ গাড়ি পার্কিং</option>
              <option value="blockage">🚧 রাস্তা অবরুদ্ধ / প্রতিবন্ধকতা</option>
              <option value="damaged-road">🛣️ ক্ষতিগ্রস্ত রাস্তা</option>
              <option value="suspicious">🕵️ সন্দেহজনক কার্যকলাপ</option>
            </select>
          </div>

          {/* Location field */}
          <div>
            <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider">ঘটনাস্থলের ঠিকানা / লোকেশন</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                placeholder="যেমন: ধানমন্ডি ২৭, ইবনে সিনা হাসপাতালের সামনে"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 focus:border-blue-500/50 rounded-2xl pl-9 pr-3.5 py-3 text-xs text-white outline-none placeholder:text-slate-700 cursor-text"
              />
            </div>
          </div>

          {/* Description field */}
          <div>
            <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider">অভিযোগের বিস্তারিত বর্ণনা</label>
            <textarea
              required
              rows={3}
              placeholder="অভিযোগের বিস্তারিত লিখুন (যেমন: গাড়ির নম্বর, কোনো সিগন্যাল ভাঙা ইত্যাদি)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-855 focus:border-blue-500/50 rounded-2xl px-3.5 py-3 text-xs text-white outline-none placeholder:text-slate-700 resize-none cursor-text"
            />
          </div>

          {/* File Upload zone */}
          <div>
            <label className="block text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">ছবি বা ভিডিও প্রমাণাদি সংযুক্ত করুন</label>
            <div className="border border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-4 text-center cursor-pointer transition-colors relative bg-slate-900/10">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                <div className="flex gap-2 text-slate-400">
                  <Image size={18} />
                  <Video size={18} />
                </div>
                {mediaFile ? (
                  <span className="text-[10px] text-blue-400 font-bold mt-1 truncate max-w-xs">{mediaFile}</span>
                ) : (
                  <>
                    <span className="text-[10px] font-bold">এখানে ক্লিক করে ফাইল সিলেক্ট করুন</span>
                    <span className="text-[8px] text-slate-650">JPG, PNG, MP4 (অনূর্ধ্ব ২০ এমবি)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black rounded-2xl text-xs transition-all duration-300 shadow-xl shadow-blue-500/15 cursor-pointer text-center"
          >
            অভিযোগ সাবমিট করুন
          </button>
        </form>
      </div>

      {/* RIGHT: History Log Panel (Span 6) */}
      <div className="lg:col-span-6 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between max-h-[550px] overflow-y-auto">
        <div>
          <h3 className="text-sm font-black text-white mb-1 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-400" /> অভিযোগের বিবরণী ও স্ট্যাটাস
          </h3>
          <p className="text-[10px] text-slate-500 font-semibold mb-4 leading-normal">
            আপনার সাবমিট করা পূর্ববর্তী রিপোর্টগুলোর অবস্থা এবং আপডেট এখান থেকে যাচাই করুন।
          </p>

          <div className="space-y-3">
            {complaints.length > 0 ? (
              complaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-900/35 border border-slate-900 rounded-2xl p-4 space-y-2.5 transition-all duration-200 hover:border-slate-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] bg-blue-600/10 border border-blue-500/20 text-blue-400 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase self-start">
                        {categoryNames[c.category] || c.category}
                      </span>
                      <span className="text-xs font-bold text-white mt-1 flex items-center gap-1">
                        <MapPin size={10} className="text-slate-500" /> {c.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        c.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : c.status === "investigating"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {c.status === "pending" ? "পেন্ডিং" : c.status === "investigating" ? "তদন্তাধীন" : "সমাধান"}
                      </span>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-slate-650 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-450 leading-relaxed">{c.description}</p>
                  
                  {c.media && (
                    <div className="text-[8px] text-slate-650 bg-slate-950 p-1.5 rounded-lg border border-slate-900/60 inline-block font-mono max-w-full truncate">
                      সংযুক্ত ফাইল: {c.media.name} ({c.media.type})
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-[8px] text-slate-650 font-bold border-t border-slate-950 pt-2">
                    <Calendar size={10} />
                    <span>রিপোর্ট জমা: {c.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-900/10 border border-slate-900/40 border-dashed p-8 rounded-2xl text-center flex flex-col items-center justify-center">
                <AlertCircle size={28} className="text-slate-550 mb-2" />
                <h4 className="text-xs font-bold text-slate-500">কোনো অভিযোগ রেকর্ড নেই</h4>
                <p className="text-[9px] text-slate-600 mt-1 max-w-xs leading-normal">
                  আপনার আইপি বা ইউজার কোডে পূর্বে কোনো ট্রাফিকের অভিযোগ জমা দেওয়ার রেকর্ড খুঁজে পাওয়া যায়নি।
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-5 border-t border-slate-900 pt-3 text-[7.5px] text-slate-600 font-bold text-center leading-normal uppercase">
          মিথ্যা বা উদ্দেশ্যপ্রণোদিত ভুল তথ্য জমা দিলে প্রচলিত আইন অনুযায়ী ব্যবস্থা নেওয়া হতে পারে।
        </div>
      </div>

    </div>
  );
};

export default ReportSystem;
