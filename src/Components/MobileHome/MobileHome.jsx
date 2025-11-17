import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTrack } from "../Slices/activeTrackSlice";
import { debugKey } from "../Debuger/DebugKeys";

function MobileHome() {
    
    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
  
    // store
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  
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
      if (trackDetails) {
        dispatch(setActiveTrack(trackDetails));
        setActiveTrackInfo(trackDetails);
      } else {
        setActiveTrackInfo(null);
        dispatch(clearActiveTrack());
      }
    };
  
   
  
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
        console.error("Error fetching user information:", error);
        setIsLoading(false);
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
  return (
    <div className=" flex lg:hidden  items-center justify-center h-screen bg-[#222831] text-white ">
        {/* mobile responsive design */}
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

            {/* CONTENT AREA */}
            <div className="flex flex-col gap-3 items-center w-full h-full border-t border-white/5 rounded-b-3xl py-3 px-2 overflow-y-auto custom-scroll relative">
              <AnimatePresence>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center w-full h-full animate-pulse">
                    <div className="w-16 h-16 border-4 border-t-[#00F0FF] border-white/10 rounded-full animate-spin"></div>
                    <h2 className="mt-4 text-xl font-semibold text-white/80">
                      Loading...
                    </h2>
                  </div>
                ) : (
                  !activeTrackInfo &&
                  Array.isArray(tracks) &&
                  tracks.length > 0 && whichDevice==="mobile"  && (
                    <>
                      {tracks.map((track, k) => (
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
                      ))}
                    </>
                  )
                )}

                {/* TRACK DETAILS */}
                {activeTrackInfo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.36 }}
                    className="w-full min-h-full rounded-2xl bg-linear-to-b from-[#16181b]/60 to-[#1f2327]/60 backdrop-blur-xl border border-white/6 shadow-xl overflow-hidden"
                  >
                    <div className="bg-[#23272b] w-full flex flex-col items-center py-6 border-b border-white/8">
                      <h2 className="text-xl text-white font-semibold">
                        {activeTrackInfo.title}
                      </h2>

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

                {/* DAILY REWARD SETUP */}
                {!setupDailyReward && !setupDailyRewardBtn && (
                  <button
                    onClick={() => setSetupDailyRewardBtn(true)}
                    className="w-[90%] py-3 text-lg font-semibold bg-linear-to-r from-[#00ADB5] to-[#00F0FF] text-[#0F1115] rounded-xl mt-3 shadow-lg hover:opacity-95 transition-all cursor-pointer"
                  >
                    Setup Daily Reward
                  </button>
                )}

                {setupDailyRewardBtn && (
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
  )
}

export default MobileHome