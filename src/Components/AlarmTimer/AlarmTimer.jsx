import React, { useEffect, useState, useRef } from "react";
import { FaPlay, FaPause, FaRedo, FaBell } from "react-icons/fa";
import { showToast } from "../Utils/ToastService";
import { AnimatePresence, motion } from "framer-motion";
import { debugKey } from "../Debuger/DebugKeys";
import alarmAudio from "../../../public/alarm-audio.mp3";

const AlarmTimer = ({ cn, laptop = false }) => {
  const [time, setTime] = useState(0);
  const [inputTime, setInputTime] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(
        () => setTime((prev) => prev - 1),
        1000
      );
    } else if (time === 0 && isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setAlarmTriggered(true);
  
      // Play alarm safely
      const audio = audioRef.current;
      // console.log("audio : ",audioRef.current)
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(err => console.warn("Autoplay blocked:", err));
      }
  
      showToast("warning", "Time’s up!");
    }
    return () => clearInterval(intervalRef.current);
  }, [time, isRunning]);

  const handleStart = () => {
    const seconds = parseInt(inputTime, 10) * 60;
    if (!isNaN(seconds) && seconds > 0) {
      setTime(seconds);
      setIsRunning(true);
      setAlarmTriggered(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    setTime(0);
    setInputTime("");
    setIsRunning(false);
    setAlarmTriggered(false);
    clearInterval(intervalRef.current);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center bg-[#1e1e1e] lg:bg-[#222831] text-white p-5 rounded-xl shadow-md border border-[#00ADB5]/30 ${cn}`}
    >
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaBell className="text-[#00ADB5]" /> Break Timer
      </h1>
      {/* mobile */}
      <div className="flex lg:hidden flex-col items-center gap-4">
        <input
          type="number"
          min="1"
          placeholder="Enter minutes"
          value={inputTime}
          onChange={(e) => setInputTime(e.target.value)}
          disabled={isRunning}
          className="w-40 text-center text-lg bg-[#222831] text-white border border-[#00ADB5]/50 rounded-md p-2 focus:ring-2 focus:ring-[#00ADB5] outline-none"
        />
        {/* default times */}
        <div className="flex flex-wrap gap-3 w-full items-center  justify-center">
          {[0, 5, 10, 15, 20, 25].map((min, k) => (
            <button
              key={debugKey(k, min, "ALL ALARM TIMER LIST")}
              className="bg-[#393E46] hover:bg-[#222831] text-white px-3 py-1 rounded transition duration-500 active:scale-95 text-sm font-medium cursor-pointer border-transparent border  hover:border-gray-500 hover:-translate-y-1.5"
              disabled={isRunning}
              onClick={() => setInputTime(min)}
              type="button"
            >
              {min} min
            </button>
          ))}
        </div>

        <h2 className="text-4xl font-mono tracking-widest">
          {formatTime(time)}
        </h2>

        <div className="flex gap-3 mt-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 bg-[#00ADB5] hover:bg-[#06c4cc] px-4 py-2 rounded-md transition-all active:scale-95"
            >
              <FaPlay /> Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md transition-all active:scale-95"
            >
              <FaPause /> Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-all active:scale-95"
          >
            <FaRedo /> Reset
          </button>
        </div>
      </div>

      {/* laptop */}
      <div className="hidden lg:flex justify-between items-center gap-4 w-full">
        <div className="flex flex-col items-left gap-4 ">
          <input
            type="number"
            min="1"
            placeholder="Enter minutes"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            disabled={isRunning}
            className="w-80 text-center text-lg bg-[#222831] text-white border border-[#00ADB5]/50 rounded-md p-2 focus:ring-2 focus:ring-[#00ADB5] outline-none"
          />

          <h2 className="text-8xl font-mono tracking-widest">
            {formatTime(time)}
          </h2>

          {/* default times */}
          <div className="flex flex-wrap gap-2 mt-5">
            {[0, 5, 10, 15, 20, 25, 30].map((min, k) => (
              <button
                key={debugKey(k, min, "ALL ALARM TIMER LIST")}
                className="bg-[#393E46] hover:bg-[#222831] text-white px-3 py-1 rounded transition duration-500 active:scale-95 text-sm font-medium cursor-pointer border-transparent border  hover:border-gray-500 hover:-translate-y-1.5"
                disabled={isRunning}
                onMouseEnter={() => setInputTime(min)}
                type="button"
              >
                {min} min
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 bg-[#0F1115] px-2 py-6 rounded-2xl w-1/3 font-bold shadow-[0_0_20px_#00ADB522] transition-all duration-300">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 text-black px-5 rounded 
                 w-full justify-center text-lg bg-linear-to-r from-green-400 via-emerald-500 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] hover:scale-105 
                 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <FaPlay /> Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 text-black px-5 rounded 
                 w-full justify-center text-lg bg-linear-to-r from-yellow-400 via-amber-500 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:shadow-[0_0_30px_rgba(251,191,36,0.9)] hover:scale-105 
                 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <FaPause /> Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-2  text-white px-5  rounded 
               w-full justify-center text-lg 
                hover:scale-105 
               active:scale-95 transition-all duration-300 cursor-pointer  bg-linear-to-r from-red-500 via-rose-600 to-pink-700 shadow-[0_0_20px_rgba(239,68,68,0.6)]
hover:shadow-[0_0_35px_rgba(244,63,94,0.9)]"
          >
            <FaRedo /> Reset
          </button>
        </div>
      </div>
      {alarmTriggered && (
        <>
          <p className="mt-4 text-[#ff5555] animate-pulse text-lg cursor-default">
            🔔 Time’s up! Take a breath.
          </p>

          
        </>
      )}
      <audio
            controls
            src={alarmAudio}
            ref={audioRef}
            preload="auto"
            playsInline
            className="hidden"
            style={{ width: 280 }}
            onCanPlayThrough={(e) => {
              try {
                e.target.volume = 1.0;
              } catch (err) {}
            }}
          />
    </div>
  );
};

export default AlarmTimer;
