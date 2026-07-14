import { useState } from "react";
import {
  TrafficCone,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-cyan-500/20 bg-[#030712]/10 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 sm:h-10 sm:w-10">
            <TrafficCone
              size={20}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h1 className="text-sm font-bold text-white sm:text-lg">
              Smart Traffic
            </h1>

            <p className=" text-[9px] uppercase tracking-widest text-cyan-400 md:block">
              Management System
            </p>
          </div>
        </div>

        {/* Desktop Menu */}

        <ul className="hidden items-center gap-6 text-sm text-gray-300 lg:flex">

          <li className="cursor-pointer transition hover:text-cyan-400">
            হোম
          </li>

          <li className="cursor-pointer transition hover:text-cyan-400">
            সেবাসমূহ
          </li>

          <li className="cursor-pointer transition hover:text-cyan-400">
            বৈশিষ্ট্য
          </li>

          <li className="cursor-pointer transition hover:text-cyan-400">
            যোগাযোগ
          </li>

        </ul>

        {/* Desktop Buttons */}

        <div className="hidden items-center gap-2 lg:flex">

          <button className="flex items-center gap-2 rounded-lg border border-cyan-500/30 px-3 py-2 text-sm text-cyan-400 transition hover:bg-cyan-500 hover:text-black">
            <LogIn size={16} />
            লগইন
          </button>

          <button className="flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400">
            <UserPlus size={16} />
            রেজিস্ট্রেশন
          </button>

        </div>

        {/* Mobile Menu Button */}

        <button
          className="text-cyan-400  relativ lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* Mobile Menu */}

      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="border-t border-cyan-500/20 bg-[#08111f]/95 px-3 py-3 backdrop-blur-xl">

          <ul className="space-y-2 text-sm">

            <li className="rounded-lg px-3 py-2 text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400">
               হোম
            </li>

            <li className="rounded-lg px-3 py-2 text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400">
               সেবাসমূহ
            </li>

            <li className="rounded-lg px-3 py-2 text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400">
               বৈশিষ্ট্য
            </li>

            <li className="rounded-lg px-3 py-2 text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400">
               যোগাযোগ
            </li>

          </ul>

          <div className="mt-4 space-y-2">

            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/30 py-2 text-sm text-cyan-400 transition hover:bg-cyan-500 hover:text-black">
              <LogIn size={16} />
              লগইন
            </button>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400">
              <UserPlus size={16} />
              রেজিস্ট্রেশন
            </button>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;