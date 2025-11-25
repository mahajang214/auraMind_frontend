import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "../../Components/Utils/LoadingScreen.jsx";
import { setUser, logout, setAuth } from "../../Components/Slices/userSlice.js";
import {
  setActiveTrack,
  clearActiveTrack,
} from "../../Components/Slices/activeTrackSlice.js";
import { showToast } from "../../Components/Utils/ToastService.jsx";
import { debugKey } from "../../Components/Debuger/DebugKeys.js";
import MobileHome from "../../Components/MobileHome/MobileHome.jsx";
import TracksListMobile from "../../Components/TrackListForMobile/TracksListMobile.jsx";

const HomePage = () => {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("jwtToken");
  const lastLoginDate = localStorage.getItem("lastLoginDate");
  const updateStreak = localStorage.getItem("updateStreak");
  const currentDate = new Date().toDateString();

  const [setupDailyReward, setSetupDailyReward] = useState(false);
  const [setupDailyRewardBtn, setSetupDailyRewardBtn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [rewardDataText, setRewardDataText] = useState("");
  // second component
  const [activeTrackInfo, setActiveTrackInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  //
  const [whichDevice, setWhichDevice] = useState(null);
  // edit tracks
  const [isEdit, setIsEdit] = useState(false);
  const [trackOldData, settrackOldData] = useState({
    name: "",
    category: "",
    id: "",
  });
  const [trackNewName, setTrackNewName] = useState("");
  const [trackNewCategory, setTrackNewCategory] = useState(null);

  // store
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // menu for delete and edit
  const [showMenu, setShowMenu] = useState(false);

  // refresh token
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await axios.post(
          `${backendURL}/api/auth/refresh-token`,
          { oldToken: token },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.token) {
          localStorage.setItem("jwtToken", res.data.token);
          localStorage.setItem("lastLoginDate", currentDate);
          console.log("Token refreshed successfully");
          dispatch(setAuth(true)); // Set isAuthenticated properly
          // window.location.reload();
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
    };
    const updateStreakAPi = async () => {
      try {
        await axios.patch(
          `${backendURL}/api/features/update-streaks`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        localStorage.setItem("updateStreak", false);

        return;
      } catch (error) {
        console.log("error:", error.message);
      }
    };
    setWhichDevice(window.innerWidth >= 1024 ? "laptop" : "mobile");

    if (!token) {
      navigate("/login");
      return;
    }
    if (updateStreak === "true") {
      updateStreakAPi();
    }

    // If day has changed, refresh token
    if (lastLoginDate !== currentDate) {
      localStorage.setItem("updateStreak", true);
      refreshToken();
    } else {
      // Optional: schedule auto refresh before expiry (e.g., 23 hours)
      const timeout = setTimeout(() => {
        refreshToken();
        updateStreakAPi();
      }, 23 * 60 * 60 * 1000);

      return () => clearTimeout(timeout);
    }
  }, []);

  const handleActiveTrack = (trackDetails) => {
    dispatch(setActiveTrack(trackDetails));
    setActiveTrackInfo(trackDetails);
  };

  // useEffect(() => {
  //   // Check for previous login (token in localStorage)

  //   if (token) {
  //     // Optionally: validate token with backend here
  //     if (lastLoginDate === currentDate) {
  //       console.log("Already logged in!");
  //     } else {
  //       resetTasks();
  //       localStorage.setItem("lastLoginDate", currentDate);
  //     }
  //     // You can redirect to a dashboard or other page here if needed
  //     //   navigate("/dashboard");
  //   } else {
  //     navigate("/login");
  //   }
  // }, []);

  const getTracks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${backendURL}/api/features/all-tracks`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(response.data.data);
      setTracks(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setIsLoading(false);
    }
  };

  const getUserInfo = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${backendURL}/api/user/user-info`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("user info : ", response.data.data);
      setUserInfo(response.data.data);
      dispatch(setUser(response.data.data));
      dispatch(setAuth(true));
      if (response.data.data[0].dailyReward) {
        setSetupDailyReward(true);
      } else {
        setSetupDailyReward(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching user information:", error);
    }
  };
  // get user info and tracks
  useEffect(() => {
    getUserInfo();
    getTracks();
  }, []);

  const createDailyReward = async () => {
    const rewardData = rewardDataText;
    try {
      if (rewardData === null || rewardData === " " || rewardData === "") {
        return;
      }
      setIsLoading(true);
      const response = await axios.patch(
        `${backendURL}/api/user/setup-daily-reward`,
        { dailyReward: rewardData },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("daily reward api : ", response.data);
      setSetupDailyReward(true);
      setSetupDailyRewardBtn(false);
      setIsLoading(false);
      showToast("success", "Successfully created Daily Reward.");
    } catch (error) {
      console.error("Error creating daily Reward:", error.message);
      showToast("error", "Something went wrong");
      setIsLoading(false);
    }
  };

  const handleStartTime = () => {
    if (isAuthenticated) {
      navigate("/start/timer");
    } else {
      if (
        window.confirm(
          "You must be logged in to start the timer. Would you like to refresh the page and try again?"
        )
      ) {
        window.location.reload();
      }
    }
  };

  const handleDeleteTrack = async (track) => {
    try {
      await axios.delete(
        `${backendURL}/api/features/delete-tracks/${track._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTracks((prev) => prev.filter((t) => t._id !== track._id));
      showToast("success", "Successfully deleted");
    } catch (err) {
      console.error("Error: ", err.message);
      showToast("error", "Somethin went wrong");
    }
  };

  const handleDragEnd = (e, info, track) => {
    setIsDragging(false);

    const deleteZone = document.getElementById("delete-zone");
    if (!deleteZone) return;

    const dz = deleteZone.getBoundingClientRect();
    const y = e.clientY;

    const isInside = y >= dz.top && y <= dz.bottom;

    if (isInside) {
      handleDeleteTrack(track); // your delete function
    }
  };

  // handle edit tracks
  const handleEditTracks = async (id) => {
    try {
      if (!id) {
        return showToast("warning", "Something went wrong!");
      }
      if (trackNewCategory === null && trackNewName === "") {
        return showToast("warning", "Please edit before saving");
      }
      const res = await axios.patch(
        `${backendURL}/api/features/update-track-without-duration/${id}`,
        {
          title: trackNewName || trackOldData.name,
          category: trackNewCategory || trackOldData.category,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showToast("success", "successfully update track");
      settrackOldData({ name: "", category: "", id: "" });
      setTrackNewCategory(null);
      setTrackNewName("");
      return;
    } catch (error) {
      console.log("Error updating track : ", error.message);
      return showToast("error", "Error updating track");
    }
  };

  return (
    <>
      {/* mobile responsive design */}
      <div className="flex lg:hidden  items-center justify-center h-screen bg-[#222831] text-white ">
        <div className=" flex lg:hidden flex-col items-center justify-between w-[90%] max-w-[480px] h-[95vh] bg-linear-to-b from-[#1B1E22] to-[#2A2F35] rounded-3xl p-6 gap-8 shadow-[0_0_40px_rgba(0,0,0,0.45)] border border-white/10 backdrop-blur-xl relative overflow-hidden">
          {/* HEADER */}
          <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-linear-to-r from-[#FFD369] to-[#FBB03B] drop-shadow-lg">
            Auramind
          </h1>

          {/* MAIN CARD */}
          <div className="flex flex-col items-center justify-between w-full h-full bg-[#211E28]/40 border border-white/6 rounded-3xl shadow-inner overflow-hidden backdrop-blur-xl">
            {/* TOP BAR */}
            <div className="flex justify-between items-center w-full p-4">
              <h1 className="text-left w-full text-2xl font-semibold text-white/90">
                Tracks
              </h1>

              <AnimatePresence>
                {activeTrackInfo && (
                  <motion.button
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.36, type: "spring" }}
                    className="flex items-center text-[#00F0FF] hover:text-white font-semibold px-4 py-1 rounded-xl bg-white/5 backdrop-blur-lg shadow-lg border border-white/10 cursor-pointer"
                    onClick={() => {
                      setActiveTrackInfo(null);
                      dispatch(clearActiveTrack());
                    }}
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

            {/* CONTENT AREA */}
            <div className="flex flex-col gap-3 items-center w-full h-full border-t border-white/5 rounded-b-3xl py-3 px-2 overflow-y-auto custom-scroll relative">
              <AnimatePresence>
                {isLoading === "true" ? (
                  <div className="flex flex-col items-center justify-center w-full h-full animate-pulse">
                    <div className="w-16 h-16 border-4 border-t-[#00F0FF] border-white/10 rounded-full animate-spin"></div>
                    <h2 className="mt-4 text-xl font-semibold text-white/80">
                      Loading...
                    </h2>
                  </div>
                ) : (
                  activeTrackInfo === null &&
                  Array.isArray(tracks) &&
                  tracks.length > 0 &&
                  tracks.map((track, k) => (
                    <motion.div
                      key={debugKey(`mob-${k}`, track, "ALL TRACKS LIST")}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.36 }}
                      className="w-full h-14 bg-linear-to-r from-[#1E2226] to-[#23272b] backdrop-blur-xl rounded-xl text-white flex justify-between items-center px-4 shadow-lg border border-white/6 cursor-pointer hover:translate-x-0 hover:bg-[#2A2F34] transition-all"
                      onClick={() => handleActiveTrack(track)}
                    >
                      <div className="flex items-center gap-3">
                        {track.answersCompleted ? (
                          <svg
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="#00FF8C"
                          >
                            <path d="M21 2.992v18.016a1 1 0 0 1-.993.992H3.993A.993.993 0 0 1 3 21.008V2.992A1 1 0 0 1 3.993 2h16.014c.548 0 .993.444.993.992zm-9.707 10.13l-2.475-2.476-1.414 1.415 3.889 3.889 5.657-5.657-1.414-1.414-4.243 4.242z"></path>
                          </svg>
                        ) : (
                          <svg
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="#FF6B6B"
                          >
                            <path d="M21 2.992v18.016a1 1 0 0 1-.993.992H3.993A.993.993 0 0 1 3 21.008V2.992A1 1 0 0 1 3.993 2h16.014c.548 0 .993.444.993.992zM19 4H5v16h14V4z"></path>
                          </svg>
                        )}
                        <h2 className="text-base font-medium truncate">
                          {track.title}
                        </h2>
                      </div>
                      <h3
                        className={
                          track.answersCompleted
                            ? "text-[#00FF8C] font-bold"
                            : "text-[#FF6B6B] font-bold"
                        }
                      >
                        {track.answersCompleted ? "Completed" : "Incomplete"}
                      </h3>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
              <AnimatePresence>
                {/* TRACK DETAILS */}
                {activeTrackInfo != null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.36 }}
                    className="w-full min-h-full rounded-2xl bg-linear-to-b from-[#16181b]/60 to-[#1f2327]/60 backdrop-blur-xl border border-white/6 shadow-xl overflow-hidden "
                  >
                    <div className="bg-[#23272b] w-full flex flex-col items-center py-6 border-b border-white/8">
                      <div className="flex justify-between items-center w-full px-6">
                        <h2 className="text-xl text-white font-semibold">
                          {activeTrackInfo.title}
                        </h2>
                        <div className="relative">
                          <motion.button
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.36, type: "spring" }}
                            className="flex items-center justify-center text-[#00F0FF] hover:text-white font-semibold px-3 py-2  bg-transparent  cursor-pointer "
                            aria-label="Open menu"
                            onClick={() => setShowMenu((prev) => !prev)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-7 w-7"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 7h16M4 12h16M4 17h16"
                              />
                            </svg>
                          </motion.button>
                          {showMenu && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.23 }}
                              className="absolute right-0 mt-2 bg-[#222831] border border-white/10 rounded-lg shadow-lg z-50 flex flex-col "
                            >
                              <button
                                onClick={() => {
                                  setIsEdit(true);
                                  settrackOldData({
                                    name: activeTrackInfo.title,
                                    category: activeTrackInfo.category,
                                    id: activeTrackInfo._id,
                                  });
                                  return setShowMenu(false);
                                }}
                                className="px-4 py-2 hover:bg-[#31363b] text-left text-white w-full cursor-pointer"
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteTrack(activeTrackInfo);
                                  return setShowMenu(false);
                                }}
                                className="px-4 py-2 hover:bg-[#31363b] text-left text-red-400 w-full cursor-pointer"
                                type="button"
                              >
                                Delete
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={handleStartTime}
                        className="mt-5 p-4 rounded-full bg-linear-to-r from-[#00ADB5]/20 to-[#00F0FF]/20 border border-[#00ADB5]/30 shadow-lg cursor-pointer"
                      >
                        <svg
                          width="120"
                          height="120"
                          fill="#00F0FF"
                          viewBox="0 0 100 100"
                        >
                          <path d="M69.8 48.2l-30-19.5c-.46-.3-1.05-.32-1.53-.06-.48.26-.78.77-.78 1.32v39c0 .55.3 1.06.78 1.32.22.12.47.18.71.18.28 0 .57-.08.82-.24l30-19.5c.43-.27.68-.75.68-1.26s-.25-.98-.68-1.24zM40.5 66.2V32.8L66.2 49.5 40.5 66.2z" />
                        </svg>
                      </motion.button>

                      <h1 className="mt-5 text-2xl text-white font-semibold">
                        Setup New Record
                      </h1>
                    </div>

                    <div className="p-5 space-y-4">
                      <h2 className="text-xl text-white/90 font-semibold">
                        Old Records
                      </h2>

                      {activeTrackInfo.old_durations?.map((record, key1) => (
                        <div
                          key={debugKey(key1, record, "ALL OLD RECORDS LIST")}
                          className="w-full flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/6"
                        >
                          <svg
                            width="34"
                            height="34"
                            fill="none"
                            stroke="#00ADB5"
                            strokeWidth="2"
                            viewBox="0 0 32 32"
                          >
                            <path d="M22 6H10C8.3 6 7 4.7 7 3h18c0 1.7-1.3 3-3 3zM10 26h12c1.7 0 3 1.3 3 3H7c0-1.7 1.3-3 3-3zM23 26v-4c0-.6-.3-1.2-.8-1.6L18.5 17c-1.1-.8-1.1-2.4 0-3.2l3.7-2.8c.5-.4.8-1 .8-1.6V6M9 6v4c0 .6.3 1.2.8 1.6l3.7 2.8c1.1.8 1.1 2.4 0 3.2L9.8 20.4c-.5.4-.8 1-.8 1.6v4" />
                          </svg>

                          <h1 className="text-2xl tracking-wide text-white font-semibold">
                            {String(record.hr).padStart(2, "0")}:
                            {String(record.min).padStart(2, "0")}:
                            {String(record.sec).padStart(2, "0")}
                          </h1>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {/* DAILY REWARD SETUP */}
                {!setupDailyReward &&
                  !setupDailyRewardBtn &&
                  activeTrackInfo === null && (
                    <button
                      onClick={() => setSetupDailyRewardBtn(true)}
                      className="w-[90%] py-3 text-lg font-semibold bg-linear-to-r from-[#00ADB5] to-[#00F0FF] text-[#0F1115] rounded-xl mt-3 shadow-lg hover:opacity-95 transition-all cursor-pointer"
                    >
                      Setup Daily Reward
                    </button>
                  )}

                {setupDailyRewardBtn && activeTrackInfo === null && (
                  <div className="w-[90%] flex flex-col items-center gap-3 bg-[#16181b] border border-white/10 rounded-xl mt-4 px-6 py-6 shadow-lg">
                    <label
                      htmlFor="daily-reward-input"
                      className="text-lg font-semibold text-white mb-2"
                    >
                      Enter your daily reward
                    </label>
                    <input
                      id="daily-reward-input"
                      type="text"
                      value={rewardDataText}
                      onChange={(e) => setRewardDataText(e.target.value)}
                      className="w-full px-4 py-2 rounded-md border border-white/10 bg-[#23272b] text-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                      placeholder="E.g. Watch a movie, have a treat..."
                    />
                    <button
                      onClick={createDailyReward}
                      className="w-full mt-3 py-2 bg-linear-to-r from-[#00ADB5] to-[#00F0FF] text-[#0F1115] font-semibold rounded-md hover:opacity-95 transition-all cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
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
              ].map((btn, key2) => (
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
      </div>
      {/* laptop  */}
      <div className="hidden lg:flex  items-center justify-center h-screen bg-[#222831] text-white ">
        <div className=" hidden mt-18 w-[70%] h-[90%] bg-[#0F1115] lg:flex flex-col items-center rounded-lg px-6 ">
          {/* body */}
          <motion.h1
            initial={{ opacity: 0, y: -40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
            className="text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-amber-200 to-yellow-500 drop-shadow-[0_2px_12px_rgba(251,176,59,0.15)] select-none"
          >
            AuraMind
          </motion.h1>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl">Tracks</h2>
            {/* activeTrackInfo */}
            <AnimatePresence>
              {activeTrackInfo && (
                <motion.button
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="flex items-center text-[#00ADB5] hover:text-[#EEEEEE] font-semibold px-3 py-1 rounded transition-colors duration-200 cursor-pointer"
                  onClick={() => setActiveTrackInfo(null)}
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

          {/* body */}
          <div className="w-full  h-[80%] flex flex-col  items-center">
            <div className="w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#222831] scrollbar-track-transparent ">
              {/* tracks array */}
              <AnimatePresence>
                {isLoading ? (
                  <LoadingScreen />
                ) : Array.isArray(tracks) &&
                  tracks.length &&
                  whichDevice === "laptop" &&
                  !activeTrackInfo > 0 ? (
                  tracks.map((track) => (
                    <motion.div
                      key={debugKey(
                        `${Math.random().toString(36).slice(2, 5)}`,
                        track,
                        "ALL TRACKS LIST LAPTOP"
                      )}
                      drag="y"
                      dragConstraints={{ top: 0, bottom: 300 }} // smooth drag
                      dragElastic={0.2}
                      onDragStart={() => setIsDragging(true)}
                      onDragEnd={(e, info) => handleDragEnd(e, info, track)}
                      whileDrag={{ scale: 1.05, opacity: 0.9 }}
                      className="w-full h-12 bg-[#222831] rounded-lg text-white flex justify-between items-center px-6 my-2 cursor-pointer hover:bg-gray-700 transition-all duration-200 hover:px-18 relative group overflow-hidden"
                      onClick={() => {
                        // console.log("Active Track : ", track);

                        if (isDragging) {
                          // console.log("draging")
                          return;
                        }
                        return handleActiveTrack(track);
                      }}
                    >
                      <div className="flex items-center gap-2 justify-center">
                        {track.answersCompleted ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                          >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path
                              d="M21 2.992v18.016a1 1 0 0 1-.993.992H3.993A.993.993 0 0 1 3 21.008V2.992A1 1 0 0 1 3.993 2h16.014c.548 0 .993.444.993.992zm-9.707 10.13l-2.475-2.476-1.414 1.415 3.889 3.889 5.657-5.657-1.414-1.414-4.243 4.242z"
                              fill="#00C950"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                          >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path
                              d="M21 2.992v18.016a1 1 0 0 1-.993.992H3.993A.993.993 0 0 1 3 21.008V2.992A1 1 0 0 1 3.993 2h16.014c.548 0 .993.444.993.992zM19 4H5v16h14V4zm-7.707 9.121l4.243-4.242 1.414 1.414-5.657 5.657-3.89-3.89 1.415-1.414 2.475 2.475z"
                              fill="#FB2C36"
                            ></path>
                          </svg>
                        )}
                        <h2 className="text-sm font-medium">{track.title}</h2>
                      </div>
                      <h3
                        className={
                          track.answersCompleted
                            ? "text-green-500 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {track.answersCompleted ? "Completed" : "Incompleted"}
                      </h3>
                      <button
                        className="absolute -right-15 group-hover:right-0 top-1/2 -translate-y-1/2  bg-linear-to-r from-green-400 via-emerald-500 to-teal-600 shadow-[0_0_20px_rgba(239,68,68,0.6)]
hover:shadow-[0_0_35px_rgba(244,63,94,0.9)] text-[#FFD369] px-4 h-full  font-semibold text-xs  transition-all duration-200 border rounded-r-lg border-[#ffd36944] focus:outline-none focus:ring-2 focus:ring-[#FFD369]/40 cursor-pointer"
                        aria-label={`Edit track "${track.title}"`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: handle edit logic here, e.g., open edit modal

                          setIsEdit(true);
                          return settrackOldData({
                            name: track.title,
                            category: track.category,
                            id: track._id,
                          });
                        }}
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                          width={16}
                          height={16}
                          className="inline-block  align-middle"
                        >
                          <path
                            d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.25 8.25-3.07.513a1 1 0 0 1-1.16-1.159l.513-3.07 8.25-8.25zm2.121-2.121a4 4 0 0 0-5.656 0l-8.25 8.25A3 3 0 0 0 1 13.415V17a1 1 0 0 0 1 1h3.586a3 3 0 0 0 2.122-.879l8.25-8.25a4 4 0 0 0 0-5.657zm-3.535 7.071l2.828-2.828-2.122-2.122-2.828 2.828 2.122 2.122z"
                            fill="#FFD369"
                          ></path>
                        </svg>
                      </button>
                    </motion.div>
                  ))
                ) : (
                  !activeTrackInfo && (
                    <div className="text-gray-500">No tracks found</div>
                  )
                )}
              </AnimatePresence>

              {/* active Track info */}
              <AnimatePresence>
                {activeTrackInfo && (
                  <div className="w-full h-full hidden lg:flex  rounded-2xl justify-between items-center flex-col lg:flex-row overflow-hidden">
                    <motion.div
                      initial={{ x: -200, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -200, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 60,
                        damping: 20,
                      }}
                      className="first_Container bg-transparent w-full  flex flex-col  items-center py-6   "
                    >
                      <h2 className="text-2xl text-left w-full">
                        Name: {activeTrackInfo.title}
                      </h2>
                      <h2 className="text-2xl text-left w-full">
                        Category: {activeTrackInfo.category}
                      </h2>
                      <h3
                        className={
                          activeTrackInfo.answersCompleted
                            ? "text-green-500 font-semibold text-2xl text-left w-full"
                            : "text-red-500 font-semibold text-2xl text-left w-full"
                        }
                      >
                        <span className="text-white">Status :</span>{" "}
                        {activeTrackInfo.answersCompleted
                          ? "Completed"
                          : "Incompleted"}
                      </h3>
                      <h2 className="text-2xl text-left w-full">
                        Created At:{" "}
                        {activeTrackInfo.createdAt &&
                          new Date(activeTrackInfo.createdAt).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                      </h2>
                      <h2 className="text-2xl text-left w-full">
                        Created At:{" "}
                        {activeTrackInfo.updatedAt &&
                          new Date(activeTrackInfo.updatedAt).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                      </h2>
                    </motion.div>
                    <motion.div
                      className="second_Container bg-[#222831] w-2/5  gap-4 py-6 px-8 rounded-lg"
                      initial={{ x: 200, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 200, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 60,
                        damping: 20,
                      }}
                    >
                      <h2 className="text-2xl text-center cursor-default">
                        Old Records
                      </h2>
                      <div className=" rounded-lg w-full">
                        {/* duration */}

                        <div className="w-full h-12 px-4  flex items-center ">
                          {/* icon */}
                          <svg
                            className="w-10 h-10 "
                            version="1.1"
                            id="Icons"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            viewBox="0 0 32 32"
                            xmlSpace="preserve"
                          >
                            <path
                              className="st1"
                              fill="none"
                              stroke="#d1d5dc"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              d="M22,6H10C8.3,6,7,4.7,7,3v0h18v0C25,4.7,23.7,6,22,6z"
                            ></path>
                            <path
                              className="st1"
                              fill="none"
                              stroke="#d1d5dc"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              d="M10,26h12c1.7,0,3,1.3,3,3v0H7v0C7,27.3,8.3,26,10,26z"
                            ></path>
                            <path
                              className="st1"
                              fill="none"
                              stroke="#d1d5dc"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              d="M23,26v-4c0-0.6-0.3-1.2-0.8-1.6l-3.7-2.8c-1.1-0.8-1.1-2.4,0-3.2l3.7-2.8c0.5-0.4,0.8-1,0.8-1.6V6"
                            ></path>
                            <path
                              className="st1"
                              fill="none"
                              stroke="#d1d5dc"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              d="M9,6v4c0,0.6,0.3,1.2,0.8,1.6l3.7,2.8c1.1,0.8,1.1,2.4,0,3.2l-3.7,2.8C9.3,20.8,9,21.4,9,22v4"
                            ></path>
                            <polygon
                              className="st1"
                              fill="none"
                              stroke="#d1d5dc"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              points="11,26 16,21 21,26 "
                            ></polygon>
                            <polygon
                              className="st1"
                              fill="none"
                              stroke="#d1d5dc"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              points="16,12 13,10 19,10 "
                            ></polygon>
                          </svg>
                          {/* timer */}
                          <h1 className=" text-center w-full text-2xl text-gray-300">
                            <span className="mx-1">
                              {String(activeTrackInfo.duration.hr).padStart(
                                2,
                                "0"
                              )}
                            </span>
                            :
                            <span className="mx-1">
                              {String(activeTrackInfo.duration.min).padStart(
                                2,
                                "0"
                              )}
                            </span>
                            :
                            <span className="mx-1">
                              {String(activeTrackInfo.duration.sec).padStart(
                                2,
                                "0"
                              )}
                            </span>
                          </h1>
                        </div>
                        {activeTrackInfo.old_durations.length > 0 &&
                          activeTrackInfo.old_durations.map((record, key4) => (
                            <div
                              className="w-full h-12 px-4  flex items-center "
                              key={debugKey(
                                key4,
                                record,
                                "ALL RECORDS LIST LAPTOP"
                              )}
                            >
                              {/* icon */}
                              <svg
                                className="w-10 h-10 "
                                version="1.1"
                                id="Icons"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                viewBox="0 0 32 32"
                                xmlSpace="preserve"
                              >
                                <path
                                  className="st1"
                                  fill="none"
                                  stroke="#d1d5dc"
                                  strokeWidth="2"
                                  strokeMiterlimit="10"
                                  d="M22,6H10C8.3,6,7,4.7,7,3v0h18v0C25,4.7,23.7,6,22,6z"
                                ></path>
                                <path
                                  className="st1"
                                  fill="none"
                                  stroke="#d1d5dc"
                                  strokeWidth="2"
                                  strokeMiterlimit="10"
                                  d="M10,26h12c1.7,0,3,1.3,3,3v0H7v0C7,27.3,8.3,26,10,26z"
                                ></path>
                                <path
                                  className="st1"
                                  fill="none"
                                  stroke="#d1d5dc"
                                  strokeWidth="2"
                                  strokeMiterlimit="10"
                                  d="M23,26v-4c0-0.6-0.3-1.2-0.8-1.6l-3.7-2.8c-1.1-0.8-1.1-2.4,0-3.2l3.7-2.8c0.5-0.4,0.8-1,0.8-1.6V6"
                                ></path>
                                <path
                                  className="st1"
                                  fill="none"
                                  stroke="#d1d5dc"
                                  strokeWidth="2"
                                  strokeMiterlimit="10"
                                  d="M9,6v4c0,0.6,0.3,1.2,0.8,1.6l3.7,2.8c1.1,0.8,1.1,2.4,0,3.2l-3.7,2.8C9.3,20.8,9,21.4,9,22v4"
                                ></path>
                                <polygon
                                  className="st1"
                                  fill="none"
                                  stroke="#d1d5dc"
                                  strokeWidth="2"
                                  strokeMiterlimit="10"
                                  points="11,26 16,21 21,26 "
                                ></polygon>
                                <polygon
                                  className="st1"
                                  fill="none"
                                  stroke="#d1d5dc"
                                  strokeWidth="2"
                                  strokeMiterlimit="10"
                                  points="16,12 13,10 19,10 "
                                ></polygon>
                              </svg>
                              {/* timer */}
                              <h1 className=" text-center w-full text-2xl text-gray-300">
                                <span className="mx-1">
                                  {String(record.hr).padStart(2, "0")}
                                </span>
                                :
                                <span className="mx-1">
                                  {String(record.min).padStart(2, "0")}
                                </span>
                                :
                                <span className="mx-1">
                                  {String(record.sec).padStart(2, "0")}
                                </span>
                              </h1>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  </div>
                )}
                {/* delete track */}
                {isDragging && (
                  <motion.div
                    id="delete-zone"
                    className="w-full h-20 mt-2 bg-red-800/20 border-2 border-red-700/40 rounded-lg
             flex justify-center items-center text-red-400 font-semibold
             pointer-events-none"
                    animate={
                      isDragging
                        ? { backgroundColor: "rgba(255,0,0,0.25)" }
                        : {}
                    }
                  >
                    Drag Here to Delete
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* setup new record */}
            <AnimatePresence mode="wait">
              {activeTrackInfo && (
                <motion.button
                  initial={{ opacity: 0, y: 200, scale: 0.9 }}
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
                  onClick={handleStartTime}
                  className="relative w-1/2 mt-4 py-2.5 rounded-lg text-lg font-semibold text-white tracking-wide cursor-pointer
    bg-linear-to-r from-[#00ADB5] to-[#00BCD4]
    shadow-[0_0_10px_rgba(0,173,181,0.3)]
    hover:shadow-[0_0_18px_rgba(0,173,181,0.6)]
    transition-all duration-500 ease-in-out overflow-hidden
    hover:scale-[1.03] active:scale-[0.97] group"
                >
                  {/* Shimmer overlay */}
                  <motion.span
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                    initial={{ x: "-200%" }}
                    animate={{
                      x: activeTrackInfo ? ["-200%", "200%"] : "-200%",
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  ></motion.span>
                  {/* Border glow */}
                  <span className="absolute inset-0 rounded-lg border border-white/10 group-hover:border-cyan-300/40 transition-all pointer-events-none"></span>
                  <span className="relative z-10">Setup New Record</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* setup daily rewards btn*/}
          <AnimatePresence>
            {!setupDailyReward && !activeTrackInfo && (
              <motion.button
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
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
                onClick={() => setSetupDailyRewardBtn(true)}
                className="relative w-1/2 mt-6 py-2.5 rounded-lg text-lg font-semibold text-white tracking-wide cursor-pointer
      bg-linear-to-r from-[#00ADB5] to-[#00BCD4]
      shadow-[0_0_12px_rgba(0,173,181,0.4)]
      overflow-hidden group transition-all duration-500 ease-in-out"
                type="button"
                aria-label="Setup Daily Reward"
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

                <span className="relative z-10">Setup Daily Reward</span>
              </motion.button>
            )}
          </AnimatePresence>

          {!setupDailyReward && setupDailyRewardBtn && (
            <AnimatePresence>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="bg-[#222831] text-white p-6 rounded-2xl shadow-xl w-80 sm:w-96 flex flex-col items-center"
                  initial={{ scale: 0.8, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 30 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h2 className="text-lg font-semibold mb-2 text-[#00ADB5]">
                    Enter Your Daily Reward 🎯
                  </h2>
                  <p className="text-gray-300 text-sm mb-4 text-center">
                    Set your daily reward to stay motivated and track your
                    consistency.
                  </p>

                  <input
                    type="text"
                    onChange={(e) => setRewardDataText(e.target.value)}
                    placeholder="e.g. Watching One-Piece"
                    className="w-full p-2 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                  />

                  <div className="flex justify-between w-full mt-5">
                    <button
                      onClick={() => setSetupDailyRewardBtn(false)} // close
                      className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        return createDailyReward();
                      }}
                      className="px-4 py-2 bg-[#00ADB5] rounded-lg hover:bg-[#06c4cc] transition-all"
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* edit track */}
      {isEdit && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 `z-[999]` bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#23272b] text-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md flex flex-col items-center border-2 border-[#111418] relative"
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-[#FFD369] mb-3">
                Edit Track
              </h2>
              <label
                className="text-sm text-gray-300 w-full mb-1"
                htmlFor="new-title-input"
              >
                New Track Title
              </label>
              <input
                id="new-title-input"
                type="text"
                value={trackNewName === "" ? trackOldData.name : trackNewName}
                onChange={(e) => setTrackNewName(e.target.value)}
                placeholder={trackOldData.name}
                className="w-full bg-[#1F242A] text-white px-3 py-2 rounded-lg mb-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition"
                autoFocus
              />

              <label
                className="text-sm text-gray-300 w-full mb-1"
                htmlFor="new-category-select"
              >
                New Category
              </label>
              <select
                id="new-category-select"
                className="w-full bg-[#222831] outline-none px-3 py-2 mt-4 rounded-lg cursor-pointer mb-4"
                value={trackOldData.category}
                onChange={(e) => setTrackNewCategory(e.target.value)}
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

              <div className="flex justify-between w-full mt-1 gap-2">
                <button
                  className="w-1/2 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all cursor-pointer"
                  onClick={() => setIsEdit(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="w-1/2 py-2 bg-[#00ADB5] text-[#181C20] font-semibold rounded-lg hover:bg-[#06c4cc] transition-all cursor-pointer"
                  type="button"
                  onClick={() => {
                    // Implement actual update logic here
                    // E.g. call an API, update tracks, and then setIsEdit(false)
                    handleEditTracks(trackOldData.id);
                    return setIsEdit(false);
                  }}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default HomePage;
