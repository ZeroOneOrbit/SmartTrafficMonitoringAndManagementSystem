import {
  BrainCircuit,
  Camera,
  MapPinned,
  TrafficCone,
  Ambulance,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BrainCircuit,
    title: "AI ট্রাফিক বিশ্লেষণ",
    description:
      "কৃত্রিম বুদ্ধিমত্তার মাধ্যমে রিয়েল-টাইম ট্রাফিক বিশ্লেষণ করে দ্রুত সিদ্ধান্ত গ্রহণ।",
  },
  {
    icon: TrafficCone,
    title: "স্মার্ট সিগন্যাল",
    description:
      "যানবাহনের চাপ অনুযায়ী স্বয়ংক্রিয়ভাবে ট্রাফিক সিগন্যাল নিয়ন্ত্রণ।",
  },
  {
    icon: Camera,
    title: "লাইভ মনিটরিং",
    description:
      "২৪/৭ ক্যামেরার মাধ্যমে ট্রাফিক পরিস্থিতি পর্যবেক্ষণ ও নিয়ন্ত্রণ।",
  },
  {
    icon: Ambulance,
    title: "জরুরি যানবাহন",
    description:
      "অ্যাম্বুলেন্স ও ফায়ার সার্ভিসের জন্য স্বয়ংক্রিয়ভাবে সবুজ সিগন্যাল।",
  },
  {
    icon: MapPinned,
    title: "লাইভ ট্রাফিক ম্যাপ",
    description:
      "বর্তমান যানজট, রাস্তার অবস্থা এবং বিকল্প রুট এক নজরে দেখুন।",
  },
  {
    icon: BarChart3,
    title: "রিপোর্ট ও অ্যানালিটিক্স",
    description:
      "ট্রাফিক ডেটা, দুর্ঘটনা এবং যানবাহনের বিস্তারিত রিপোর্ট।",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const Features = () => {
  return (
    <section className="mx-auto max-w-[1340px] px-6 py-20">

      {/* Heading */}

      <motion.div
        initial={{ opacity: 0, y: -25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >

        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
          🚦 আমাদের বৈশিষ্ট্য
        </span>

        <h2 className="mt-6 text-2xl font-bold text-white md:text-4xl">
          আধুনিক প্রযুক্তিতে স্মার্ট ট্রাফিক
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-gray-400">
          Artificial Intelligence, Smart Signal এবং Real-Time Monitoring
          প্রযুক্তির মাধ্যমে একটি নিরাপদ ও বুদ্ধিমান ট্রাফিক ব্যবস্থা।
        </p>

      </motion.div>

      {/* Cards */}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              variants={item}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              key={index}
              className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-cyan-500/20
              bg-[#0B1224]/70
              p-7
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-cyan-400
              hover:shadow-[0_0_35px_rgba(34,211,238,.25)]
              "
            >

              {/* Glow */}

              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-500/10 blur-3xl"></div>

              {/* Icon */}

              <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">

                <motion.div
                  animate={{
                    rotate: [0, 8, -8, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}
                >
                  <Icon
                    size={28}
                    className="text-cyan-400"
                  />
                </motion.div>

              </div>

              {/* Title */}

              <h3 className="text-xl font-semibold text-white">
                {feature.title}
              </h3>

              {/* Description */}

              <p className="mt-4 text-gray-400 leading-7">
                {feature.description}
              </p>

              {/* Button */}

              <button className="mt-7 flex items-center gap-2 text-cyan-400 transition-all duration-300 group-hover:gap-4">
                বিস্তারিত
                <ArrowRight size={18} />
              </button>

            </motion.div>
          );
        })}

      </motion.div>

    </section>
  );
};

export default Features;