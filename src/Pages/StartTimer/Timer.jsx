import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../Components/Utils/ToastService";
import AlarmTimer from "../../Components/AlarmTimer/AlarmTimer";

function Timer() {
  const [time, setTime] = useState({ hr: 0, min: 0, sec: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [lastTrack, setLastTrack] = useState(null);
  const [tracks, setTracks] = useState(null);
  const timerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("jwtToken");
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [activateQuestions, setActivateQuestions] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const navigate = useNavigate();
  // store
  const reduxUser = useSelector((state) => state.user.user);
  // console.log("redux user:",reduxUser[0]._id)
  // const reduxTrack=useSelector((state)=>state.activeTrack.activeTrack)
  const { activeTrack, isPlaying } = useSelector((state) => state.activeTrack);
  const [showBreak, SetshowBreak] = useState(false);
  // console.log("redux track:", activeTrack);
  // console.log("redux User :",reduxUser)

  const formatTime = (num) => String(num).padStart(2, "0");

  const handleStartPause = () => {
    if (isRunning) {
      // Pause timer
      clearInterval(timerRef.current);
      setIsRunning(false);
      SetshowBreak(true);
    } else {
      // Start timer
      setIsRunning(true);
      setStopClicked(false);
      SetshowBreak(false);
      // setSaveClicked(false);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          let { hr, min, sec } = prevTime;
          sec += 1;
          if (sec === 60) {
            sec = 0;
            min += 1;
          }
          if (min === 60) {
            min = 0;
            hr += 1;
          }
          return { hr, min, sec };
        });
      }, 1000);
    }
  };

  const handleStop = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setLastTrack(time); // save the tracked duration
    setStopClicked(true);
    SetshowBreak(false);
    setTime({ hr: 0, min: 0, sec: 0 });
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const [saveClicked, setSaveClicked] = useState(false);
  const handleSave = async () => {
    // if (saveClicked) {
    setSaveClicked(!saveClicked);
    // }
    // Check if saved duration is greater than the last tracked duration; alert the user if so
    if (
      activeTrack.duration.hr > lastTrack.hr ||
      activeTrack.duration.min > lastTrack.min ||
      activeTrack.duration.sec > lastTrack.sec
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${backendURL}/api/features/update-tracks/${activeTrack._id}`,
        { duration: lastTrack },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.data);
      setTracks(response.data.data);
      setActivateQuestions(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tracks:", error.message);
      setIsLoading(false);
    }
  };

  const handleTrackCompletion = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${backendURL}/api/features/answers-completed/${activeTrack._id}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("track completed response : ", response.data.data);
      {
        /* success toast */
      }
      alert("successful");

      navigate("/");

      setIsLoading(false);
    } catch (error) {
      console.error("Error updating tracks questions data:", error);
      setIsLoading(false);
      showToast(error, 404);
    }
  };

  const questions = [
    {
      id: "quest1",
      text: "How does this activity benefit you or make you feel better?",
    },
    { id: "quest2", text: "What inspires you to do this work" },
    {
      id: "quest3",
      text: "How do you think this helps you move closer to your goals or dreams?",
    },
    {
      id: "quest4",
      text: "If you look back 10 years from now, do you think you’ll feel proud or grateful for doing this?",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stopClicked, setStopClicked] = useState(false);

  const handleAnswerChange = (e) => {
    setQuestionAnswers({
      ...questionAnswers,
      [questions[currentIndex].id]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // alert("All questions answered");
      handleTrackCompletion();
      // console.log("Answers:", questionAnswers);
    }
  };

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (
      (stopClicked && saveClicked && activeTrack.duration.hr > lastTrack?.hr) ||
      activeTrack.duration.min > lastTrack?.min ||
      activeTrack.duration.sec > lastTrack?.sec
    ) {
      showToast(
        "warning",
        `Duration is less than your previous save (${activeTrack.duration.hr}:${activeTrack.duration.min}:${activeTrack.duration.sec})`
      );
    }
  }, [saveClicked]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#222831] text-white">
      {/* mobile */}
      <div className="lg:hidden flex flex-col items-center justify-between w-[90%] max-w-[480px] h-[95vh] bg-linear-to-b from-[#1B1E22] to-[#2A2F35] rounded-3xl p-6 gap-8 shadow-[0_0_40px_rgba(0,0,0,0.45)] border border-white/10 backdrop-blur-xl relative overflow-hidden">
        {/* HEADER */}
      <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-linear-to-r from-[#FFD369] to-[#FBB03B] drop-shadow-lg">
        Auramind
      </h1>

       {/* MAIN CARD */}
       <div className="flex flex-col items-center justify-between w-full h-full bg-[#211E28]/40 border border-white/6 rounded-3xl shadow-inner overflow-hidden backdrop-blur-xl">
       {/* TOP BAR */}
       <div className="flex justify-between items-center w-full p-4">
          <h1 className="text-left w-full text-2xl font-semibold text-white/90">{!activateQuestions ? "Tracks" : "Questions"}</h1>

          <AnimatePresence >
            {!activateQuestions && (
              <motion.button
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.36, type: "spring" }}
                className="flex items-center text-[#00F0FF] hover:text-white font-semibold px-4 py-1 rounded-xl bg-white/5 backdrop-blur-lg shadow-lg border border-white/10 cursor-pointer"
                onClick={() => navigate("/")}
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </motion.button>
            )}
          </AnimatePresence>
        </div>
          

         {/* CONTENT AREA */}
        <div className="flex flex-col gap-3 items-center w-full h-full border-t border-white/5 rounded-b-3xl py-3 px-2 overflow-y-auto custom-scroll relative">
            <AnimatePresence>
            {!activateQuestions ? (
              
              <motion.div initial={{opacity:0}} animate={{opacity:1, transition:{duration:.5}}} className="first_Container bg-[#211E28]/40 w-full h-full flex flex-col justify-center items-center py-6 border-t border-white/5 rounded-b-3xl px-2">
                <h1 className="mt-5 text-2xl">Setup New Record</h1>

                {/* Start / Pause Button */}
                <motion.button
                  type="button"
                  className="mt-5 cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={handleStartPause}
                  tabIndex={0}
                  aria-label={isRunning ? "Pause timer" : "Start timer"}
                >
                  {isRunning ? (
                    // Pause icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 100 100"
                      height={192}
                      width={192}
                      fill="#00ADB5"
                    >
                      <rect
                        x="30"
                        y="25"
                        width="12"
                        height="50"
                        rx="3"
                        fill="#00ADB5"
                      />
                      <rect
                        x="58"
                        y="25"
                        width="12"
                        height="50"
                        rx="3"
                        fill="#00ADB5"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#EEEEEE"
                        strokeWidth="5"
                        fill="none"
                      />
                    </svg>
                  ) : (
                    // Play icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 100 100"
                      height={192}
                      width={192}
                      fill="#EEEEEE"
                    >
                      <polygon points="40,30 70,50 40,70" fill="#00ADB5" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#EEEEEE"
                        strokeWidth="5"
                        fill="none"
                      />
                    </svg>
                  )}
                </motion.button>

                {/* Timer Display */}
                <h1
                  className={`mt-5 text-3xl font-mono ${
                    time.hr < activeTrack.duration.hr ||
                    (time.hr === activeTrack.duration.hr &&
                      (time.min < activeTrack.duration.min ||
                        (time.min === activeTrack.duration.min &&
                          time.sec < activeTrack.duration.sec)))
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {`${formatTime(time.hr)}:${formatTime(time.min)}:${formatTime(
                    time.sec
                  )}`}
                </h1>

                {/* Stop Button */}
                <AnimatePresence>
                  {isRunning && (
                    <motion.button
                      
                      onClick={handleStop}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0, y: 25 }}
                      whileHover={{ scale: 1.05, backgroundColor: "#363e4c" }}
                      whileTap={{ scale: 0.97 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="flex items-center gap-2 px-6 py-3 mt-8 rounded-xl bg-[#222831] text-[#EEEEEE] font-bold text-lg shadow-md border-2 border-[#00ADB5] focus:outline-none cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#EEEEEE"
                        strokeWidth={2}
                      >
                        <rect
                          x="6"
                          y="6"
                          width="12"
                          height="12"
                          rx="3"
                          fill="#EEEEEE"
                        />
                      </svg>
                      Stop
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Show track summary */}
                {lastTrack && (
                  <motion.div
                    className="mt-8 p-4 bg-[#00ADB5] text-[#222831] rounded-xl shadow-md text-lg font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Last Track:
                    {`${formatTime(lastTrack.hr)}:${formatTime(
                      lastTrack.min
                    )}:${formatTime(lastTrack.sec)}`}
                  </motion.div>
                )}
                {/* break timer */}
                {!isRunning && showBreak && (
                  <div className="mt-5">
                    <AlarmTimer cn={"w-full mt-4"} />
                  </div>
                )}

                {/* save data */}
                {lastTrack && (
                  <motion.button
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    whileHover={{ scale: 1.05, backgroundColor: "#06c4cc" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    className="flex justify-center items-center gap-2 w-full py-3 mt-4 rounded-xl bg-[#41DC1E] text-[#EEEEEE] font-bold text-lg shadow-md border-2 border-[#222831] focus:outline-none cursor-pointer"
                    onClick={handleSave}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#EEEEEE"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div initial={{opacity:0}} animate={{opacity:1, transition:{duration:.5}}}  className="second_Container bg-[#222831] w-full h-full flex flex-col items-center py-6 rounded-2xl px-2 scroll-auto">
                <div className="w-full max-w-xl bg-[#393E46] p-6 rounded-2xl shadow-lg flex flex-col gap-4 overflow-hidden relative">
                  {/* Animated question box */}
                  <AnimatePresence mode="wait">
                    <motion.div
                    
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="flex flex-col gap-4"
                    >
                      <h2 className="text-xl font-semibold  text-white w-full text-left">
                        Q. {currentQuestion.text}
                      </h2>

                      <motion.textarea
                       
                        className="w-full p-3 resize-none rounded-lg bg-[#222831] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                        rows={4}
                        placeholder="Type your answer here..."
                        value={questionAnswers[currentQuestion.id] || ""}
                        onChange={handleAnswerChange}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      />

                      <motion.button
                        onClick={() => {
                          // Only call handleNext if there is an answer
                          if (
                            questionAnswers[currentQuestion.id] &&
                            questionAnswers[currentQuestion.id].trim() !== ""
                          ) {
                            handleNext();
                          }
                        }}
                        className="bg-[#00ADB5] hover:bg-[#05c1cc] text-white py-2 rounded-lg font-medium cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {currentIndex < questions.length - 1
                          ? "Next Question →"
                          : "Finish ✅"}
                      </motion.button>
                      <motion.div
                        className="mt-4 flex flex-col items-center w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {/* Progress bar with animation */}
                        <div className="w-full bg-[#393E46] rounded-full h-2.5 mb-2 overflow-hidden">
                          <motion.div
                            className="bg-[#00ADB5] h-2.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                ((currentIndex + 1) / questions.length) * 100
                              }%`,
                            }}
                            transition={{
                              duration: 0.5,
                              ease: "easeInOut",
                            }}
                          />
                        </div>

                        <motion.span
                          className="text-sm text-gray-400 text-center"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Question {currentIndex + 1} of {questions.length}
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>

        {/* NAV BAR */}
      <div className="navigation_btns w-full h-[10%] border border-white/10 rounded-2xl px-3 py-1 backdrop-blur-xl bg-[#1F242A]/50 shadow-2xl">
        <div className="flex justify-between items-center h-full w-full">
          {[
            { label: "Home", path: "/" },
            { label: "Add", path: "/create" },
            { label: "Tasks", path: "/self-reflection" },
            { label: "Progress", path: "/analytics" },
            { label: "Profile", path: "/profile" },
          ].map((btn,key2) => (
            <button
            key={`${key2}`}
              onClick={() => navigate(btn.path)}
              className="flex flex-col justify-center items-center h-full w-full rounded-xl hover:bg-white/5 transition-all text-white/80 cursor-pointer"
            >
              <span className="text-sm mt-1">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
      </div>
      {/* laptop */}
      {!activateQuestions ? (
        <div className="hidden lg:flex flex-col items-center  w-[85%] h-[90%] bg-[#0F1115] rounded-2xl p-5 gap-12 mt-18">
          <motion.h1
            initial={{ opacity: 0, y: -40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
            className="text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-amber-200 to-yellow-500 drop-shadow-[0_2px_12px_rgba(251,176,59,0.15)] select-none"
          >
            AuraMind
          </motion.h1>
          <div className="flex items-center justify-between w-full  px-6">
            <motion.h1
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 90 }}
              className={`text-9xl font-bold ${
                time.hr < activeTrack.duration.hr ||
                (time.hr === activeTrack.duration.hr &&
                  (time.min < activeTrack.duration.min ||
                    (time.min === activeTrack.duration.min &&
                      time.sec < activeTrack.duration.sec)))
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {`${formatTime(time.hr)}:${formatTime(time.min)}:${formatTime(
                time.sec
              )}`}
            </motion.h1>

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 80,
                  damping: 12,
                }}
                className="bg-[#222831] py-5 px-3 flex flex-col items-center justify-center w-1/3 rounded-xl gap-3 shadow-[0_0_25px_rgba(0,173,181,0.15)]"
              >
                {/* Start / Pause Button */}
                <motion.button
                  type="button"
                  onClick={handleStartPause}
                  className={`w-full text-white font-semibold tracking-wide rounded  
    flex items-center justify-center gap-2 hover:text-2xl
    transition-all duration-500 ease-in-out cursor-pointer
    ${
      isRunning
        ? "bg-linear-to-r from-yellow-400 via-amber-500 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:shadow-[0_0_30px_rgba(251,191,36,0.9)]"
        : "bg-linear-to-r from-green-400 via-emerald-500 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)]"
    } `}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  {isRunning ? (
                    <>
                      {/* Pause Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-yellow-100 animate-pulse"
                      >
                        <rect x="6" y="4" width="4" height="16" rx="1.5" />
                        <rect x="14" y="4" width="4" height="16" rx="1.5" />
                      </svg>
                      <span className="">Pause</span>
                    </>
                  ) : (
                    <>
                      {/* Play Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-emerald-100 drop-shadow animate-pulse"
                      >
                        <polygon points="8,5 19,12 8,19" />
                      </svg>
                      <span className="">Start</span>
                    </>
                  )}
                </motion.button>
                {/* Stop Button */}

                <motion.button
                  
                  onClick={handleStop}
                  className="w-full flex justify-center items-center gap-2 rounded bg-linear-to-r from-red-500 via-rose-600 to-pink-700 shadow-[0_0_20px_rgba(239,68,68,0.6)]
hover:shadow-[0_0_35px_rgba(244,63,94,0.9)]
 text-[#EEEEEE] font-bold cursor-pointer hover:text-2xl transition-all duration-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#EEEEEE"
                    strokeWidth={2}
                  >
                    <rect
                      x="6"
                      y="6"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#EEEEEE"
                    />
                  </svg>
                  Stop
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* break timer & save button*/}
          <AnimatePresence>
            {!isRunning && showBreak && (
              <motion.div
                className="mt-5 w-full"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              >
                <AlarmTimer cn={"w-full mt-4"} />
              </motion.div>
            )}

            {/* handle save */}
            {lastTrack && stopClicked && (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 60 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className={`text-9xl mt-44 font-bold text-green-500`}
                >
                  {`${formatTime(lastTrack.hr)}:${formatTime(
                    lastTrack.min
                  )}:${formatTime(lastTrack.sec)}`}
                </motion.h1>
                <motion.button
                  onClick={handleSave}
                  className="w-1/2  py-2.5 
    rounded-lg text-lg font-semibold text-white tracking-wide cursor-pointer
    bg-linear-to-r from-[#00ADB5] to-[#00BCD4]
    shadow-[0_0_10px_rgba(0,173,181,0.3)]
    hover:shadow-[0_0_18px_rgba(0,173,181,0.6)]
    transition-all duration-500 ease-in-out overflow-hidden
    hover:scale-[1.03] active:scale-[0.97] group"
                >
                  {/* Shimmer overlay */}
                  <span
                    className=" bg-linear-to-r from-transparent via-white/25 to-transparent
    opacity-0 group-hover:opacity-100 translate-x-[-200%] group-hover:translate-x-[200%]
    transition-all duration-[1.2s] ease-in-out"
                  ></span>

                  {/* Border glow */}
                  <span className=" rounded-lg border border-white/10 group-hover:border-cyan-300/40 transition-all"></span>

                  <span className=" z-10">Save</span>
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="hidden lg:flex  flex-col items-center  w-[85%] h-[90%] bg-[#0F1115] rounded-2xl p-5 gap-12 mt-18">
          <motion.h1
            initial={{ opacity: 0, y: -40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
            className="text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-amber-200 to-yellow-500 drop-shadow-[0_2px_12px_rgba(251,176,59,0.15)] select-none"
          >
            AuraMind
          </motion.h1>
          <div className="w-full bg-[#222831] p-6 rounded-2xl shadow-lg flex flex-col gap-4 overflow-hidden relative">
            {/* Animated question box */}
            <AnimatePresence mode="wait">
              <motion.div
               
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-2xl text-left text-white">
                  Q.{currentQuestion.text}
                </h2>

                <motion.textarea
                 
                  className="w-full p-3 resize-none rounded-lg bg-[#0F1115] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] h-88"
                  rows={4}
                  placeholder="Type your answer here..."
                  value={questionAnswers[currentQuestion.id] || ""}
                  onChange={handleAnswerChange}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />

                <div className="w-full flex justify-end items-end">
                  <motion.button
                    onClick={() => {
                      // Only call handleNext if there is an answer
                      if (
                        questionAnswers[currentQuestion.id] &&
                        questionAnswers[currentQuestion.id].trim() !== ""
                      ) {
                        handleNext();
                      }
                    }}
                    className="bg-[#00ADB5] hover:bg-[#05c1cc] text-white py-2 px-8 w-68 rounded-lg font-medium cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {currentIndex < questions.length - 1
                      ? "Next Question →"
                      : "Finish ✅"}
                  </motion.button>
                </div>
                <motion.div
                  className="mt-4 flex flex-col items-center w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Progress bar with animation */}
                  <div className="w-full bg-[#393E46] rounded-full h-2.5 mb-2 overflow-hidden">
                    <motion.div
                      className="bg-[#00ADB5] h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          ((currentIndex + 1) / questions.length) * 100
                        }%`,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                    />
                  </div>

                  <motion.span
                    className="text-sm text-gray-400 text-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Question {currentIndex + 1} of {questions.length}
                  </motion.span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
      )}
    </div>
  );
}

export default Timer;
