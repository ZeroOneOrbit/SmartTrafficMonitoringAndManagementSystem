import {
  TrafficCone,
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
          <div className="mt-4 flex gap-4 text-cyan-400 items-center">
            {/* Facebook */}
            <svg className="w-4 h-4 cursor-pointer hover:text-white fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
            {/* Twitter */}
            <svg className="w-4 h-4 cursor-pointer hover:text-white fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            {/* Github */}
            <svg className="w-4 h-4 cursor-pointer hover:text-white fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
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