import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  TelegramIcon,
  TelegramShareButton,
  RedditIcon,
  RedditShareButton,
} from "react-share";
import logo from "/public/mind.svg";
import { showToast } from "../Utils/ToastService";

export default function ShareSection({ onClose, data }) {
  const [url, setUrl] = useState(null);
  // Detect if the screen size is 'lg' (large) using a media query
  const [isLg, setIsLg] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsLg(e.matches);
    mediaQuery.addEventListener("change", handler);
    setIsLg(mediaQuery.matches);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const copyToClipboard = async () => {
    if (!url) return;

    // Ensure navigator.clipboard exists (SSR safe)
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        if (navigator.vibrate) navigator.vibrate(60);

        showToast("success", "Link copied to clipboard!");
      } catch (err) {
        showToast("error", "Failed to copy link.");
      }
    } else {
      showToast("error", "Clipboard not supported.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute `z-[999]` left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 p-4 bg-black/30 backdrop-blur-xl rounded-2xl shadow-xl w-[80%] lg:w-full max-w-sm border border-white/10"
    >
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 z-10 bg-black/10 hover:bg-black/30 border border-white/10 rounded-full transition p-1 flex items-center justify-center cursor-pointer"
        aria-label="Close Share"
        onClick={onClose}
        type="button"
      >
        <svg width={22} height={22} viewBox="0 0 20 20" fill="none">
          <path
            d="M5.6 5.6L14.4 14.4M14.4 5.6L5.6 14.4"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {/* Share Preview Card */}
      <div className="w-full bg-[#0d0f16] rounded-xl p-4 flex flex-col items-center border border-white/10 shadow-md">
        <img
          src={`${logo}`}
          alt="Preview Badge"
          className="w-30 opacity-80 mb-3"
        />

        <h2 className="text-white xl lg:text-2xl font-bold mb-1">
          {data.name}
        </h2>
        <div className="flex flex-col items-center gap-1  sm lg:text-lg font-medium text-gray-300">
          <span>
            <span className="font-semibold text-[#FFD369]">Streak:</span>{" "}
            {data.streak}
          </span>
          <span>
            <span className="font-semibold text-[#62a9fa]">Gems:</span>{" "}
            {data.gems}
          </span>
          <span>
            <span className="font-semibold text-[#bc5fee]">Tracks:</span>{" "}
            {data.tracks}
          </span>
        </div>

        <p className="text-gray-400 text-xs mt-2 text-center">
          Share your progress with others!
        </p>
      </div>

      {/* share buttons */}
      <div className="flex flex-wrap gap-3 justify-center w-full px-2">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#232831] hover:bg-[#32363c] text-[#FFD369] font-semibold text-sm shadow border border-[#FFD36933] transition-all cursor-pointer"
          onClick={copyToClipboard}
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <rect
              x="6"
              y="4"
              width="10"
              height="12"
              rx="3"
              stroke="#FFD369"
              strokeWidth="1.6"
            />
            <rect
              x="4"
              y="6"
              width="10"
              height="12"
              rx="3"
              stroke="#FFD36999"
              strokeWidth="1.2"
            />
          </svg>
          Copy
        </button>
        <TelegramShareButton url={url} title="Check this out!">
         {isLg ? <TelegramIcon size={40} round />:
          <TelegramIcon size={30} round />}
        </TelegramShareButton>

        <WhatsappShareButton url={url} title="Check this out!">
          {isLg ? <WhatsappIcon size={40} round />: <WhatsappIcon size={30} round />}
        </WhatsappShareButton>

        <TwitterShareButton url={url}>
          {isLg ?<TwitterIcon size={40} round />:<TwitterIcon size={30} round />}
        </TwitterShareButton>

        <RedditShareButton url={url} title="Check this out!">
          {isLg ? <RedditIcon size={40} round />: <RedditIcon size={30} round />}
        </RedditShareButton>
      </div>
    </motion.div>
  );
}
