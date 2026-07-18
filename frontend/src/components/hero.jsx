import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 80,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-14 px-5 py-25 lg:flex-row"
    >
      {/* Left Content */}

      <motion.div variants={fadeLeft} className="max-w-xl">
        {/* Badge */}

        <motion.div
          variants={item}
          whileHover={{
            scale: 1.05,
          }}
          className="mb-6 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-2 text-cyan-300 backdrop-blur-md"
        >
          🚦 প্রযুক্তির মাধ্যমে নিরাপদ সড়ক
        </motion.div>

        {/* Heading */}

        <motion.h1
          variants={item}
          className="text-5xl font-extrabold leading-tight text-white md:text-6xl"
        >
          স্মার্ট ট্রাফিক
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
            ব্যবস্থাপনা সিস্টেম
          </span>
        </motion.h1>

        {/* Description */}

        <motion.p
          variants={item}
          className="mt-6 text-lg leading-8 text-gray-300"
        >
          কৃত্রিম বুদ্ধিমত্তা (AI), স্মার্ট ট্রাফিক সিগন্যাল এবং
          রিয়েল-টাইম মনিটরিং প্রযুক্তির মাধ্যমে নিরাপদ, দ্রুত
          এবং আধুনিক সড়ক পরিবহন ব্যবস্থা নিশ্চিত করি।
        </motion.p>

        {/* Buttons */}

        <motion.div
          variants={item}
          className="mt-10 flex justify-center lg:ml-[-180px] flex-wrap gap-5"
        >
          {/* Login */}

          <motion.button
            onClick={() => navigate("/logincivil")}
            whileHover={{
              scale: 1.05,
              y: -5,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-7 py-3.5 font-bold text-slate-900 shadow-[0_5px_25px_rgba(6,182,212,.35)] transition-all duration-300 hover:shadow-[0_8px_35px_rgba(6,182,212,.5)] cursor-pointer"
          >
            <LogIn size={20} />
            লগইন করুন
            <ArrowRight size={18} />
          </motion.button>

          {/* Register */}

          <motion.button
            onClick={() => navigate("/register")}
            whileHover={{
              scale: 1.05,
              y: -5,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-slate-900 px-7 py-3.5 font-bold text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(6,182,212,.25)] cursor-pointer"
          >
            <UserPlus size={20} />
            রেজিস্ট্রেশন
          </motion.button>
        </motion.div>

        {/* Features */}

        <motion.div
          variants={item}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            {
              icon: "🧠",
              title: "AI বিশ্লেষণ",
              color: "from-cyan-500/20 to-cyan-500/5",
            },
            {
              icon: "🚦",
              title: "স্মার্ট সিগন্যাল",
              color: "from-blue-500/20 to-blue-500/5",
            },
            {
              icon: "📹",
              title: "লাইভ মনিটরিং",
              color: "from-emerald-500/20 to-emerald-500/5",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -5,
                scale: 1.03,
              }}
              transition={{ duration: 0.25 }}
              className={`
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-cyan-500/20
                bg-gradient-to-br
                ${feature.color}
                bg-[#0B1224]/70
                p-4
                backdrop-blur-xl
                transition-all
                duration-300
                hover:border-cyan-400
                hover:shadow-[0_0_25px_rgba(34,211,238,.25)]
              `}
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-2xl transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>

              {/* Text */}
              <div>
                <h4 className="text-base font-semibold text-white">
                  {feature.title}
                </h4>

                <p className="mt-1 text-xs text-gray-400">
                  রিয়েল-টাইম AI প্রযুক্তি
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      
    </motion.section>
  );
};

export default Hero;