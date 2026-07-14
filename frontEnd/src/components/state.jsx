import {
  Car,
  TrafficCone,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "নিবন্ধিত যানবাহন",
    value: "২৫,৪৮০+",
    icon: Car,
    color: "text-cyan-400",
  },
  {
    title: "সক্রিয় সিগন্যাল",
    value: "১৫৬",
    icon: TrafficCone,
    color: "text-green-400",
  },
  {
    title: "সড়ক নিরাপত্তা",
    value: "৯৮%",
    icon: ShieldCheck,
    color: "text-yellow-400",
  },
  {
    title: "২৪/৭ পর্যবেক্ষণ",
    value: "সক্রিয়",
    icon: Activity,
    color: "text-pink-400",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariant = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const Stats = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 lg:px-10"
    >
      {/* Heading */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-400 md:text-sm">
          📊 লাইভ ট্রাফিক পরিসংখ্যান
        </span>

        <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">
          স্মার্ট ট্রাফিকের বর্তমান অবস্থা
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
          আমাদের AI-চালিত সিস্টেম রিয়েল-টাইমে ট্রাফিক পর্যবেক্ষণ,
          বিশ্লেষণ এবং নিয়ন্ত্রণ করে নিরাপদ ও দ্রুত যান চলাচল নিশ্চিত করে।
        </p>
      </motion.div>

      {/* Cards */}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-6 lg:grid-cols-4"
      >
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              variants={cardVariant}
              whileHover={{
                y: -12,
                scale: 1.05,
                rotateX: 6,
                rotateY: -6,
              }}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.3,
              }}
              className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-cyan-500/20
              bg-[#0B1224]/70
              p-5
              backdrop-blur-xl
              hover:border-cyan-400
              hover:shadow-[0_0_30px_rgba(34,211,238,.35)]
              "
            >
              {/* Animated Glow */}

              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-500/20 blur-3xl"
              />

              {/* Live */}

              <span className="absolute right-4 top-4 flex items-center gap-1 text-[10px] text-cyan-300">
                <motion.span
                  animate={{
                    scale: [1, 1.6, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  className="h-2 w-2 rounded-full bg-green-400"
                />
                Live
              </span>

              {/* Icon */}

              <motion.div
                whileHover={{
                  rotate: 10,
                  scale: 1.15,
                }}
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10"
              >
                <Icon
                  size={24}
                  className={`${item.color}`}
                />
              </motion.div>

              {/* Number */}

              <motion.h3
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 12,
                }}
                className="text-2xl font-bold text-white md:text-3xl"
              >
                {item.value}
              </motion.h3>

              {/* Title */}

              <p className="mt-2 text-xs leading-5 text-gray-400 md:text-sm">
                {item.title}
              </p>

              {/* Animated Line */}

              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{
                  duration: 1,
                  delay: index * 0.2,
                }}
                className="mt-5 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-transparent"
              />

              {/* Hover Overlay */}

              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
};

export default Stats;