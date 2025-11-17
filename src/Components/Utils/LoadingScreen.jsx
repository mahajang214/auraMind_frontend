import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#222831] text-white">
      {/* Animated Spinner Circle */}
      <motion.div
        className="w-24 h-24 border-4 border-t-[#00ADB5] border-[#393E46] rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
      />

      {/* Loading Text */}
      <motion.h2
        className="mt-6 text-2xl font-semibold text-[#EEEEEE]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        Loading...
      </motion.h2>

      {/* Optional Subtext Pulse */}
      <motion.p
        className="text-sm text-[#00ADB5] mt-2"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        Please wait while we set things up ⚙️
      </motion.p>
    </div>
  );
}
