import {
  TrafficCone,
  Facebook,
  Twitter,
  Github,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-cyan-500/20 bg-[#050816] text-gray-400">
      
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-3 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">

        {/* Logo Section */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 sm:h-10 sm:w-10">
              <TrafficCone className="text-cyan-400" size={20} />
            </div>

            <h1 className="text-base sm:text-lg font-bold text-white">
              Smart Traffic
            </h1>
          </div>

          <p className="mt-3 text-xs sm:text-sm leading-6">
            AI ভিত্তিক স্মার্ট ট্রাফিক ম্যানেজমেন্ট সিস্টেম যা শহরের যানজট কমিয়ে
            নিরাপদ ও দ্রুত যাতায়াত নিশ্চিত করে।
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="mb-3 text-white font-semibold text-sm sm:text-base">
            দ্রুত লিংক
          </h2>

          <ul className="space-y-2 text-xs sm:text-sm">
            <li className="hover:text-cyan-400 cursor-pointer">হোম</li>
            <li className="hover:text-cyan-400 cursor-pointer">সেবাসমূহ</li>
            <li className="hover:text-cyan-400 cursor-pointer">বৈশিষ্ট্য</li>
            <li className="hover:text-cyan-400 cursor-pointer">যোগাযোগ</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h2 className="mb-3 text-white font-semibold text-sm sm:text-base">
            সেবাসমূহ
          </h2>

          <ul className="space-y-2 text-xs sm:text-sm">
            <li>🚦 স্মার্ট সিগন্যাল</li>
            <li>📹 লাইভ মনিটরিং</li>
            <li>🤖 AI বিশ্লেষণ</li>
            <li>🚑 জরুরি যানবাহন সাপোর্ট</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="mb-3 text-white font-semibold text-sm sm:text-base">
            যোগাযোগ
          </h2>

          <ul className="space-y-3 text-xs sm:text-sm">
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-cyan-400 sm:size-4" />
              support@smarttraffic.com
            </li>
          </ul>

          {/* Social */}
          <div className="mt-4 flex gap-4 text-cyan-400">
            <Facebook className="cursor-pointer hover:text-white" size={18} />
            <Twitter className="cursor-pointer hover:text-white" size={18} />
            <Github className="cursor-pointer hover:text-white" size={18} />
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cyan-500/10 py-3 text-center text-[11px] sm:text-xs text-gray-500">
        © {new Date().getFullYear()} Smart Traffic Management System. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;