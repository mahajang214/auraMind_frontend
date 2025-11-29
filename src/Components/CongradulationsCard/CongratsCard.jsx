// CongratsCard.jsx
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaShareAlt, FaRocket } from "react-icons/fa";
import logo from '/public/mind.svg'

/**
 * Props:
 * - open (bool) : whether the card is visible
 * - onClose (func) : called when close / continue pressed
 * - onShare (func) : called when user clicks Share
 * - title (string)
 * - subtitle (string)
 * - tasksCompleted (number)
 * - totalTasks (number)
 * - streak (number)
 * - gems (number)
 */
export default function CongratsCard({
  open,
  onClose,
  onShare,
  title,
  subtitle,
  tasksCompleted,
  totalTasks,
  streak,
  gems ,
}) {
  const rootRef = useRef(null);

  // optional subtle spring + scale entrance
  useEffect(() => {
    if (!open && rootRef.current) {
      // nothing fancy — leave for framer exit animation
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 `z-[2000]`  flex items-center justify-center p-6"
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-linear-to-br from-black/70 to-[#001217]/60 backdrop-blur-sm border "
        onClick={onClose}
      />

      {/* card */}
      <motion.div
        ref={rootRef}
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative w-[80%] max-w-2xl rounded-3xl p-6 sm:p-8 bg-linear-to-br from-[#071017]/80 to-[#08111a]/70 border border-white/6 shadow-2xl"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 bg-white/6 hover:bg-white/10 p-2 rounded-full text-white cursor-pointer"
        >
          <FaTimes />
        </button>

        {/* Decorative golden ribbon */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-linear-to-r from-[#ffd369] to-[#ffb84d] shadow-xl text-[#081014] font-bold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.9 6.1 6.6.6-4.8 4 1.3 6.3L12 16.9 6.9 19.1 8.2 12.8 3.4 8.8l6.6-.6L12 2z" fill="#081014"/>
            </svg>
            <span className="text-sm cursor-default">Congradulations</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Left: trophy & burst */}
          <div className="w-full md:w-48 flex flex-col items-center">
            <div className="rounded-2xl p-5 bg-linear-to-br from-[#0a1012] to-[#071617] border border-white/6 shadow-inner flex items-center justify-center">
              {/* Trophy SVG */}
              <img
                src={logo}
                alt="Logo"
                width={102}
                height={102}
                className="mb-1"
                draggable="false"
              />
            </div>

            {/* small burst (decor) */}
            <div className="mt-3 flex gap-1">
              <span className="block w-2 h-2 bg-[#FFD369] rounded-full animate-bounce" />
              <span className="block w-2 h-2 bg-[#FFB84D] rounded-full animate-pulse" />
              <span className="block w-2 h-2 bg-[#62ffa7] rounded-full animate-bounce delay-75" />
            </div>
          </div>

          {/* Right: content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-300 max-w-xl">
              {subtitle}
            </p>

            {/* stats */}
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div className="bg-linear-to-b from-[#071216]/60 to-transparent rounded-xl p-3 border border-white/6">
                <div className="text-xs text-gray-400">Tasks</div>
                <div className="text-lg font-bold text-white">{tasksCompleted}/{totalTasks}</div>
              </div>
              <div className="bg-linear-to-b from-[#071216]/60 to-transparent rounded-xl p-3 border border-white/6">
                <div className="text-xs text-gray-400">Streak</div>
                <div className="text-lg font-bold text-[#62ffa7]">{streak}</div>
              </div>
              <div className="bg-linear-to-b from-[#071216]/60 to-transparent rounded-xl p-3 border border-white/6">
                <div className="text-xs text-gray-400">Gems</div>
                <div className="text-lg font-bold text-[#FFD369]">{gems}</div>
              </div>
            </div>

            {/* foot */}
            <div className="mt-6 flex gap-3 items-center justify-center md:justify-start">
              <button
                onClick={() => {
                  onShare?.();
                }}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/6 hover:bg-white/12 text-white font-semibold transition cursor-pointer"
                type="button"
              >
                <FaShareAlt /> Share
              </button>

              <button
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-2 rounded-xl bg-linear-to-r from-[#00ADB5] to-[#00BCD4] text-black font-bold shadow-lg transition cursor-pointer hover:brightness-110 hover:scale-[1.04]"
                type="button"
              >
                <FaRocket /> Continue
              </button>
            </div>
          </div>
        </div>

        {/* subtle footer text */}
        <div className="mt-6 text-xs text-gray-400 text-center">
          You earned this — keep the streak alive. Rewards are incremental and meaningful.
        </div>

        {/* Decorative SVG confetti bursts (absolute positioned) */}
        <svg className="absolute -right-10 -top-8 w-56 h-56 opacity-30 pointer-events-none" viewBox="0 0 200 200" fill="none">
          <g fill="url(#g)">
            <circle cx="30" cy="30" r="3" fill="#FFD369" />
            <circle cx="60" cy="80" r="2.5" fill="#62ffa7" />
            <circle cx="120" cy="20" r="2.5" fill="#FFB84D" />
            <circle cx="160" cy="60" r="2.5" fill="#8bd6ff" />
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0%" stopColor="#FFD369" />
                <stop offset="100%" stopColor="#FFB84D" />
              </linearGradient>
            </defs>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
