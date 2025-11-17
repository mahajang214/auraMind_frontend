import axios, { Axios } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../Components/Utils/ToastService";
import LoadingScreen from "../../Components/Utils/LoadingScreen.jsx";
import QuestionSection from "../../Components/Utils/QuestionSection.jsx";
import { FaArrowRight, FaArrowLeft, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { debugKey } from "../../Components/Debuger/DebugKeys.js";
function SelfReflextion() {
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.user.user);
  const [habits, setHabits] = useState(0);
  const [allHabits, setAllHabits] = useState(null);
  const [passions, setPassions] = useState(0);
  const [allPassions, setAllPassions] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [whatToDo, setWhatToDo] = useState(null);
  const [gems, setGems] = useState(0);
  const [ikigai, setIkigai] = useState({
    whatYouLove: "",
    whatTheWorldNeeds: "",
    whatYouAreGoodAt: "",
    whatYouCanBePayedFor: "",
    passion: "",
    profession: "",
    mission: "",
    vocation: "",
  });
  const getAllHabits = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/features/get-habits`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      // Count all properties if response.data.data is an object

      // console.log("Number of habits:", response.data.data[0].habits);

      setHabits(response.data.data[0].habits.length);
      setAllHabits(response.data.data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching Habits:", error);
      showToast("error", "Something went wrong.");
      setIsLoading(false);
    }
  };
  const getAllPassions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/features/get-passions`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      // Count all properties if response.data.data is an object
      const passionsCount = response.data.data
        ? Object.keys(response.data.data).length
        : 0;
      // console.log("Number of passions:", passionsCount);
      setPassions(passionsCount);
      setAllPassions(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching Passions:", error);
      showToast("error", "Something went wrong.");
      setIsLoading(false);
    }
  };
  // console.log("redux user: ",reduxUser)
  const getIkigai = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/features/get-ikigai`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data;
      setIkigai({
        whatYouLove: data.whatYouLove,
        whatTheWorldNeeds: data.whatTheWorldNeeds,
        whatYouAreGoodAt: data.whatYouAreGoodAt,
        whatYouCanBePayedFor: data.whatYouCanBePayedFor,
        passion: data.data.passion,
        profession: data.data.profession,
        mission: data.data.mission,
        vocation: data.data.vocation,
      });
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    getAllHabits();
    getAllPassions();
    setGems(reduxUser[0].gems);
    getIkigai();
    // console.log("gems",reduxUser[0].gems)
  }, []);

  const allQuestions = [
    "Who are you? Describe yourself in a few words.",
    "What are your greatest strengths or qualities?",
    "What are your weaknesses or things you wish to improve?",
    "How do you see yourself on the inside, and how do you want others to see you?",
    "What roles do you play in life — like a student, friend, family member, or professional?",
    "What are your biggest passions, habits, goals, or dreams?",
    "What does self-care mean to you, and how can you take better care of yourself?",
    "How confident do you feel about yourself? What could make you feel more confident?",
    "What life experiences have shaped you the most, and what did you learn from them?",
    "What are your core values and beliefs that guide your life?",
    "What actions or choices have helped you move closer to your goals or dreams?",
    "What habits are stopping you from achieving your dreams, and how can you change them?",
    "What are your biggest fears right now?",
    "Do you have any regrets from the past? What did they teach you, and do you want to live with regrets again?",
    "What’s something new you’ve learned about yourself recently?",
    "Who is the most precious or important person in your life, and why?",
    "Why are you the way you are? What made you like this?",
    "What old beliefs or negative habits are holding you back?",
    "What is the purpose of your life, and why do you think this is your purpose?",
    "What do you want to become in life, and why is it important to you? Who are you doing it for?",
    "What kind of legacy or impact do you want to leave behind for others?",
    "What promises or commitments have you made to yourself?",
  ];

  const deleteHabit = async (deleteId) => {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `${baseUrl}/api/features/delete-habit/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("delete habit : ", res.data.habits);
      showToast("success", "Successfully deleted.");
      setAllHabits((prev) => {
        const updated = [...prev];
        updated[0].habits = res.data.habits; // updated habits from backend
        return updated;
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showToast("error", "Error");
      console.log("Error deleting habit :", error.message);
    }
  };
  const deletePassion = async (passionId) => {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `${baseUrl}/api/features/delete-passion/${passionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("success", "Successfully deleted.");
      setAllPassions((prev) => ({
        ...prev,
        passions: res.data.passions,
      }));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showToast("error", "Error");
      console.log("Error deleting Passion :", error.message);
    }
  };

  // Pagination
  const [index, setIndex] = useState(0);
  const itemsPerPage = 3;

  const next = () => {
    if (index + itemsPerPage < allHabits[0].habits.length) {
      setIndex(index + itemsPerPage);
    }
  };

  const back = () => {
    if (index > 0) {
      setIndex(index - itemsPerPage);
    }
  };

  // passion
  const itemsPerPageP = 3; // show 2 cards at a time
  const [indexP, setIndexP] = useState(0);
  const passionsP = allPassions?.passions || [];
  const [directionP, setDirectionP] = useState(1); // for animation

  const nextP = () => {
    if (indexP < passionsP.length - itemsPerPageP) {
      setDirectionP(1);
      setIndexP(indexP + itemsPerPageP);
    }
  };

  const backP = () => {
    if (indexP > 0) {
      setDirectionP(-1);
      setIndexP(indexP - itemsPerPageP);
    }
  };

  // Slide animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.6 },
    }),
  };

  // ikigai

  const [showIkigaiPic, setShowIkigaiPic] = useState(false);
  const handleIkigaiChange = (key, value) => {
    setIkigai((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const fireIkigaiApi = async () => {
    if (
      !ikigai ||
      Object.values(ikigai).every(
        (val) => val === undefined || val === null || String(val).trim() === ""
      )
    ) {
      return;
    } else {
      try {
        // Replace the URL with your actual API endpoint
        await axios.patch(`${baseUrl}/api/features/update-ikigai`, ikigai, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showToast("success", "Successfully saved.");
        // Optionally: show a notification or update UI
      } catch (error) {
        // Handle the error gracefully, e.g., show error message
        console.error("Failed to save ikigai", error);
        showToast("error", "Failed to save");
      }
    }
  };

  return (
    <div className="flex  items-center justify-center h-screen bg-[#222831] text-white ">
      {/* mobile responsive design */}
      <div className="lg:hidden flex flex-col items-center justify-between w-[90%] max-w-[480px] h-[95vh] bg-linear-to-b from-[#1B1E22] to-[#2A2F35] rounded-3xl p-6 gap-8 shadow-[0_0_40px_rgba(0,0,0,0.45)] border border-white/10 backdrop-blur-xl relative overflow-hidden">
        {/* HEADER */}
        <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-linear-to-r from-[#FFD369] to-[#FBB03B] drop-shadow-lg">
          Auramind
        </h1>
        {/* MAIN CARD */}
        <div className="flex flex-col items-center justify-between w-full h-full bg-[#211E28]/40 border border-white/6 rounded-3xl shadow-inner overflow-hidden backdrop-blur-xl">
          {/* TOP BAR */}
          <div className="flex justify-between items-center w-full p-4">
            <h1 className="text-left w-full text-2xl font-semibold text-white/90">
              Self-Reflection {whatToDo && `->${whatToDo}`}
            </h1>

            <AnimatePresence >
              {whatToDo && (
                <motion.button
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.36, type: "spring" }}
                  className="flex items-center text-[#00F0FF] hover:text-white font-semibold px-4 py-1 rounded-xl bg-white/5 backdrop-blur-lg shadow-lg border border-white/10 cursor-pointer"
                  onClick={() => setWhatToDo(null)}
                  aria-label="Go back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
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

          {!whatToDo && (
            <div className="flex flex-col gap-2 items-center w-full h-full  bg-[#211E28]/40 border border-white/6 rounded-3xl shadow-inner overflow-hidden backdrop-blur-xl p-2 relative scroll-auto">
              {!habits && !passions ? (
                <LoadingScreen />
              ) : (
                <AnimatePresence>
                  {/* habits */}
                  <motion.button
                   
                    className="w-full h-12 bg-[#222831] rounded-lg text-white flex justify-between items-center px-3 my-1 cursor-pointer"
                    onClick={() => setWhatToDo("habits")}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <h2 className="text-sm font-medium">Habits</h2>
                    <h3 className={"text-green-500 font-semibold"}>
                      {habits !== undefined
                        ? habits?.toString().padStart(2, "0")
                        : "00"}
                    </h3>
                  </motion.button>

                  <motion.button
                   
                    className="w-full h-12 bg-[#222831] rounded-lg text-white flex justify-between items-center px-3 my-1 cursor-pointer"
                    onClick={() => setWhatToDo("passions")}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.07,
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <h2 className="text-sm font-medium">Passions</h2>
                    <h3 className="text-green-500 font-semibold">
                      {typeof passions === "number" && !isNaN(passions)
                        ? passions.toString().padStart(2, "0")
                        : "00"}
                    </h3>
                  </motion.button>

                  <motion.button
                   
                    className="w-full h-12 bg-[#222831] rounded-lg text-white flex justify-between items-center px-3 my-1 cursor-pointer"
                    onClick={() => setWhatToDo("whoAmI")}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.14,
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <h2 className="text-sm font-medium">Who Am I ?</h2>
                  </motion.button>

                  {/* ikigai */}
                  <motion.button
                    
                    className="w-full h-12 bg-[#222831] rounded-lg text-white flex justify-between items-center px-3 my-1 cursor-pointer"
                    onClick={() => setWhatToDo("ikigai")}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.14,
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <h2 className="text-sm font-medium">Ikigai</h2>
                  </motion.button>
                </AnimatePresence>
              )}
            </div>
          )}
          <AnimatePresence>
            {whatToDo === "habits" ? (
              isLoading ? (
                <LoadingScreen />
              ) : (
                <div className="flex flex-col gap-2 items-center w-full h-full bg-[#211E28]/40 border border-white/6 rounded-3xl shadow-inner overflow-hidden backdrop-blur-xl rounded-b-2xl p-2 relative scroll-auto">
                  {allHabits[0].habits.length > 0 ? (
                    allHabits[0].habits.map((item,key) => {
                      return (
                        <div
                        key={debugKey(`mob-${item._id}`, item, "ALL HABITS LIST")}
                          className="w-full min-h-12 bg-[#222831] rounded-lg text-white flex flex-col items-left px-4 my-2 cursor-pointer  transition-all duration-200 touch-manipulation"
                          style={{
                            fontSize: "1.1rem",
                            paddingTop: 12,
                            paddingBottom: 12,
                          }}
                          tabIndex={0}
                          aria-label={item.name}
                        >
                          <h2
                            className="text-base font-medium truncate text-left"
                            style={{ maxWidth: "90%" }}
                          >
                            Name : {item.name}
                          </h2>
                          <h2
                            className="text-base font-medium truncate text-left"
                            style={{ maxWidth: "90%" }}
                          >
                            Frequency : {item.frequency}
                          </h2>
                          <h2
                            className="text-base font-medium truncate text-left"
                            style={{ maxWidth: "90%" }}
                          >
                            description : {item.description}
                          </h2>
                        </div>
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full flex flex-col items-center justify-center py-8"
                    >
                      <span className="text-lg text-gray-400">
                        No habits created yet.
                      </span>
                    </motion.div>
                  )}
                </div>
              )
            ) : whatToDo === "passions" ? (
              isLoading ? (
                <LoadingScreen />
              ) : (
                <>
                  <div className="flex flex-col gap-2 items-center w-full h-full bg-[#211E28]/40 border border-white/6 rounded-3xl shadow-inner overflow-hidden backdrop-blur-xl p-2 relative scroll-auto">
                    {allPassions.passions.length > 0 ? (
                      allPassions.passions.map((item,key1) => {
                        return (
                          <div
                          key={debugKey(`mob-${item._id}`, item, "ALL PASSIONS LIST")}
                            className="w-full min-h-12 bg-[#222831] rounded-lg text-white flex flex-col items-left px-4 my-2 cursor-pointer  transition-all duration-200 touch-manipulation"
                            style={{
                              fontSize: "1.1rem",
                              paddingTop: 12,
                              paddingBottom: 12,
                            }}
                            tabIndex={0}
                            aria-label={item.name}
                          >
                            <h2
                              className="text-base font-medium truncate text-left"
                              style={{ maxWidth: "90%" }}
                            >
                              Name : {item.name}
                            </h2>
                            <h2
                              className="text-base font-medium truncate text-left"
                              style={{ maxWidth: "90%" }}
                            >
                              Frequency : {item.frequency}
                            </h2>
                            <h2
                              className="text-base font-medium truncate text-left"
                              style={{ maxWidth: "90%" }}
                            >
                              description : {item.description}
                            </h2>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full flex flex-col items-center justify-center py-8">
                        <span className="text-lg text-gray-400">
                          No Passions created yet.
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )
            ) : whatToDo === "whoAmI" ? (
              isLoading ? (
                <LoadingScreen />
              ) : (
                <div className="flex flex-col gap-2 items-center w-full h-full bg-[#211E28]/40 border border-white/6 rounded-3xl shadow-inner overflow-hidden backdrop-blur-xl rounded-b-2xl p-2 relative scroll-auto">
                  <QuestionSection gems={gems} allQuestions={allQuestions} />
                </div>
              )
            ) : whatToDo === "ikigai" ? (
              isLoading ? (
                <LoadingScreen />
              ) : (
                <>
                  <div className="overflow-y-auto  h-full w-full  bg-[#211E28]/40 border border-white/6 rounded-3xl shadow-inner overflow-hidden backdrop-blur-xl">
                    <AnimatePresence >
                      {/* input ikigai */}
                      {!showIkigaiPic && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          className="flex flex-col items-center justify-start w-full overflow-y-auto gap-6 p-4"
                        >
                          {/* 1. WHAT YOU LOVE */}
                          <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-md rounded-xl p-6 bg-[#FFF7C2] shadow-lg" // lighter & premium gold
                          >
                            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                              What you LOVE?
                            </h2>
                            <textarea
                              name="whatYouLove"
                              value={ikigai["whatYouLove"]}
                              onChange={(e) =>
                                handleIkigaiChange(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                              placeholder="Write your answer..."
                              className="w-full h-28 p-3 rounded-md border border-gray-300 bg-transparent text-gray-800 resize-none outline-none"
                            />
                          </motion.div>

                          {/* 2. WHAT THE WORLD NEEDS */}
                          <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-md rounded-xl p-6 bg-[#FFD6D6] shadow-lg" // rose quartz
                          >
                            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                              What the WORLD needs?
                            </h2>
                            <textarea
                              name="whatTheWorldNeeds"
                              value={ikigai["whatTheWorldNeeds"]}
                              onChange={(e) =>
                                handleIkigaiChange(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                              placeholder="Write your answer..."
                              className="w-full h-28 p-3 rounded-md border border-gray-300 bg-transparent text-gray-800 resize-none outline-none"
                            />
                          </motion.div>

                          {/* 3. WHAT YOU ARE GOOD AT */}
                          <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-md rounded-xl p-6 bg-[#E4F4D4] shadow-lg" // premium green
                          >
                            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                              What you are GOOD at?
                            </h2>
                            <textarea
                              name="whatYouAreGoodAt"
                              value={ikigai["whatYouAreGoodAt"]}
                              onChange={(e) =>
                                handleIkigaiChange(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                              placeholder="Write your answer..."
                              className="w-full h-28 p-3 rounded-md border border-gray-300 bg-transparent text-gray-800 resize-none outline-none"
                            />
                          </motion.div>

                          {/* 4. WHAT YOU CAN BE PAID FOR */}
                          <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-md rounded-xl p-6 bg-[#DDF3F5] shadow-lg" // soft aqua pearl
                          >
                            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                              What you can be PAID for?
                            </h2>
                            <textarea
                              name="whatYouCanBePayedFor"
                              value={ikigai["whatYouCanBePayedFor"]}
                              onChange={(e) =>
                                handleIkigaiChange(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                              placeholder="Write your answer..."
                              className="w-full h-28 p-3 rounded-md border border-gray-300 bg-transparent text-gray-800 resize-none outline-none"
                            />

                           
                          </motion.div>
                          <button
                            className="w-full mt-4 py-3 bg-linear-to-r from-green-400 via-emerald-400 to-teal-400 text-gray-900 font-bold rounded-xl shadow-xl hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 hover:text-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                            onClick={fireIkigaiApi}
                          >
                            <svg
                              className="w-5 h-5 text-emerald-600 mr-2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Save Ikigai 
                          </button>

                          {/* IKIGAI BUTTON */}
                          <motion.button
                            whileHover={{ scale: 1.035, backgroundColor: "#bbf7d0" }}
                            whileTap={{ scale: 0.97, backgroundColor: "#6ee7b7" }}
                            className="w-full max-w-xs py-3 mt-4 rounded-xl text-2xl font-bold bg-[#34d399] text-white shadow-lg duration-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            onClick={() => setShowIkigaiPic(true)}
                            aria-label="Show Ikigai Info"
                          >
                            Know IKIGAI
                          </motion.button>
                           
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {showIkigaiPic && (
                      <div className="flex justify-center items-center w-full h-full ">
                        <AnimatePresence>
                          {showIkigaiPic && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5 }}
                              className="w-full  flex  justify-center items-center relative  h-full"
                            >
                              <button
                                className="absolute flex top-8 right-0 bg-white bg-opacity-80 rounded-full  hover:bg-gray-200 transition p-3 focus:outline-none cursor-pointer text-red-500"
                                onClick={() => setShowIkigaiPic(false)}
                                aria-label="Close"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-red-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                              <img
                                className="w-2xl h-2xl object-contain"
                                src="https://stevelegler.com/wp-content/uploads/2019/02/Ikigai19.jpg"
                                alt="Ikigai diagram"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </>
              )
            ) : null}
          </AnimatePresence>
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
      <div className=" hidden mt-18 w-[70%] h-[90%] bg-[#0F1115] lg:flex flex-col items-center rounded-lg px-6 ">
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
            Tasks{" "}
            {whatToDo &&
              `-> ${whatToDo.charAt(0).toUpperCase() + whatToDo.slice(1)}`}
          </h2>

          <AnimatePresence >
            {whatToDo && (
              <motion.button
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="flex items-center text-[#00ADB5] hover:text-[#EEEEEE] font-semibold px-3 py-1 rounded transition-colors duration-200 cursor-pointer"
                onClick={() => setWhatToDo(null)}
                aria-label="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
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
        {!whatToDo && (
          <div className="w-full h-full flex flex-col items-center">
            <div className="flex justify-between items-center w-full h-1/2 ">
              <AnimatePresence >
                <motion.button
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow:
                      "0 0 24px 4px #00ADB5, 0 6px 32px rgba(0,173,181,0.15)",
                    borderColor: "#00ADB5",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full max-w-sm bg-[#222831] border border-[#393E46] rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-500 cursor-pointer focus:outline-none active:scale-[.98]"
                  onClick={() => setWhatToDo("habits")}
                  aria-label="Card Button"
                >
                  <motion.h3
                    className="text-xl font-semibold mb-2 text-center w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Habits
                  </motion.h3>
                  <motion.h1
                    className="text-9xl text-center w-full"
                    name={habits}
                    initial={{ scale: 0.9, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {habits !== undefined
                      ? habits?.toString().padStart(2, "0")
                      : "00"}
                  </motion.h1>
                </motion.button>
              </AnimatePresence>
              <AnimatePresence >
                <motion.button
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow:
                      "0 0 24px 4px #00ADB5, 0 6px 32px rgba(0,173,181,0.15)",
                    borderColor: "#00ADB5",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full max-w-sm bg-[#222831] border border-[#393E46] rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-500 cursor-pointer focus:outline-none active:scale-[.98]"
                  onClick={() => setWhatToDo("passions")}
                  aria-label="Card Button"
                >
                  <motion.h3
                    className="text-xl font-semibold mb-2 text-center w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Passions
                  </motion.h3>
                  <motion.h1
                    className="text-9xl text-center w-full"
                    key={habits}
                    initial={{ scale: 0.9, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {typeof passions === "number" && !isNaN(passions)
                      ? passions.toString().padStart(2, "0")
                      : "00"}
                  </motion.h1>
                </motion.button>
              </AnimatePresence>
            </div>
            <AnimatePresence >
              {/* who am i btn */}
              <motion.button
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
                whileHover={{
                  scale: 1.04,
                  boxShadow:
                    "0 0 24px 4px #00ADB5, 0 6px 32px rgba(0,173,181,0.15)",
                  borderColor: "#00ADB5",
                }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setWhatToDo("whoAmI")}
                className="w-full max-w-sm bg-[#222831] border border-[#393E46] rounded-t-xl hover:rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-500 cursor-pointer focus:outline-none active:scale-[.98]"
                aria-label="Card Button"
              >
                <motion.h3
                  className="text-2xl font-semibold text-center w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Who Am I ?
                </motion.h3>
              </motion.button>
              {/* ikigai */}
              <motion.button
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
                whileHover={{
                  scale: 1.04,
                  boxShadow:
                    "0 0 24px 4px #00ADB5, 0 6px 32px rgba(0,173,181,0.15)",
                  borderColor: "#00ADB5",
                }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setWhatToDo("ikigai")}
                className="w-full my-1 max-w-sm bg-[#222831] border border-[#393E46] rounded-b-xl hover:rounded-xl  shadow-lg p-6 flex flex-col items-start transition-all duration-500 cursor-pointer focus:outline-none active:scale-[.98]"
                aria-label="Card Button"
              >
                <motion.h3
                  className="text-2xl font-semibold text-center w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Ikigai
                </motion.h3>
              </motion.button>
            </AnimatePresence>
          </div>
        )}

        {whatToDo === "habits" ? (
          isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              {/* HABIT LIST */}
              <div className="flex flex-col gap-4 w-full  rounded-b-2xl p-4 overflow-hidden">
                {allHabits &&
                allHabits.length > 0 &&
                allHabits[0].habits &&
                allHabits[0].habits.length > 0 ? (
                  <div className="relative w-full h-auto  flex justify-between  py-10 items-center">
                    <AnimatePresence  custom={directionP}>
                      {allHabits[0].habits
                        .slice(index, index + itemsPerPage)
                        .map((item,key3) => (
                          <motion.div
                          key={debugKey(`lap-${item._id}`, item, "ALL HABITS LIST LAPTOP")}
                            custom={directionP}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            className="
                              group relative h-56 w-96 bg-[#222831] rounded-lg 
                              hover:rounded-t-3xl hover:rounded-b-none
                              text-white px-4 py-6 my-2
                              transition-all duration-500 
                              hover:bg-[#2d333b] 
                              hover:shadow-[0_0_10px_rgba(18,69,198,0.4)]
                              overflow-y-visible mx-auto
                            "
                          >
                            {/* Card Content */}
                            <div className="flex flex-col gap-1">
                              <h2 className="text-base font-medium truncate">
                                Name : {item.name}
                              </h2>
                              <h2 className="text-base font-medium truncate">
                                Frequency : {item.frequency}
                              </h2>
                              <h2 className="text-base font-medium truncate">
                                Description : {item.description}
                              </h2>
                            </div>

                            {/* Delete Button */}
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="
                                w-full bg-red-500 absolute left-0 rounded-b-3xl py-2 cursor-pointer
                                transition-all duration-500 z-10 flex items-center justify-center gap-2
                                opacity-0 group-hover:opacity-100
                                bottom-0 group-hover:-bottom-10 hover:text-xl
                              "
                              onClick={() => deleteHabit(item._id)}
                            >
                              <FaTrash /> Delete
                            </motion.button>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-8">
                    <span className="text-lg text-gray-400">
                      No habits created yet.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 px-8 w-full">
                {/* NEXT - BACK Buttons */}
                {/* {allHabits &&
                  allHabits.length > 0 &&
                  allHabits[0].habits &&
                  allHabits[0].habits.length > itemsPerPage && (
                    <div className="flex items-center justify-end w-full gap-4 h-full"> */}
                {/* Back */}
                <button
                  onClick={back}
                  disabled={index === 0}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md flex items-center gap-2
                            hover:bg-gray-600 transition disabled:opacity-40 cursor-pointer"
                >
                  <FaArrowLeft /> Back
                </button>

                {/* Next */}
                <button
                  onClick={next}
                  disabled={index + itemsPerPage >= allHabits[0].habits.length}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-md flex items-center gap-2
                            hover:bg-cyan-500 transition disabled:opacity-40 cursor-pointer"
                >
                  Next <FaArrowRight />
                </button>
              </div>
            </>
          )
        ) : whatToDo === "passions" ? (
          isLoading ? (
            <LoadingScreen />
          ) : (
            <div className="flex flex-col gap-4 w-full h-full  rounded-b-2xl p-4 overflow-hidden">
              {passionsP.length > 0 ? (
                <div className="relative w-full py-10 h-auto  flex justify-center  gap-3 items-center">
                  <AnimatePresence custom={directionP} >
                    {passionsP
                      .slice(indexP, indexP + itemsPerPageP)
                      .map((item,key4) => (
                        <motion.div
                        key={debugKey(`lap-${item._id}`, item, "ALL PASSIONS LIST LAPTOP")}
                          custom={directionP}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                        >
                          {/* CARD */}
                          <div
                            className="
                              group relative h-56 w-96 bg-[#222831] rounded-lg 
                              hover:rounded-t-3xl hover:rounded-b-none
                              text-white px-4 py-6 my-2
                              transition-all duration-500 
                              hover:bg-[#2d333b] 
                              hover:shadow-[0_0_10px_rgba(18,69,198,0.4)]
                              overflow-y-visible mx-auto
                            "
                          >
                            <div className="flex flex-col gap-1">
                              <h2 className="text-lg font-semibold truncate">
                                {item.name}
                              </h2>
                              <h2 className="text-sm truncate">
                                Frequency:{" "}
                                <span className="font-medium">
                                  {item.frequency}
                                </span>
                              </h2>
                              <h2 className="text-sm truncate">
                                Description:{" "}
                                <span className="font-medium">
                                  {item.description}
                                </span>
                              </h2>
                            </div>

                            {/* DELETE BUTTON */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="
                                w-full bg-red-500 absolute left-0 rounded-b-3xl py-2 cursor-pointer
                                transition-all duration-500 z-10 flex items-center justify-center gap-2
                                opacity-0 group-hover:opacity-100
                                bottom-0 group-hover:-bottom-10 hover:text-xl
                              "
                              onClick={() => deletePassion(item._id)}
                            >
                              <FaTrash /> Delete
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-10">
                  <span className="text-lg text-gray-400">
                    No Passions created yet.
                  </span>
                </div>
              )}

              {/* Next + Back buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={backP}
                  disabled={indexP === 0}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md flex items-center gap-2
                            hover:bg-gray-600 transition disabled:opacity-40 cursor-pointer"
                >
                  <FaArrowLeft /> Back
                </button>

                <button
                  onClick={nextP}
                  disabled={indexP >= passionsP.length - itemsPerPageP}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-md flex items-center gap-2
                            hover:bg-cyan-500 transition disabled:opacity-40 cursor-pointer"
                >
                  Next <FaArrowRight />
                </button>
              </div>
            </div>
          )
        ) : whatToDo === "whoAmI" ? (
          isLoading ? (
            <LoadingScreen />
          ) : (
            <div className="flex flex-col gap-2 items-center w-full h-full  rounded-b-2xl p-2 relative scroll-auto">
              <QuestionSection gems={gems} allQuestions={allQuestions} />
            </div>
          )
        ) : whatToDo === "ikigai" ? (
          isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              <AnimatePresence >
                {/* input ikigai */}
                {!showIkigaiPic && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                    }}
                    className="flex flex-col items-center justify-center w-full h-full"
                  >
                    <div className="flex items-center w-full justify-center">
                      {/* what u love */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`flex flex-col items-center justify-center rounded w-80 h-80 bg-[#FBF388] p-8 shadow-lg `}
                      >
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                          What you LOVE ?
                        </h2>

                        <textarea
                          name="whatYouLove"
                          placeholder="Write your answer here..."
                          value={ikigai["whatYouLove"]}
                          onChange={(e) =>
                            handleIkigaiChange(e.target.name, e.target.value)
                          }
                          className="w-full h-32 p-3 rounded-md border border-gray-400 outline-none bg-transparent text-gray-800 resize-none"
                        />
                      </motion.div>
                      {/* mission */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center  w-45 py-3 p-8 shadow-lg"
                        style={{
                          background:
                            "linear-gradient(to right, #FBF388, #F7B2AB)",
                        }}
                      >
                        <h2 className="text-xl font-bold text-gray-900  text-center">
                          Mission
                        </h2>
                        <textarea
                          name="mission"
                          placeholder="mission..."
                          value={ikigai["mission"]}
                          onChange={(e) =>
                            handleIkigaiChange(e.target.name, e.target.value)
                          }
                          className="w-full h-15 p-3 rounded-md border border-gray-400 outline-none bg-transparent  resize-none text-gray-800"
                        />
                      </motion.div>
                      {/* what the world needs */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`flex flex-col items-center justify-center rounded w-80 h-80 bg-[#F7B2AB] p-8 shadow-lg `}
                      >
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                          What the world NEEDS ?
                        </h2>

                        <textarea
                          name="whatTheWorldNeeds"
                          placeholder="Write your answer here..."
                          value={ikigai["whatTheWorldNeeds"]}
                          onChange={(e) =>
                            handleIkigaiChange(e.target.name, e.target.value)
                          }
                          className="w-full h-32 p-3 rounded-md border border-gray-400 outline-none bg-transparent text-gray-800 resize-none"
                        />
                      </motion.div>
                    </div>
                    <div className="flex items-center w-full justify-center gap-[5%]">
                      {/* passion */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center  w-45 py-3 p-8 shadow-lg"
                        style={{
                          background:
                            "linear-gradient(to bottom, #FBF388, #DAE798)",
                        }}
                      >
                        <h2 className="text-xl font-bold text-gray-900  text-center">
                          Passion
                        </h2>
                        <textarea
                          name="passion"
                          placeholder="passion..."
                          value={ikigai["passion"]}
                          onChange={(e) =>
                            handleIkigaiChange(e.target.name, e.target.value)
                          }
                          className="w-full h-15 p-3 rounded-md border border-gray-400 outline-none bg-transparent  resize-none text-gray-800"
                        />
                      </motion.div>
                      {/* ikigai button */}

                      <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-44 px-8 h-28 py-3 cursor-pointer rounded hover:rounded-2xl transition-all duration-300 bg-linear-to-r from-yellow-400 via-amber-200 to-yellow-500 text-center text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-[0_2px_12px_rgba(251,176,59,0.15)] select-none"
                        onClick={() => setShowIkigaiPic(true)}
                      >
                        IKIGAI
                      </motion.button>

                      {/* vocation */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center w-45 py-3 p-8 shadow-lg"
                        style={{
                          background:
                            "linear-gradient(to bottom, #F7B2AB, #B7E0DC)",
                        }}
                      >
                        <h2 className="text-xl font-bold text-gray-900  text-center">
                          Vocation
                        </h2>

                        <textarea
                          name="vocation"
                          placeholder="vocation..."
                          value={ikigai["vocation"]}
                          onChange={(e) =>
                            handleIkigaiChange(e.target.name, e.target.value)
                          }
                          className="w-full h-15 p-3 rounded-md border border-gray-400 outline-none bg-transparent  resize-none text-gray-800"
                        />
                      </motion.div>
                    </div>
                    <div className="flex items-center w-full justify-center relative overflow-visible">
                      {/* good at*/}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`flex flex-col items-center justify-center rounded w-80 h-80 bg-[#DAE798] p-8 shadow-lg `}
                      >
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                          What you are GOOD at ?
                        </h2>

                        <textarea
                          name="whatYouAreGoodAt"
                          placeholder="Write your answer here..."
                          value={ikigai["whatYouAreGoodAt"]}
                          onChange={(e) =>
                            handleIkigaiChange(e.target.name, e.target.value)
                          }
                          className="w-full h-32 p-3 rounded-md border border-gray-400 outline-none bg-transparent text-gray-800 resize-none"
                        />
                      </motion.div>
                      {/* profession inside */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center w-45 py-3 p-8 shadow-lg text-gray-800"
                        style={{
                          background:
                            "linear-gradient(to right, #DAE798, #B7E0DC)",
                        }}
                      >
                        <h2 className="text-xl font-bold text-gray-900  text-center">
                          Profession
                        </h2>

                        <textarea
                          name="profession"
                          placeholder="profession..."
                          value={ikigai["profession"]}
                          onChange={(e) =>
                            handleIkigaiChange(e.target.name, e.target.value)
                          }
                          className="w-full h-15 p-3 rounded-md border border-gray-400 outline-none bg-transparent  resize-none"
                        />
                      </motion.div>
                      {/* paid for */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`flex flex-col items-center justify-center rounded w-80 h-80 bg-[#B7E0DC] p-8 shadow-lg `}
                      >
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                          What you can be PAID for ?
                        </h2>

                        <textarea
                          name="whatYouCanBePayedFor"
                          placeholder="Write your answer here..."
                          value={ikigai["whatYouCanBePayedFor"]}
                          onChange={(e) =>
                            handleIkigaiChange(e.target.name, e.target.value)
                          }
                          className="w-full h-32 p-3 rounded-md border border-gray-400 outline-none bg-transparent text-gray-800 resize-none"
                        />
                        <button
                          className="border border-gray-400 px-8 py-1 cursor-pointer rounded mt-2 hover:border-gray-800 transition-all duration-500 hover:text-black"
                          onClick={() => fireIkigaiApi()}
                        >
                          Save
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {showIkigaiPic && (
                <div className="flex justify-center items-center w-full h-full ">
                  <AnimatePresence >
                    {showIkigaiPic && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full flex  justify-center items-center relative  "
                      >
                        <button
                          className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-gray-200 transition focus:outline-none cursor-pointer"
                          onClick={() => setShowIkigaiPic(false)}
                          aria-label="Close"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-800"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <img
                          className="w-2xl h-2xl object-contain"
                          src="https://stevelegler.com/wp-content/uploads/2019/02/Ikigai19.jpg"
                          alt="Ikigai diagram"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          )
        ) : null}
      </div>
    </div>
  );
}

export default SelfReflextion;
