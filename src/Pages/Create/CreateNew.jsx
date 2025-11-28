import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { showToast } from "../../Components/Utils/ToastService";
import LoadingScreen from "../../Components/Utils/LoadingScreen";
import { useNavigate } from "react-router-dom";
import { FaPause, FaPlay, FaRedo } from "react-icons/fa";

function CreateNew() {
  const [whichBtnIsActiveForMobile, setWhichBtnIsActiveForMobile] =
    useState("add");
  const [createWhat, setCreateWhat] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const [titleName, setTitleName] = useState(null);
  const [titleCategory, setTitleCategory] = useState(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // habits
  const [habitName, setHabitName] = useState(null);
  const [habitFrequency, setHabitFrequency] = useState(null);
  const [habitDescription, setHabitDescription] = useState(null);
  // passion
  const [passionName, setPassionName] = useState(null);
  const [passionFrequency, setPassionFrequency] = useState(null);
  const [passionDescription, setPassionDescription] = useState(null);

  // timer section setup
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [duration, setDuration] = useState({hr:0,min:0,sec:0});

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const id = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 59) {
            setMinutes((prevMin) => {
              if (prevMin === 59) {
                setHours((prevHr) => prevHr + 1);
                return 0;
              }
              return prevMin + 1;
            });
            return 0;
          }
          return prevSec + 1;
        });
      }, 1000);
      setIntervalId(id);
    }
  };

  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIsRunning(false);
    }
  };

  const stopTimer = () => {
    // console.log("lap time : ",intervalId)
    // console.log("hr: ",hours);
    // console.log("min: ",minutes);
    // console.log("sec:", seconds)
    setDuration({ hr: hours, min: minutes, sec: seconds });
    if (intervalId) clearInterval(intervalId);
    setIsRunning(false);
    setSeconds(0);
    setMinutes(0);
    setHours(0);
  };

  const handleSaveNewTask = async () => {
    try {
      console.log("name : ",titleName)
      console.log("category : ", titleCategory)
      console.log("duration : ",duration)
      setLoading(true);
      const res = await axios.post(
        `${baseUrl}/api/features/add-new-track`,
        {
          title: titleName,
          category: titleCategory,
          duration: (!duration || { hr: 0, min: 0, sec: 0 }) ,
          max_duration: {
            hr: maxDurationHr ,
            min: maxDurationMin ,
            sec: maxDurationSec ,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("success", "successfully created.");
      console.log(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error:", error.message);
      showToast("error", "Error: something went wrong");
    }
  };
  const handleSaveNewHabit = async () => {
    if (!habitFrequency) {
      showToast("warning", "Please Select Frequency");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${baseUrl}/api/features/create-habit`,
        {
          habitName: habitName,
          frequency: habitFrequency,
          description: habitDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("success", "successfully created.");
      console.log(res.data.data);
      setHabitDescription(null);
      setHabitFrequency(null);
      setHabitName(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error:", error.message);
      showToast("error", "Error: something went wrong");
    }
  };
  const handleSaveNewPassion = async () => {
    if (!passionFrequency) {
      showToast("warning", "Please Select Frequency");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${baseUrl}/api/features/create-passion`,
        {
          passionName: passionName,
          description: passionDescription,
          frequency: passionFrequency,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("success", "successfully created.");
      console.log(res.data.data);
      setPassionDescription(null);
      setPassionFrequency(null);
      setPassionName(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error:", error.message);
      showToast("error", "Error: something went wrong");
    }
  };

  // max duration
  const [maxDurationHr, setMaxDurationHr] = useState(0);
  const [maxDurationMin, setMaxDurationMin] = useState(30);
  const [maxDurationSec, setMaxDurationSec] = useState(0);

  return (
    <div className="flex  items-center justify-center h-screen bg-[#222831] text-white ">
      {/* mobile responsive design */}
      {/* PREMIUM MOBILE CREATE PANEL (copy-paste) */}
      <div className="lg:hidden flex flex-col items-center justify-between w-[90%] max-w-[480px] h-[95vh] bg-linear-to-b from-[#0f1114] via-[#16181b] to-[#22262a] rounded-3xl p-5 gap-6 shadow-[0_30px_80px_rgba(2,6,23,0.75)] border border-white/6 backdrop-blur-xl relative overflow-hidden">
        {/* Header */}
        <header className="w-full flex items-center justify-between px-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-[#FFD369] to-[#FBB03B]">
            Auramind
          </h1>

          {createWhat && (
            <button
              aria-label="Back"
              onClick={() => setCreateWhat(null)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/6 hover:bg-white/8 transition-shadow shadow-sm"
              title="Back"
            >
              <svg
                className="w-4 h-4 text-white/90"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm text-white/90 hidden sm:inline">
                Back
              </span>
            </button>
          )}
        </header>

        {/* Panel Card */}
        <div className="flex-1 w-full bg-[linear-gradient(180deg,#0f1215,rgba(20,22,25,0.6))] border border-white/6 rounded-2xl p-4 shadow-inner overflow-hidden flex flex-col">
          {/* Title & subtitle */}
          <div className="mb-3">
            <h2 className="text-xl font-semibold text-white/90">
              Create {createWhat ? `${createWhat.slice(3)}` : ""}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Choose one — make it legendary ✨
            </p>
          </div>

          {/* Options: Expandable Cards */}
          <div className="flex flex-col gap-3 mb-3">
            <AnimatePresence initial={false}>
              {/* Card: Task */}
              <motion.button
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCreateWhat("newTask")}
                className="w-full rounded-2xl p-3 bg-linear-to-r from-[#111417]/60 to-[#171a1f]/60 border border-white/6 flex items-center justify-between gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.45)] cursor-pointer"
                transition={{ type: "spring", stiffness: 340, damping: 22 }}
                aria-expanded={createWhat === "newTask"}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/6 flex items-center justify-center">
                    {/* small icon */}
                    <svg
                      className="w-6 h-6 text-[#FFD369]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">
                      Create Task
                    </div>
                    <div className="text-xs text-white/50">
                      Track focus sessions & records
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white/60">
                  {/* chevron */}
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.button>

              {/* Card: Habit */}
              <motion.button
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCreateWhat("newHabit")}
                className="w-full rounded-2xl p-3 bg-linear-to-r from-[#0f1720]/60 to-[#131821]/60 border border-white/6 flex items-center justify-between gap-3 shadow-[0_10px_30px_rgba(8,9,12,0.6)] cursor-pointer"
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 20,
                  overshootClamping: false,
                }}
                aria-expanded={createWhat === "newHabit"}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/6 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#62a9fa]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">
                      Create Habit
                    </div>
                    <div className="text-xs text-white/50">
                      Daily/Weekly rhythms
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white/60">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.button>

              {/* Card: Passion */}
              <motion.button
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCreateWhat("newPassion")}
                className="w-full rounded-2xl p-3 bg-linear-to-r from-[#111417]/60 to-[#171a1f]/60 border border-white/6 flex items-center justify-between gap-3 shadow-[0_8px_20px_rgba(0,0,0,0.5)] cursor-pointer"
                transition={{ type: "spring", stiffness: 360, damping: 24 }}
                aria-expanded={createWhat === "newPassion"}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/6 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#F54927]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 21s-7-4.35-9-7.5C1.95 11.55 4 6 8 6c2.16 0 3.92 1.5 4 3.5.08-2 1.84-3.5 4-3.5 4 0 6.05 5.55 5 7.5-2 3.15-9 7.5-9 7.5z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">
                      Create Passion
                    </div>
                    <div className="text-xs text-white/50">
                      Fun, long-term projects
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white/60">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.button>
            </AnimatePresence>
          </div>

          {/* Expand area: show form/controls for selected createWhat (keeps original logic untouched) */}
          <div className="mt-auto w-full overflow-y-auto">
            <AnimatePresence mode="wait">
              {createWhat === "newTask" && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 360, damping: 22 }}
                  className="w-full bg-linear-to-b from-[#0b0d0f]/60 to-[#121416]/60 
              border border-white/10 rounded-2xl p-4 shadow-xl 
              overflow-y-auto max-h-[70vh] mt-2 "
                >
                  {/* Title */}
                  <input
                    className="w-full bg-[#0f1215] px-4 py-3 rounded-full 
                 outline-none text-white placeholder:text-white/40 
                 border border-white/10"
                    type="text"
                    placeholder="Enter New Track Title"
                    onChange={(e) => setTitleName(e.target.value)}
                  />

                  {/* Category */}
                  <select
                    className="w-full mt-3 bg-[#0f1215] px-4 py-3 rounded-xl 
                 outline-none text-white border border-white/10"
                    onChange={(e) => setTitleCategory(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="Health">Health</option>
                    <option value="Work">Work</option>
                    <option value="Learning">Learning</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Social">Social</option>
                    <option value="Financial">Financial</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>

                  {/* Timer */}
                  <div
                    className="mt-4 flex flex-col items-center 
                    bg-[#0d0f11] text-white p-4 rounded-2xl 
                    shadow-inner border border-white/10"
                  >
                    <h3 className="text-lg font-semibold">Focus Timer</h3>

                    <div className="text-2xl font-mono my-3 tracking-widest">
                      {`${String(hours).padStart(2, "0")} : ${String(
                        minutes
                      ).padStart(2, "0")} : ${String(seconds).padStart(
                        2,
                        "0"
                      )}`}
                    </div>

                    <div className="flex gap-3">
                      {!isRunning ? (
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={startTimer}
                          className="px-4 py-2 rounded-xl 
                       bg-linear-to-r from-[#00ADB5] to-[#00F0FF] 
                       text-black font-semibold cursor-pointer"
                        >
                          Start
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={pauseTimer}
                          className="px-4 py-2 rounded-xl bg-amber-400 
                       text-black font-semibold cursor-pointer"
                        >
                          Pause
                        </motion.button>
                      )}

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={stopTimer}
                        className="px-4 py-2 rounded-xl bg-red-500 
                     text-white font-semibold cursor-pointer"
                      >
                        Stop
                      </motion.button>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleSaveNewTask}
                      className="mt-4 px-5 py-2 rounded-xl bg-green-500 
                   text-white font-semibold cursor-pointer"
                      type="button"
                    >
                      Save Task
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Habit / Passion blocks (if needed) — placeholders that keep your existing handlers */}
              {createWhat === "newHabit" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full bg-[#0d0f11] border border-white/6 rounded-2xl p-4"
                >
                  {/* Put your habit form fields here — kept intentionally light */}
                  <input
                    className="w-full bg-[#0f1215] px-4 py-3 rounded-full outline-none text-white placeholder:text-white/40 border border-white/5"
                    placeholder="Enter Habit Name"
                    onChange={(e) => setHabitName(e.target.value)}
                  />
                  <select
                    className="w-full mt-3 bg-[#0f1215] px-4 py-3 rounded-xl outline-none text-white border border-white/5"
                    onChange={(e) => setHabitFrequency(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Frequency
                    </option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSaveNewHabit?.()}
                    className="w-full mt-4 py-3 rounded-xl bg-linear-to-r from-[#00ADB5] to-[#00F0FF] text-black font-semibold cursor-pointer"
                  >
                    Create Habit
                  </motion.button>
                </motion.div>
              )}

              {createWhat === "newPassion" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full bg-[#0d0f11] border border-white/6 rounded-2xl p-4"
                >
                  <input
                    className="w-full bg-[#0f1215] px-4 py-3 rounded-full outline-none text-white placeholder:text-white/40 border border-white/5"
                    placeholder="Enter Passion Name"
                    onChange={(e) => setPassionName(e.target.value)}
                  />
                  <select
                    className="w-full mt-3 bg-[#0f1215] px-4 py-3 rounded-xl outline-none text-white border border-white/5"
                    onChange={(e) => setPassionFrequency(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Frequency
                    </option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSaveNewPassion?.()}
                    className="w-full mt-4 py-3 rounded-xl bg-linear-to-r from-[#F59E0B] to-[#F97316] text-black font-semibold cursor-pointer"
                  >
                    Create Passion
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* NAV BAR */}
        <nav className="w-full h-[10%] mt-2 rounded-2xl px-3 py-1 backdrop-blur-xl bg-[#111418]/50 border border-white/6 shadow-2xl">
          <div className="flex justify-between items-center h-full w-full">
            {[
              { label: "Home", path: "/" },
              { label: "Add", path: "/create" },
              { label: "Tasks", path: "/self-reflection" },
              { label: "Progress", path: "/analytics" },
              { label: "Profile", path: "/profile" },
            ].map((btn, key) => (
              <button
                key={`${key}`}
                onClick={() => navigate(btn.path)}
                className="flex flex-col justify-center items-center h-full w-full rounded-xl hover:bg-white/5 transition-all text-white/80 cursor-pointer"
                aria-label={btn.label}
              >
                <span className="text-sm mt-1">{btn.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* laptop */}
      <div className="hidden mt-18 w-[70%] h-[90%] lg:flex flex-col items-center   bg-[#0F1115] rounded-2xl p-5 gap-12">
        <motion.h1
          initial={{ opacity: 0, y: -40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
          className="text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-amber-200 to-yellow-500 drop-shadow-[0_2px_12px_rgba(251,176,59,0.15)] select-none"
        >
          AuraMind
        </motion.h1>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl">
            Add
            {createWhat &&
              ` -> ${
                createWhat.charAt(0).toUpperCase() + createWhat.slice(1, 3)
              } ${createWhat.slice(3)}`}
          </h2>
          {/* activeTrackInfo */}
          <AnimatePresence mode="wait">
            {createWhat && (
              <motion.button
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="flex items-center text-[#00ADB5] hover:text-[#EEEEEE] font-semibold px-3 py-1 rounded transition-colors duration-200 cursor-pointer"
                onClick={() => setCreateWhat(null)}
                aria-label="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        {!createWhat ? (
          <div className="flex justify-between items-center w-full h-full  rounded p-2">
            {/* new task */}
            <motion.button
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.6, ease: "easeOut" },
              }}
              whileHover={{
                scale: 1.05,
                rotate: 1,
                boxShadow: "0 0 25px rgba(18, 69, 198, 0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              className="relative w-1/3 h-64 rounded-2xl text-white flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden bg-linear-to-br from-[#1b1f25] to-[#222831] mx-5"
              onClick={() => setCreateWhat("newTask")}
              type="button"
            >
              {/* Animated Border Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: "2px solid transparent" }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(18,69,198,0.0)",
                    "0 0 15px rgba(18,69,198,0.4)",
                    "0 0 0px rgba(18,69,198,0.0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Gradient Icon */}
              <motion.svg
                className="w-20 h-20"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { delay: 0.15, duration: 0.4 },
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="gradient-card"
                    x1="2"
                    y1="12"
                    x2="22"
                    y2="12"
                  >
                    <stop offset="0" stopColor="#1245C6" />
                    <stop offset="1" stopColor="#9909B7" />
                  </linearGradient>
                </defs>

                {/* Top Bar with continuous horizontal translation */}
                <motion.rect
                  x="2"
                  y="4"
                  width="20"
                  height="3"
                  rx="1"
                  fill="url(#gradient-card)"
                  animate={{
                    x: [0, 5, 0],
                    opacity: [1, 0.4, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Middle Bar with continuous width pulsation */}
                <motion.rect
                  x="2"
                  y="10"
                  width="20"
                  height="3"
                  rx="1"
                  fill="url(#gradient-card)"
                  animate={{
                    width: [20, 20, 20],
                    x: [0, 5.2, 0],
                    opacity: [1, 0.4, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                />

                {/* Bottom Bar with continuous opacity pulse */}
                <motion.rect
                  x="2"
                  y="16"
                  width="20"
                  height="3"
                  rx="1"
                  fill="url(#gradient-card)"
                  animate={{
                    opacity: [1, 0.4, 1],
                    x: [0, 5.4, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                />
              </motion.svg>

              {/* Text */}
              <motion.h2
                className="text-2xl font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                New Task
              </motion.h2>
            </motion.button>

            {/* new habit */}

            <motion.button
              whileHover={{
                scale: 1.05,
                rotate: 1,
                boxShadow: "0 0 25px rgba(18, 69, 198, 0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              className="relative w-1/3 h-64 rounded-2xl text-white flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden bg-linear-to-br from-[#1b1f25] to-[#222831] mx-5"
              type="button"
              onClick={() => {
                setCreateWhat(null);
                setCreateWhat("newHabit");
              }}
            >
              {/* Animated Border Glow with hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ border: "2px solid transparent" }}
                initial={{ boxShadow: "0 0 0px 0px #1245c600" }}
                animate={{
                  boxShadow: [
                    "0 0 0px 0px #1245c600",
                    "0 0 15px 5px #1245c664",
                    "0 0 0px 0px #1245c600",
                  ],
                }}
                whileHover={{
                  boxShadow: "0 0 30px 10px #1245c6cc",
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.svg
                className="w-20 h-20"
                id="Line"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              >
                <title>1</title>
                <path
                  fill="#EEEEEE"
                  d="M56.561,22.42871a.99993.99993,0,0,0-1.85449.74809C63.72641,46.13262,36.82017,66.008,17.54078,50.95219l6.39965.26558a1,1,0,0,0,.083-1.998l-9.51217-.39453a1.00265,1.00265,0,0,0-1.03661,1.09766l.93847,9.4746a1.00009,1.00009,0,0,0,1.99023-.19731l-.71039-7.17C36.6332,69.189,66.35968,47.73546,56.561,22.42871Z"
                ></path>
                <path
                  fill="#EEEEEE"
                  d="M15.48633,15.20215c8.38743-8.73126,23.26229-9.36477,32.36006-1.436l-7.278.92335a1.00026,1.00026,0,0,0,.252,1.98437L50.121,15.4939a1.31182,1.31182,0,0,0,.481-.13739,1.04073,1.04073,0,0,0,.50194-1.13679L48.59766,5.03516a1.00033,1.00033,0,0,0-1.92968.52738l1.64074,6.01107c-9.89234-7.92767-25.4126-6.963-34.23641,2.21471A26.01541,26.01541,0,0,0,8.22363,41.60156a1.00007,1.00007,0,0,0,1.86426-.72462A24.01649,24.01649,0,0,1,15.48633,15.20215Z"
                ></path>
              </motion.svg>

              <motion.h2
                className="text-2xl font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                New Habit
              </motion.h2>
            </motion.button>

            {/* new passion */}
            <motion.button
              whileHover={{
                scale: 1.05,
                rotate: 1,
                boxShadow: "0 0 25px rgba(18, 69, 198, 0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              className="relative w-1/3 h-64 rounded-2xl text-white flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden bg-linear-to-br from-[#1b1f25] to-[#222831] mx-5"
              type="button"
              onClick={() => setCreateWhat("newPassion")}
            >
              {/* Animated Border Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: "2px solid transparent" }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(18,69,198,0.0)",
                    "0 0 15px rgba(18,69,198,0.4)",
                    "0 0 0px rgba(18,69,198,0.0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.svg
                className="w-20 h-20"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 100 100"
                enableBackground="new 0 0 100 100"
                xmlSpace="preserve"
              >
                <motion.path
                  initial={{ y: 0, opacity: 1 }}
                  animate={{
                    y: [0, -40, 0],
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  d="M35.22,37.64c4.6,4.5,9.58,8.85,14.78,12.96c5.21-4.11,10.18-8.46,14.78-12.96c4.62-4.52,5.92-6.36,6.3-8.92
                  c0.51-3.41-0.66-8.04-4.43-10.67c-1.01-0.71-4.63-2.91-8.76-1.49c-3.39,1.16-5.91,4.38-6.41,8.21c0,0.03-0.02,0.06-0.02,0.09
                  c-0.01,0.05-0.02,0.11-0.04,0.16c-0.01,0.05-0.03,0.09-0.05,0.13c-0.02,0.04-0.04,0.09-0.06,0.13c-0.03,0.05-0.05,0.09-0.08,0.14
                  c-0.02,0.03-0.05,0.07-0.07,0.1c-0.04,0.04-0.07,0.08-0.11,0.12c-0.03,0.03-0.06,0.05-0.09,0.08c-0.04,0.04-0.09,0.07-0.14,0.1
                  c-0.03,0.02-0.06,0.04-0.09,0.06c-0.05,0.03-0.11,0.05-0.17,0.08c-0.03,0.01-0.06,0.03-0.1,0.04c-0.06,0.02-0.13,0.03-0.19,0.05
                  c-0.02,0-0.05,0.01-0.07,0.02c-0.01,0-0.02,0-0.03,0c-0.05,0.01-0.11,0.01-0.16,0.01c-0.06,0-0.11,0-0.16-0.01
                  c-0.01,0-0.02,0-0.03,0c-0.02,0-0.05-0.01-0.07-0.02c-0.06-0.01-0.13-0.02-0.19-0.04c-0.04-0.01-0.07-0.03-0.11-0.04
                  c-0.05-0.02-0.1-0.04-0.15-0.07c-0.04-0.02-0.08-0.05-0.12-0.07c-0.04-0.03-0.08-0.06-0.12-0.09c-0.04-0.03-0.07-0.06-0.11-0.1
                  c-0.03-0.03-0.07-0.07-0.1-0.1c-0.03-0.04-0.06-0.08-0.09-0.12c-0.03-0.04-0.05-0.08-0.07-0.12c-0.02-0.05-0.04-0.09-0.06-0.14
                  c-0.02-0.04-0.04-0.08-0.05-0.13c-0.02-0.05-0.03-0.11-0.04-0.16c-0.01-0.03-0.02-0.06-0.02-0.09c-0.5-3.82-3.02-7.05-6.41-8.21
                  c-4.13-1.42-7.75,0.79-8.76,1.49c-3.77,2.64-4.94,7.26-4.43,10.67C29.3,31.28,30.6,33.11,35.22,37.64z"
                  fill="#F54927"
                ></motion.path>
                <path
                  d="M64.32,57.03l-5.83,2.11c-2.21,0.8-3.69,2.91-3.69,5.26v19.52h15.11v-8.72c0-0.53,0.28-1.02,0.73-1.29l17.69-10.61
                  c1.25-0.75,2.03-2.12,2.03-3.58V34.01c0-2.88-2.34-5.22-5.22-5.22s-5.22,2.34-5.22,5.22v8.54c0,0.96-0.21,1.9-0.58,2.76l2.54,2.54
                  c1.36,1.35,2.08,3.16,2.04,5.07c-0.04,1.92-0.83,3.69-2.24,4.99l-6.63,6.12c-0.29,0.27-0.65,0.4-1.02,0.4c-0.4,0-0.81-0.16-1.1-0.48
                  c-0.56-0.61-0.53-1.56,0.08-2.12l6.63-6.12c0.8-0.74,1.26-1.75,1.28-2.84s-0.39-2.12-1.16-2.89l-2.19-2.19
                  c-0.2,0.17-0.4,0.34-0.62,0.49l-12.27,8.59C64.57,56.93,64.45,56.99,64.32,57.03z"
                  fill="#EEEEEE"
                ></path>
                <path
                  d="M11.67,63.29l17.69,10.61c0.45,0.27,0.73,0.76,0.73,1.29v8.72H45.2V64.4c0-2.35-1.48-4.46-3.69-5.26l-5.83-2.11
                  c-0.12-0.04-0.24-0.11-0.35-0.18l-12.27-8.59c-0.22-0.15-0.42-0.32-0.62-0.49l-2.19,2.19c-0.77,0.77-1.19,1.8-1.16,2.89
                  s0.47,2.1,1.28,2.84l6.63,6.12c0.61,0.56,0.65,1.51,0.08,2.12c-0.3,0.32-0.7,0.48-1.1,0.48c-0.36,0-0.73-0.13-1.02-0.4l-6.63-6.12
                  c-1.41-1.3-2.2-3.07-2.24-4.99c-0.04-1.92,0.69-3.72,2.04-5.07l2.54-2.54c-0.37-0.86-0.58-1.79-0.58-2.76v-8.54
                  c0-2.88-2.34-5.22-5.22-5.22s-5.22,2.34-5.22,5.22v25.71C9.64,61.17,10.42,62.54,11.67,63.29z"
                  fill="#EEEEEE"
                ></path>
              </motion.svg>
              <motion.h2
                className="text-2xl font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                New Passion
              </motion.h2>
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full h-full  rounded-b-2xl p-2">
            {createWhat === "newTask" ? (
              loading ? (
                <LoadingScreen />
              ) : (
                <div className="w-full h-full py-2">
                  {/* new title name */}
                  <input
                    className="w-full bg-[#222831] outline-none px-6 py-2 rounded-lg cursor-text"
                    type="text"
                    placeholder="Enter New Track Title"
                    onChange={(e) => setTitleName(e.target.value)}
                  />
                  {/* category selection */}
                  <select
                    className="w-full bg-[#222831] outline-none px-3 py-2 mt-4 rounded-lg cursor-pointer"
                    onChange={(e) => setTitleCategory(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="Health">Health</option>
                    <option value="Work">Work</option>
                    <option value="Learning">Learning</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Social">Social</option>
                    <option value="Financial">Financial</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>

                  {/* max duration setup */}
                  <div className="flex flex-wrap gap-3 mt-4 mb-4 items-center">
                    <label className="text-white/70 text-sm font-semibold">
                      Max Duration:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      placeholder="hr"
                      value={maxDurationHr}
                      onChange={(e) => setMaxDurationHr(Number(e.target.value))}
                      className="w-20 bg-[#222831] text-white rounded-lg px-3 py-2 border border-white/20 text-center shadow-inner outline-none"
                    />
                    <span className="text-white/50">hr</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="min"
                      value={maxDurationMin}
                      onChange={(e) =>
                        setMaxDurationMin(Number(e.target.value))
                      }
                      className="w-20 bg-[#222831] text-white rounded-lg px-3 py-2 border border-white/20 text-center shadow-inner outline-none"
                    />
                    <span className="text-white/50">min</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="sec"
                      value={maxDurationSec}
                      onChange={(e) =>
                        setMaxDurationSec(Number(e.target.value))
                      }
                      className="w-20 bg-[#222831] text-white rounded-lg px-3 py-2 border border-white/20 text-center shadow-inner outline-none"
                    />
                    <span className="text-white/50">sec</span>
                  </div>

                  {/* Timer Section */}
                  <div className="mt-6 flex flex-col items-center bg-[#222831] text-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-3">Focus Timer</h2>
                    <div className="flex justify-between items-center w-full">
                      {/* Time Display */}
                      <div className="text-5xl font-mono mb-4 tracking-widest">
                        {`${String(hours).padStart(2, "0")} : ${String(
                          minutes
                        ).padStart(2, "0")} : ${String(seconds).padStart(
                          2,
                          "0"
                        )}`}
                      </div>

                      {/* Control Buttons */}
                      <div className="flex flex-col items-center gap-2 bg-[#0F1115] px-2 py-6 rounded-2xl w-1/3 font-bold shadow-[0_0_20px_#00ADB522] transition-all duration-300">
                        {!isRunning ? (
                          <button
                            onClick={startTimer}
                            className="flex items-center gap-2 text-black px-5 rounded 
                            w-full justify-center text-lg bg-linear-to-r from-green-400 via-emerald-500 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] hover:scale-105 
                            active:scale-95 transition-all duration-300 cursor-pointer"
                          >
                            <FaPlay /> Start
                          </button>
                        ) : (
                          <button
                            onClick={pauseTimer}
                            className="flex items-center gap-2 text-black px-5 rounded 
                            w-full justify-center text-lg bg-linear-to-r from-yellow-400 via-amber-500 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:shadow-[0_0_30px_rgba(251,191,36,0.9)] hover:scale-105 
                            active:scale-95 transition-all duration-300 cursor-pointer"
                          >
                            <FaPause /> Pause
                          </button>
                        )}

                        <button
                          onClick={stopTimer}
                          className="flex items-center gap-2  text-white px-5  rounded 
               w-full justify-center text-lg 
                hover:scale-105 
               active:scale-95 transition-all duration-300 cursor-pointer  bg-linear-to-r from-red-500 via-rose-600 to-pink-700 shadow-[0_0_20px_rgba(239,68,68,0.6)]
hover:shadow-[0_0_35px_rgba(244,63,94,0.9)]"
                        >
                          <span className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="inline-block h-5 w-5 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Stop
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Timer data Save Button */}

                  <div className="flex justify-center items-center">
                    <AnimatePresence>
                      {(duration?.hr > 0 ||
                        duration?.min > 0 ||
                        duration?.sec > 0) && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: { duration: 0.6, ease: "easeOut" },
                          }}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 20px rgba(0,173,181,0.7)",
                          }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSaveNewTask()}
                          className="relative w-1/2 mt-6 py-2.5 rounded-lg text-lg font-semibold text-white tracking-wide cursor-pointer
bg-linear-to-r from-[#00ADB5] to-[#00BCD4]
shadow-[0_0_12px_rgba(0,173,181,0.4)]
overflow-hidden group transition-all duration-500 ease-in-out"
                          type="button"
                          aria-label="Save"
                        >
                          {/* Shimmer Overlay */}
                          <motion.span
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                            initial={{ x: "-150%" }}
                            animate={{ x: ["-150%", "150%"] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                              repeatDelay: 2,
                            }}
                            aria-hidden="true"
                          />

                          {/* Continuous Glow Pulse */}
                          <motion.span
                            className="absolute inset-0 rounded-lg"
                            animate={{
                              boxShadow: [
                                "0 0 12px rgba(0,173,181,0.4)",
                                "0 0 20px rgba(0,173,181,0.8)",
                                "0 0 12px rgba(0,173,181,0.4)",
                              ],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            aria-hidden="true"
                          />

                          <span className="relative z-10 text-xl gap-2">
                            {`${String(duration.hr).padStart(
                              2,
                              "0"
                            )} : ${String(duration.min).padStart(
                              2,
                              "0"
                            )} : ${String(duration.sec).padStart(2, "0")}`}
                            <span className="mx-2">Save</span>
                          </span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Skip Button */}
                  <div className="flex justify-center items-center">
                    <AnimatePresence mode="wait">
                      {isRunning === false &&
                        duration &&
                        Object.keys(duration).length >= 0 && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: { duration: 0.6, ease: "easeOut" },
                            }}
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 0 20px rgba(0,173,181,0.7)",
                            }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              handleSaveNewTask();
                              if (intervalId) clearInterval(intervalId);
                              setSeconds(0);
                              setMinutes(0);
                              setHours(0);
                              setDuration({});
                              setIsRunning(false);
                            }}
                            className="relative w-1/2 mt-6 py-2.5 rounded-lg text-lg font-semibold text-white tracking-wide cursor-pointer
      bg-linear-to-r from-[#00ADB5] to-[#00BCD4]
      shadow-[0_0_12px_rgba(0,173,181,0.4)]
      overflow-hidden group transition-all duration-500 ease-in-out"
                            type="button"
                            aria-label="Save"
                          >
                            {/* Shimmer Overlay */}
                            <motion.span
                              className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                              initial={{ x: "-150%" }}
                              animate={{ x: ["-150%", "150%"] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                                repeatDelay: 2,
                              }}
                              aria-hidden="true"
                            />

                            {/* Continuous Glow Pulse */}
                            <motion.span
                              className="absolute inset-0 rounded-lg"
                              animate={{
                                boxShadow: [
                                  "0 0 12px rgba(0,173,181,0.4)",
                                  "0 0 20px rgba(0,173,181,0.8)",
                                  "0 0 12px rgba(0,173,181,0.4)",
                                ],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              aria-hidden="true"
                            />

                            <span className="relative z-10 text-xl">Skip</span>
                          </motion.button>
                        )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            ) : createWhat === "newHabit" ? (
              loading ? (
                <LoadingScreen />
              ) : (
                <div className="w-full h-full py-2 flex flex-col gap-5 items-center">
                  <input
                    className="w-full bg-[#222831] outline-none px-6 py-2 rounded-full cursor-text"
                    type="text"
                    placeholder="Enter Habit Name"
                    onChange={(e) => setHabitName(e.target.value)}
                  />
                  <select
                    className="w-full bg-[#222831] outline-none px-3 py-2 rounded-lg cursor-pointer"
                    onChange={(e) => setHabitFrequency(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Frequency
                    </option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  {/* description */}
                  <textarea
                    className="w-full bg-[#222831] outline-none px-3 py-2  rounded-lg cursor-text resize-none"
                    placeholder="Enter Description"
                    rows={3}
                    onChange={(e) => setHabitDescription(e.target.value)}
                  />

                  {/* create button */}
                  <div className="flex justify-center items-center w-full">
                    <AnimatePresence mode="wait">
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { duration: 0.6, ease: "easeOut" },
                        }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 0 20px rgba(0,173,181,0.7)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSaveNewHabit()}
                        className="relative w-1/2 mt-6 py-2.5 rounded-lg text-lg font-semibold text-white tracking-wide cursor-pointer
      bg-linear-to-r from-[#00ADB5] to-[#00BCD4]
      shadow-[0_0_12px_rgba(0,173,181,0.4)]
      overflow-hidden group transition-all duration-500 ease-in-out"
                        type="button"
                        aria-label="Save"
                      >
                        {/* Shimmer Overlay */}
                        <motion.span
                          className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: "-150%" }}
                          animate={{ x: ["-150%", "150%"] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 2,
                          }}
                          aria-hidden="true"
                        />

                        {/* Continuous Glow Pulse */}
                        <motion.span
                          className="absolute inset-0 rounded-lg"
                          animate={{
                            boxShadow: [
                              "0 0 12px rgba(0,173,181,0.4)",
                              "0 0 20px rgba(0,173,181,0.8)",
                              "0 0 12px rgba(0,173,181,0.4)",
                            ],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          aria-hidden="true"
                        />

                        <span className="relative z-10 text-xl">Create</span>
                      </motion.button>
                    </AnimatePresence>{" "}
                  </div>
                </div>
              )
            ) : createWhat === "newPassion" ? (
              loading ? (
                <LoadingScreen />
              ) : (
                <div className="w-full h-full flex flex-col gap-5 items-center py-2">
                  <input
                    className="w-full bg-[#222831] outline-none px-6 py-2 rounded-full cursor-text"
                    type="text"
                    placeholder="Enter Passion Name"
                    onChange={(e) => setPassionName(e.target.value)}
                  />
                  <select
                    className="w-full bg-[#222831] outline-none px-3 py-2  rounded-lg cursor-pointer"
                    onChange={(e) => setPassionFrequency(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Frequency
                    </option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  {/* description */}
                  <textarea
                    className="w-full bg-[#222831] outline-none px-3 py-2 rounded-lg cursor-text resize-none"
                    placeholder="Enter Description"
                    rows={3}
                    onChange={(e) => setPassionDescription(e.target.value)}
                  />

                  {/* create button */}
                  <div className="flex justify-center items-center w-full">
                    <AnimatePresence mode="wait">
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { duration: 0.6, ease: "easeOut" },
                        }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 0 20px rgba(0,173,181,0.7)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSaveNewPassion()}
                        className="relative w-1/2 mt-6 py-2.5 rounded-lg text-lg font-semibold text-white tracking-wide cursor-pointer
      bg-linear-to-r from-[#00ADB5] to-[#00BCD4]
      shadow-[0_0_12px_rgba(0,173,181,0.4)]
      overflow-hidden group transition-all duration-500 ease-in-out"
                        type="button"
                        aria-label="Save"
                      >
                        {/* Shimmer Overlay */}
                        <motion.span
                          className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: "-150%" }}
                          animate={{ x: ["-150%", "150%"] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 2,
                          }}
                          aria-hidden="true"
                        />

                        {/* Continuous Glow Pulse */}
                        <motion.span
                          className="absolute inset-0 rounded-lg"
                          animate={{
                            boxShadow: [
                              "0 0 12px rgba(0,173,181,0.4)",
                              "0 0 20px rgba(0,173,181,0.8)",
                              "0 0 12px rgba(0,173,181,0.4)",
                            ],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          aria-hidden="true"
                        />

                        <span className="relative z-10 text-xl">Create</span>
                      </motion.button>
                    </AnimatePresence>{" "}
                  </div>
                </div>
              )
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateNew;
