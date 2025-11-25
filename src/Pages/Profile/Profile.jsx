import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { showToast } from "../../Components/Utils/ToastService";
import LoadingScreen from "../../Components/Utils/LoadingScreen";
import ShareSection from "../../Components/Share/ShareSection";

function Profile() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(null);
  const reduxUser = useSelector((state) => state.user.user);
  const [tracksLength, setTracksLength] = useState(0);
  const [emailId, setEmailId] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [shareThis, setShareThis] = useState(false);
  // console.log("redux user:",reduxUser[0])

  const getEmail = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${baseUrl}/api/features/get-email`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmailId(res.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log("error fetching email : ", error.message);
      setIsLoading(false);
      showToast("error", "Something went wrong");
    }
  };

  useEffect(() => {
    if (reduxUser[0].tracks) {
      reduxUser[0].tracks.forEach(() => setTracksLength((prev) => prev + 1));
    }
    if (!emailId) {
      getEmail();
    }
  }, []);

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
              My Profile
            </h1>

            <AnimatePresence mode="wait">
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.85, rotate: 30 }}
                  whileHover={{ scale: 1.15, rotate: 15 }}
                  className="p-2 rounded-full bg-[#232831] hover:bg-[#32353c] focus:bg-[#2a2e35] border border-[#80808042] shadow transition-all cursor-pointer"
                  aria-label="Settings"
                  onClick={() => setShowSettings((prev) => !prev)}
                  type="button"
                >
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width={32}
                    height={32}
                    viewBox="0 0 548.172 548.172"
                    style={{ enableBackground: "new 0 0 548.172 548.172" }}
                    xmlSpace="preserve"
                  >
                    <g>
                      <g>
                        {/* Main Gear Path */}
                        <motion.path
                          d="M333.186,376.438c0-1.902-0.668-3.806-1.999-5.708c-10.66-12.758-19.223-23.702-25.697-32.832
                        c3.997-7.803,7.043-15.037,9.131-21.693l44.255-6.852c1.718-0.194,3.241-1.19,4.572-2.994c1.331-1.816,1.991-3.668,1.991-5.571
                        v-52.822c0-2.091-0.66-3.949-1.991-5.564s-2.95-2.618-4.853-2.993l-43.4-6.567c-2.098-6.473-5.331-14.281-9.708-23.413
                        c2.851-4.19,7.139-9.902,12.85-17.131c5.709-7.234,9.713-12.371,11.991-15.417c1.335-1.903,1.999-3.713,1.999-5.424
                        c0-5.14-13.706-20.367-41.107-45.683c-1.902-1.52-3.901-2.281-6.002-2.281c-2.279,0-4.182,0.659-5.712,1.997L245.815,150.9
                        c-7.801-3.996-14.939-6.945-21.411-8.854l-6.567-43.68c-0.187-1.903-1.14-3.571-2.853-4.997c-1.714-1.427-3.617-2.142-5.713-2.142
                        h-53.1c-4.377,0-7.232,2.284-8.564,6.851c-2.286,8.757-4.473,23.416-6.567,43.968c-8.183,2.664-15.511,5.71-21.982,9.136
                        l-32.832-25.693c-1.903-1.335-3.901-1.997-5.996-1.997c-3.621,0-11.138,5.614-22.557,16.846
                        c-11.421,11.228-19.229,19.698-23.413,25.409c-1.334,1.525-1.997,3.428-1.997,5.712c0,1.711,0.662,3.614,1.997,5.708
                        c10.657,12.756,19.221,23.7,25.694,32.832c-3.996,7.808-7.04,15.037-9.132,21.698l-44.255,6.848
                        c-1.715,0.19-3.236,1.188-4.57,2.993C0.666,243.35,0,245.203,0,247.105v52.819c0,2.095,0.666,3.949,1.997,5.564
                        c1.334,1.622,2.95,2.525,4.857,2.714l43.396,6.852c2.284,7.23,5.618,15.037,9.995,23.411c-3.046,4.191-7.517,9.999-13.418,17.418
                        c-5.905,7.427-9.805,12.471-11.707,15.133c-1.332,1.903-1.999,3.717-1.999,5.421c0,5.147,13.706,20.369,41.114,45.687
                        c1.903,1.519,3.899,2.275,5.996,2.275c2.474,0,4.377-0.66,5.708-1.995l33.689-25.406c7.801,3.997,14.939,6.943,21.413,8.847
                        l6.567,43.684c0.188,1.902,1.142,3.572,2.853,4.996c1.713,1.427,3.616,2.139,5.711,2.139h53.1c4.38,0,7.233-2.282,8.566-6.851
                        c2.284-8.949,4.471-23.698,6.567-44.256c7.611-2.275,14.938-5.235,21.982-8.846l32.833,25.693
                        c1.903,1.335,3.901,1.995,5.996,1.995c3.617,0,11.091-5.66,22.415-16.991c11.32-11.317,19.175-19.842,23.555-25.55
                        C332.518,380.53,333.186,378.724,333.186,376.438z M234.397,325.626c-14.272,14.27-31.499,21.408-51.673,21.408
                        c-20.179,0-37.406-7.139-51.678-21.408c-14.274-14.277-21.412-31.505-21.412-51.68c0-20.174,7.138-37.401,21.412-51.675
                        c14.272-14.275,31.5-21.411,51.678-21.411c20.174,0,37.401,7.135,51.673,21.411c14.277,14.274,21.413,31.501,21.413,51.675
                        C255.81,294.121,248.675,311.349,234.397,325.626z"
                          fill="#FFD369"
                          style={{ originX: "50%", originY: "50%" }}
                          animate={
                            showSettings ? { rotate: 360 } : { rotate: 0 }
                          }
                          transition={
                            showSettings
                              ? {
                                  repeat: Infinity,
                                  ease: "linear",
                                  duration: 1,
                                }
                              : { duration: 0.35 }
                          }
                        />

                        {/* Bottom Right Gear Cluster */}
                        <motion.path
                          d="M505.628,391.29c-2.471-5.517-5.329-10.465-8.562-14.846c9.709-21.512,14.558-34.646,14.558-39.402
                        c0-0.753-0.373-1.424-1.14-1.995c-22.846-13.322-34.643-19.985-35.405-19.985l-1.711,0.574
                        c-7.803,7.807-16.563,18.463-26.266,31.977c-3.805-0.379-6.656-0.574-8.559-0.574c-1.909,0-4.76,0.195-8.569,0.574
                        c-2.655-4-7.61-10.427-14.842-19.273c-7.23-8.846-11.611-13.277-13.134-13.277c-0.38,0-3.234,1.522-8.566,4.575
                        c-5.328,3.046-10.943,6.276-16.844,9.709c-5.906,3.433-9.229,5.328-9.992,5.711c-0.767,0.568-1.144,1.239-1.144,1.992
                        c0,4.764,4.853,17.888,14.559,39.402c-3.23,4.381-6.089,9.329-8.562,14.842c-28.363,2.851-42.544,5.805-42.544,8.85v39.968
                        c0,3.046,14.181,5.996,42.544,8.85c2.279,5.141,5.137,10.089,8.562,14.839c-9.706,21.512-14.559,34.646-14.559,39.402
                        c0,0.76,0.377,1.431,1.144,1.999c23.216,13.514,35.022,20.27,35.402,20.27c1.522,0,5.903-4.473,13.134-13.419
                        c7.231-8.948,12.18-15.413,14.842-19.41c3.806,0.373,6.66,0.564,8.569,0.564c1.902,0,4.754-0.191,8.559-0.564
                        c2.659,3.997,7.611,10.462,14.842,19.41c7.231,8.946,11.608,13.419,13.135,13.419c0.38,0,12.187-6.759,35.405-20.27
                        c0.767-0.568,1.14-1.235,1.14-1.999c0-4.757-4.855-17.891-14.558-39.402c3.426-4.75,6.279-9.698,8.562-14.839
                        c28.362-2.854,42.544-5.804,42.544-8.85v-39.968C548.172,397.098,533.99,394.144,505.628,391.29z M464.37,445.962
                        c-7.128,7.139-15.745,10.715-25.834,10.715c-10.092,0-18.705-3.576-25.837-10.715c-7.139-7.139-10.712-15.748-10.712-25.837
                        c0-9.894,3.621-18.466,10.855-25.693c7.23-7.231,15.797-10.849,25.693-10.849c9.894,0,18.466,3.614,25.7,10.849
                        c7.228,7.228,10.849,15.8,10.849,25.693C475.078,430.214,471.512,438.823,464.37,445.962z"
                          fill="#FFD369"
                          style={{ originX: "50%", originY: "50%" }}
                          animate={
                            showSettings ? { rotate: 360 } : { rotate: 0 }
                          }
                          transition={
                            showSettings
                              ? {
                                  repeat: Infinity,
                                  ease: "linear",
                                  duration: 1,
                                }
                              : { duration: 0.35 }
                          }
                        />

                        {/* Top Right Gear Cluster */}
                        <motion.path
                          d="M505.628,98.931c-2.471-5.52-5.329-10.468-8.562-14.849c9.709-21.505,14.558-34.639,14.558-39.397
                        c0-0.758-0.373-1.427-1.14-1.999c-22.846-13.323-34.643-19.984-35.405-19.984l-1.711,0.57
                        c-7.803,7.808-16.563,18.464-26.266,31.977c-3.805-0.378-6.656-0.57-8.559-0.57c-1.909,0-4.76,0.192-8.569,0.57
                        c-2.655-3.997-7.61-10.42-14.842-19.27c-7.23-8.852-11.611-13.276-13.134-13.276c-0.38,0-3.234,1.521-8.566,4.569
                        c-5.328,3.049-10.943,6.283-16.844,9.71c-5.906,3.428-9.229,5.33-9.992,5.708c-0.767,0.571-1.144,1.237-1.144,1.999
                        c0,4.758,4.853,17.893,14.559,39.399c-3.23,4.38-6.089,9.327-8.562,14.847c-28.363,2.853-42.544,5.802-42.544,8.848v39.971
                        c0,3.044,14.181,5.996,42.544,8.848c2.279,5.137,5.137,10.088,8.562,14.847c-9.706,21.51-14.559,34.639-14.559,39.399
                        c0,0.757,0.377,1.426,1.144,1.997c23.216,13.513,35.022,20.27,35.402,20.27c1.522,0,5.903-4.471,13.134-13.418
                        c7.231-8.947,12.18-15.415,14.842-19.414c3.806,0.378,6.66,0.571,8.569,0.571c1.902,0,4.754-0.193,8.559-0.571
                        c2.659,3.999,7.611,10.466,14.842,19.414c7.231,8.947,11.608,13.418,13.135,13.418c0.38,0,12.187-6.757,35.405-20.27
                        c0.767-0.571,1.14-1.237,1.14-1.997c0-4.76-4.855-17.889-14.558-39.399c3.426-4.759,6.279-9.707,8.562-14.847
                        c28.362-2.853,42.544-5.804,42.544-8.848v-39.971C548.172,104.737,533.99,101.787,505.628,98.931z M464.37,153.605
                        c-7.128,7.139-15.745,10.708-25.834,10.708c-10.092,0-18.705-3.569-25.837-10.708c-7.139-7.135-10.712-15.749-10.712-25.837
                        c0-9.897,3.621-18.464,10.855-25.697c7.23-7.233,15.797-10.85,25.693-10.85c9.894,0,18.466,3.621,25.7,10.85
                        c7.228,7.232,10.849,15.8,10.849,25.697C475.078,137.856,471.512,146.47,464.37,153.605z"
                          fill="#FFD369"
                          style={{ originX: "50%", originY: "50%" }}
                          animate={
                            showSettings ? { rotate: 360 } : { rotate: 0 }
                          }
                          transition={
                            showSettings
                              ? {
                                  repeat: Infinity,
                                  ease: "linear",
                                  duration: 1,
                                }
                              : { duration: 0.35 }
                          }
                        />
                      </g>
                    </g>
                  </svg>
                </motion.button>
                {/* AnimatePresence settings dropdown/modal (demo) */}

                {showSettings && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.17 }}
                    className="absolute top-full right-0 z-30 mt-2 min-w-[170px] bg-[#232831] border border-[#42414a65] rounded-xl shadow-2xl p-3"
                  >
                    <div className="flex flex-col gap-2">
                      <button className="text-left px-3 py-1.5 rounded hover:bg-[#32363c] text-[#FFD369] font-medium cursor-pointer">
                        Edit Profile
                      </button>
                      <button  onClick={() => setShareThis(true)} className="text-left px-3 py-1.5 rounded hover:bg-[#32363c] text-[#eee] font-medium cursor-pointer">
                        Share
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </div>

          {/* CONTENT AREA */}
          <div className="flex flex-col gap-3 items-center w-full h-full border-t border-white/5 rounded-b-3xl  overflow-y-auto custom-scroll relative">
            <AnimatePresence>
              {/* playground */}
              {!isLoading ? (
                <div className="flex flex-col gap-8 items-center w-full h-full max-h-full border-t border-white/5 rounded-b-3xl p-4 sm:p-8 relative bg-linear-to-br from-[#23272f] via-[#232831] to-[#292c37] overflow-y-auto">
                  {/* user img email username */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.5 },
                    }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 w-full rounded-3xl bg-[#1a1e25] py-8 px-2 sm:py-10 sm:px-12 shadow-2xl border border-[#32363c]"
                  >
                    {/* img */}
                    <div className="flex justify-center items-center mb-4 sm:mb-0">
                      <img
                        src={
                          reduxUser && reduxUser[0].profilePicture
                            ? reduxUser[0].profilePicture
                            : "/default-profile.png"
                        }
                        alt="Profile"
                        className="rounded-full w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 object-cover shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] ring-4 ring-[#FFD36990] transition-all duration-300 border-0"
                        loading="lazy"
                      />
                    </div>
                    {/* name email */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2">
                      <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold tracking-wide text-[#FFD369] drop-shadow-lg">{`${reduxUser[0].firstName} ${reduxUser[0].lastName}`}</h1>
                      <h3 className="text-base xs:text-lg sm:text-2xl text-[#eeeeeead] font-light">
                        {emailId}
                      </h3>
                    </div>
                  </motion.div>
                  {/* streak, gems, tracks */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.5 },
                    }}
                    className="flex flex-col xs:flex-row justify-center items-center gap-6 xs:gap-8 sm:gap-10 w-full mt-5 sm:mt-8 mb-4 sm:mb-6"
                  >
                    {/* Streak */}
                    <div className="flex flex-col items-center px-4 py-4 xs:px-6 xs:py-5 sm:px-8 sm:py-6 rounded-2xl bg-[#181c22] shadow-xl border border-[#423c308c] min-w-[100px] xs:min-w-[120px] sm:min-w-[140px] w-full xs:w-auto">
                      <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
                        <svg
                          width={32}
                          height={32}
                          className="xs:w-9 xs:h-9"
                          viewBox="0 0 75.371 75.368"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label="Streak Icon"
                        >
                          <rect
                            x="4.498"
                            y="27.319"
                            width="21.713"
                            height="21.715"
                            transform="matrix(0.707 -0.7072 0.7072 0.707 -22.5 22.0438)"
                            fill="#FFD369"
                          />
                          <rect
                            x="27.238"
                            y="4.497"
                            width="21.716"
                            height="21.718"
                            transform="matrix(0.7072 -0.707 0.707 0.7072 0.2973 31.4299)"
                            fill="#FFD369"
                          />
                          <rect
                            x="27.054"
                            y="49.371"
                            width="21.714"
                            height="21.718"
                            transform="matrix(0.7071 -0.7071 0.7071 0.7071 -31.4853 44.4482)"
                            fill="#FFD369"
                          />
                          <rect
                            x="49.385"
                            y="27.043"
                            width="21.716"
                            height="21.719"
                            transform="matrix(0.7071 -0.7071 0.7071 0.7071 -9.1567 53.6996)"
                            fill="#FFD369"
                          />
                        </svg>
                      </div>
                      <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-[#eeeeee]">
                        Streak
                      </h2>
                      <span className="mt-1 xs:mt-2 text-2xl xs:text-3xl font-bold text-[#FFD369] tracking-wide">
                        {reduxUser[0].streak[0]?.points
                          ?.toString()
                          .padStart(2, "0")}
                      </span>
                    </div>
                    {/* Gems */}
                    <div className="flex flex-col items-center px-4 py-4 xs:px-6 xs:py-5 sm:px-8 sm:py-6 rounded-2xl bg-[#181c22] shadow-xl border border-[#184b76ad] min-w-[100px] xs:min-w-[120px] sm:min-w-[140px] w-full xs:w-auto">
                      <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
                        <svg
                          width={32}
                          height={32}
                          className="xs:w-9 xs:h-9"
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label="Streak Icon"
                        >
                          <polygon
                            fill="#2B6AA6"
                            points="200.12,367.3 152.92,461.48 49.82,255.97 144.27,255.97 "
                          />
                          <polygon
                            fill="#1D5177"
                            points="200.12,144.65 144.27,255.97 49.82,255.97 152.92,50.52 "
                          />
                          <polygon
                            fill="#2B6AA6"
                            points="367.68,255.97 311.83,367.3 256.03,367.3 256.03,144.65 311.83,144.65 "
                          />
                          <polygon
                            fill="#1E8CF3"
                            points="256.03,144.65 256.03,367.3 200.12,367.3 144.27,255.97 200.12,144.65 "
                          />
                          <polygon
                            fill="#2B6AA6"
                            points="256.03,50.52 256.03,144.65 200.12,144.65 152.92,50.52 "
                          />
                          <polygon
                            fill="#1D5177"
                            points="359.08,50.52 311.83,144.65 256.03,144.65 256.03,50.52 "
                          />
                          <polygon
                            fill="#2B6AA6"
                            points="256.03,367.3 256.03,461.48 152.92,461.48 200.12,367.3 "
                          />
                          <polygon
                            fill="#1D5177"
                            points="359.08,461.48 256.03,461.48 256.03,367.3 311.83,367.3 "
                          />
                          <polygon
                            fill="#3B93E6"
                            points="462.18,255.97 359.08,461.48 311.83,367.3 367.68,255.97 "
                          />
                          <polygon
                            fill="#5BA5EA"
                            points="462.18,255.97 367.68,255.97 311.83,144.65 359.08,50.52 "
                          />
                        </svg>
                      </div>
                      <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-[#eeeeee]">
                        Gems
                      </h2>
                      <span className="mt-1 xs:mt-2 text-2xl xs:text-3xl font-bold text-[#62a9fa] tracking-wide">
                        {reduxUser[0].gems?.toString().padStart(2, "0")}
                      </span>
                    </div>
                    {/* Tracks */}
                    <div className="flex flex-col items-center px-4 py-4 xs:px-6 xs:py-5 sm:px-8 sm:py-6 rounded-2xl bg-[#181c22] shadow-xl border border-[#801eaf8c] min-w-[100px] xs:min-w-[120px] sm:min-w-[140px] w-full xs:w-auto">
                      <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
                        <svg
                          className="w-8 h-8 xs:w-9 xs:h-9"
                          version="1.1"
                          id="Layer_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 24 24"
                          style={{ enableBackground: "new 0 0 24 24" }}
                          xmlSpace="preserve"
                        >
                          <defs>
                            <linearGradient
                              id="SVGID_1_"
                              gradientUnits="userSpaceOnUse"
                              x1="2.3887"
                              y1="11.6509"
                              x2="22.2054"
                              y2="11.6509"
                            >
                              <stop offset="0" stopColor="#1245C6"></stop>
                              <stop offset="1" stopColor="#9909B7"></stop>
                            </linearGradient>
                          </defs>
                          <path
                            className="st0"
                            d="M21.5,15.2H3.1c-0.2,0-0.4,0.1-0.5,0.2c-0.1,0.1-0.2,0.3-0.2,0.5v2.8c0,0.2,0.1,0.4,0.2,0.5
                      c0.1,0.1,0.3,0.2,0.5,0.2h18.4c0.2,0,0.4-0.1,0.5-0.2c0.1-0.1,0.2-0.3,0.2-0.5v-2.8c0-0.2-0.1-0.4-0.2-0.5
                      C21.9,15.3,21.7,15.2,21.5,15.2z M20.8,18h-7.1v-1.4h7.1L20.8,18L20.8,18z M21.5,9.5H3.1c-0.2,0-0.4,0.1-0.5,0.2
                      C2.5,9.9,2.4,10,2.4,10.2v2.8c0,0.2,0.1,0.4,0.2,0.5c0.1,0.1,0.3,0.2,0.5,0.2h18.4c0.2,0,0.4-0.1,0.5-0.2c0.1-0.1,0.2-0.3,0.2-0.5
                      v-2.8c0-0.2-0.1-0.4-0.2-0.5C21.9,9.6,21.7,9.5,21.5,9.5z M20.8,12.4H9.5v-1.4h11.3V12.4z M22,4.1c-0.1-0.1-0.3-0.2-0.5-0.2H3.1
                      c-0.2,0-0.4,0.1-0.5,0.2C2.5,4.2,2.4,4.4,2.4,4.6v2.8c0,0.2,0.1,0.4,0.2,0.5C2.7,8,2.9,8.1,3.1,8.1h18.4c0.2,0,0.4-0.1,0.5-0.2
                      c0.1-0.1,0.2-0.3,0.2-0.5V4.6C22.2,4.4,22.1,4.2,22,4.1z M20.8,6.7h-4.2V5.3h4.2V6.7z"
                            fill="url(#SVGID_1_)"
                          ></path>
                        </svg>
                      </div>
                      <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-[#eeeeee]">
                        Tracks
                      </h2>
                      <span className="mt-1 xs:mt-2 text-2xl xs:text-3xl font-bold text-[#bc5fee] tracking-wide">
                        {tracksLength?.toString().padStart(2, "0")}
                      </span>
                    </div>
                  </motion.div>
                  {/* daily reward section */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.5 },
                    }}
                    className="w-full px-2 sm:px-0 mt-6 sm:mt-8"
                  >
                    <div className="bg-[#25304bce] border border-[#eeeeee29] rounded-2xl py-5 px-4 sm:py-7 sm:px-8 shadow-inner flex flex-col items-center gap-2 sm:gap-3 max-w-md sm:max-w-xl mx-auto">
                      <h1 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-[#FFD369] tracking-wide drop-shadow-sm">
                        Daily Reward
                      </h1>
                      <p className="text-sm xs:text-base sm:text-lg text-[#eeeeeecc]">
                        {reduxUser[0].dailyReward
                          ? `${reduxUser[0].dailyReward}`
                          : "Not created yet"}
                      </p>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <LoadingScreen />
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
            ].map((btn, key) => (
              <button
                key={`${key}`}
                onClick={() => navigate(btn.path)}
                className="flex flex-col justify-center items-center h-full w-full rounded-xl hover:bg-white/5 transition-all text-white/80 cursor-pointer"
              >
                <span className="text-sm mt-1">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* laptop  */}
      <div className="hidden mt-18 w-[70%] h-[90%] bg-[#0F1115] lg:flex flex-col items-center rounded-lg px-6 ">
        <motion.h1
          initial={{ opacity: 0, y: -40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
          className="text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-amber-200 to-yellow-500 drop-shadow-[0_2px_12px_rgba(251,176,59,0.15)] select-none"
        >
          AuraMind
        </motion.h1>
        {/* body */}
        <div className="flex flex-col items-center justify-between w-full h-[92%] rounded-2xl ">
          <div className="flex justify-between  items-center w-full py-2">
            <h1 className="text-left w-full p-2 text-2xl">My Profile</h1>
            {/* Settings Button */}

            <div className="relative flex items-center ml-2">
              <motion.button
                whileTap={{ scale: 0.85, rotate: 30 }}
                whileHover={{ scale: 1.15, rotate: 15 }}
                className="p-2 rounded-full bg-[#232831] hover:bg-[#32353c] focus:bg-[#2a2e35] border border-[#80808042] shadow transition-all cursor-pointer"
                aria-label="Settings"
                onClick={() => setShowSettings((prev) => !prev)}
                type="button"
              >
                <svg
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  width={32}
                  height={32}
                  viewBox="0 0 548.172 548.172"
                  style={{ enableBackground: "new 0 0 548.172 548.172" }}
                  xmlSpace="preserve"
                >
                  <g>
                    <g>
                      {/* Main Gear Path */}
                      <motion.path
                        d="M333.186,376.438c0-1.902-0.668-3.806-1.999-5.708c-10.66-12.758-19.223-23.702-25.697-32.832
                        c3.997-7.803,7.043-15.037,9.131-21.693l44.255-6.852c1.718-0.194,3.241-1.19,4.572-2.994c1.331-1.816,1.991-3.668,1.991-5.571
                        v-52.822c0-2.091-0.66-3.949-1.991-5.564s-2.95-2.618-4.853-2.993l-43.4-6.567c-2.098-6.473-5.331-14.281-9.708-23.413
                        c2.851-4.19,7.139-9.902,12.85-17.131c5.709-7.234,9.713-12.371,11.991-15.417c1.335-1.903,1.999-3.713,1.999-5.424
                        c0-5.14-13.706-20.367-41.107-45.683c-1.902-1.52-3.901-2.281-6.002-2.281c-2.279,0-4.182,0.659-5.712,1.997L245.815,150.9
                        c-7.801-3.996-14.939-6.945-21.411-8.854l-6.567-43.68c-0.187-1.903-1.14-3.571-2.853-4.997c-1.714-1.427-3.617-2.142-5.713-2.142
                        h-53.1c-4.377,0-7.232,2.284-8.564,6.851c-2.286,8.757-4.473,23.416-6.567,43.968c-8.183,2.664-15.511,5.71-21.982,9.136
                        l-32.832-25.693c-1.903-1.335-3.901-1.997-5.996-1.997c-3.621,0-11.138,5.614-22.557,16.846
                        c-11.421,11.228-19.229,19.698-23.413,25.409c-1.334,1.525-1.997,3.428-1.997,5.712c0,1.711,0.662,3.614,1.997,5.708
                        c10.657,12.756,19.221,23.7,25.694,32.832c-3.996,7.808-7.04,15.037-9.132,21.698l-44.255,6.848
                        c-1.715,0.19-3.236,1.188-4.57,2.993C0.666,243.35,0,245.203,0,247.105v52.819c0,2.095,0.666,3.949,1.997,5.564
                        c1.334,1.622,2.95,2.525,4.857,2.714l43.396,6.852c2.284,7.23,5.618,15.037,9.995,23.411c-3.046,4.191-7.517,9.999-13.418,17.418
                        c-5.905,7.427-9.805,12.471-11.707,15.133c-1.332,1.903-1.999,3.717-1.999,5.421c0,5.147,13.706,20.369,41.114,45.687
                        c1.903,1.519,3.899,2.275,5.996,2.275c2.474,0,4.377-0.66,5.708-1.995l33.689-25.406c7.801,3.997,14.939,6.943,21.413,8.847
                        l6.567,43.684c0.188,1.902,1.142,3.572,2.853,4.996c1.713,1.427,3.616,2.139,5.711,2.139h53.1c4.38,0,7.233-2.282,8.566-6.851
                        c2.284-8.949,4.471-23.698,6.567-44.256c7.611-2.275,14.938-5.235,21.982-8.846l32.833,25.693
                        c1.903,1.335,3.901,1.995,5.996,1.995c3.617,0,11.091-5.66,22.415-16.991c11.32-11.317,19.175-19.842,23.555-25.55
                        C332.518,380.53,333.186,378.724,333.186,376.438z M234.397,325.626c-14.272,14.27-31.499,21.408-51.673,21.408
                        c-20.179,0-37.406-7.139-51.678-21.408c-14.274-14.277-21.412-31.505-21.412-51.68c0-20.174,7.138-37.401,21.412-51.675
                        c14.272-14.275,31.5-21.411,51.678-21.411c20.174,0,37.401,7.135,51.673,21.411c14.277,14.274,21.413,31.501,21.413,51.675
                        C255.81,294.121,248.675,311.349,234.397,325.626z"
                        fill="#FFD369"
                        style={{ originX: "50%", originY: "50%" }}
                        animate={showSettings ? { rotate: 360 } : { rotate: 0 }}
                        transition={
                          showSettings
                            ? { repeat: Infinity, ease: "linear", duration: 1 }
                            : { duration: 0.35 }
                        }
                      />

                      {/* Bottom Right Gear Cluster */}
                      <motion.path
                        d="M505.628,391.29c-2.471-5.517-5.329-10.465-8.562-14.846c9.709-21.512,14.558-34.646,14.558-39.402
                        c0-0.753-0.373-1.424-1.14-1.995c-22.846-13.322-34.643-19.985-35.405-19.985l-1.711,0.574
                        c-7.803,7.807-16.563,18.463-26.266,31.977c-3.805-0.379-6.656-0.574-8.559-0.574c-1.909,0-4.76,0.195-8.569,0.574
                        c-2.655-4-7.61-10.427-14.842-19.273c-7.23-8.846-11.611-13.277-13.134-13.277c-0.38,0-3.234,1.522-8.566,4.575
                        c-5.328,3.046-10.943,6.276-16.844,9.709c-5.906,3.433-9.229,5.328-9.992,5.711c-0.767,0.568-1.144,1.239-1.144,1.992
                        c0,4.764,4.853,17.888,14.559,39.402c-3.23,4.381-6.089,9.329-8.562,14.842c-28.363,2.851-42.544,5.805-42.544,8.85v39.968
                        c0,3.046,14.181,5.996,42.544,8.85c2.279,5.141,5.137,10.089,8.562,14.839c-9.706,21.512-14.559,34.646-14.559,39.402
                        c0,0.76,0.377,1.431,1.144,1.999c23.216,13.514,35.022,20.27,35.402,20.27c1.522,0,5.903-4.473,13.134-13.419
                        c7.231-8.948,12.18-15.413,14.842-19.41c3.806,0.373,6.66,0.564,8.569,0.564c1.902,0,4.754-0.191,8.559-0.564
                        c2.659,3.997,7.611,10.462,14.842,19.41c7.231,8.946,11.608,13.419,13.135,13.419c0.38,0,12.187-6.759,35.405-20.27
                        c0.767-0.568,1.14-1.235,1.14-1.999c0-4.757-4.855-17.891-14.558-39.402c3.426-4.75,6.279-9.698,8.562-14.839
                        c28.362-2.854,42.544-5.804,42.544-8.85v-39.968C548.172,397.098,533.99,394.144,505.628,391.29z M464.37,445.962
                        c-7.128,7.139-15.745,10.715-25.834,10.715c-10.092,0-18.705-3.576-25.837-10.715c-7.139-7.139-10.712-15.748-10.712-25.837
                        c0-9.894,3.621-18.466,10.855-25.693c7.23-7.231,15.797-10.849,25.693-10.849c9.894,0,18.466,3.614,25.7,10.849
                        c7.228,7.228,10.849,15.8,10.849,25.693C475.078,430.214,471.512,438.823,464.37,445.962z"
                        fill="#FFD369"
                        style={{ originX: "50%", originY: "50%" }}
                        animate={showSettings ? { rotate: 360 } : { rotate: 0 }}
                        transition={
                          showSettings
                            ? { repeat: Infinity, ease: "linear", duration: 1 }
                            : { duration: 0.35 }
                        }
                      />

                      {/* Top Right Gear Cluster */}
                      <motion.path
                        d="M505.628,98.931c-2.471-5.52-5.329-10.468-8.562-14.849c9.709-21.505,14.558-34.639,14.558-39.397
                        c0-0.758-0.373-1.427-1.14-1.999c-22.846-13.323-34.643-19.984-35.405-19.984l-1.711,0.57
                        c-7.803,7.808-16.563,18.464-26.266,31.977c-3.805-0.378-6.656-0.57-8.559-0.57c-1.909,0-4.76,0.192-8.569,0.57
                        c-2.655-3.997-7.61-10.42-14.842-19.27c-7.23-8.852-11.611-13.276-13.134-13.276c-0.38,0-3.234,1.521-8.566,4.569
                        c-5.328,3.049-10.943,6.283-16.844,9.71c-5.906,3.428-9.229,5.33-9.992,5.708c-0.767,0.571-1.144,1.237-1.144,1.999
                        c0,4.758,4.853,17.893,14.559,39.399c-3.23,4.38-6.089,9.327-8.562,14.847c-28.363,2.853-42.544,5.802-42.544,8.848v39.971
                        c0,3.044,14.181,5.996,42.544,8.848c2.279,5.137,5.137,10.088,8.562,14.847c-9.706,21.51-14.559,34.639-14.559,39.399
                        c0,0.757,0.377,1.426,1.144,1.997c23.216,13.513,35.022,20.27,35.402,20.27c1.522,0,5.903-4.471,13.134-13.418
                        c7.231-8.947,12.18-15.415,14.842-19.414c3.806,0.378,6.66,0.571,8.569,0.571c1.902,0,4.754-0.193,8.559-0.571
                        c2.659,3.999,7.611,10.466,14.842,19.414c7.231,8.947,11.608,13.418,13.135,13.418c0.38,0,12.187-6.757,35.405-20.27
                        c0.767-0.571,1.14-1.237,1.14-1.997c0-4.76-4.855-17.889-14.558-39.399c3.426-4.759,6.279-9.707,8.562-14.847
                        c28.362-2.853,42.544-5.804,42.544-8.848v-39.971C548.172,104.737,533.99,101.787,505.628,98.931z M464.37,153.605
                        c-7.128,7.139-15.745,10.708-25.834,10.708c-10.092,0-18.705-3.569-25.837-10.708c-7.139-7.135-10.712-15.749-10.712-25.837
                        c0-9.897,3.621-18.464,10.855-25.697c7.23-7.233,15.797-10.85,25.693-10.85c9.894,0,18.466,3.621,25.7,10.85
                        c7.228,7.232,10.849,15.8,10.849,25.697C475.078,137.856,471.512,146.47,464.37,153.605z"
                        fill="#FFD369"
                        style={{ originX: "50%", originY: "50%" }}
                        animate={showSettings ? { rotate: 360 } : { rotate: 0 }}
                        transition={
                          showSettings
                            ? { repeat: Infinity, ease: "linear", duration: 1 }
                            : { duration: 0.35 }
                        }
                      />
                    </g>
                  </g>
                </svg>
              </motion.button>
              {/* AnimatePresence settings dropdown/modal (demo) */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.17 }}
                    className="absolute top-full right-0 z-20 mt-2 min-w-[170px] bg-[#232831] border border-[#42414a65] rounded-xl shadow-2xl p-3"
                  >
                    <div className="flex flex-col gap-2">
                      <button className="text-left px-3 py-1.5 rounded hover:bg-[#32363c] text-[#FFD369] font-medium cursor-pointer">
                        Edit Profile
                      </button>
                      <button
                        onClick={() => setShareThis(true)}
                        className="text-left px-3 py-1.5 rounded hover:bg-[#32363c] text-[#eee] font-medium cursor-pointer "
                      >
                        Share
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* playground */}
          {!isLoading ? (
            <div
              className="
    flex  gap-10 items-center 
    w-full h-full max-h-full 
    rounded-2xl p-6 relative 
    overflow-y-auto
    bg-linear-to-br from-[#0E0F14] via-[#1A1D23] to-[#0E0F14]
    backdrop-blur-2xl
    border border-white/10
    shadow-[0_20px_60px_-10px_rgba(0,0,0,0.60)]
  "
            >
              {/* user img email username */}
              <div
                className="
      flex flex-col justify-center items-center 
      gap-8 w-1/3 
      rounded-3xl 
      py-10 px-6 sm:px-14 
      bg-[#151820]/80 
      backdrop-blur-xl 
      border border-[#ffffff15] 
      shadow-[0_20px_50px_-12px_rgba(255,211,105,0.25)]
      hover:shadow-[0_25px_70px_-10px_rgba(255,211,105,0.45)]
      transition-all duration-500
    "
              >
                {/* img */}
                <div className="flex  justify-center items-center">
                  {/* <iframe src={reduxUser && reduxUser[0].profilePicture
                        ? reduxUser[0].profilePicture
                        : "/default-profile.png"} frameborder="0"></iframe> */}
                  <img
                    src={
                      reduxUser && reduxUser[0].profilePicture
                        ? reduxUser[0].profilePicture
                        : "/default-profile.png"
                    }
                    title="Profile"
                    className="
          rounded-full w-28 h-28 sm:w-40 sm:h-40 object-cover 
          shadow-[0_20px_50px_rgba(255,211,105,0.2)]
          ring-4 ring-[#FFD36980]
          transition-all duration-500 hover:scale-[1.03]
        "
                  />
                </div>

                {/* name email */}
                <div
                  className="
        flex flex-col items-center sm:items-start 
        text-center sm:text-left gap-2
      "
                >
                  <h1 className="text-2xl text-center w-full  font-bold tracking-wide text-[#FFD369] drop-shadow-lg">
                    {`${reduxUser[0].firstName} ${reduxUser[0].lastName}`}
                  </h1>
                  <h3 className="text-lg text-center w-full text-[#e6e6e6a9] font-light">
                    {emailId}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col  items-center w-full">
                {/* streak, gems, tracks */}

                <div
                  className="
      flex  justify-center items-center 
      gap-6 xs:gap-10 sm:gap-14 w-full
      mt-4
    "
                >
                  {/* Streak */}
                  <div
                    className="
        flex flex-col items-center justify-center
        px-6 py-6 
        sm:px-10 sm:py-8
        rounded-2xl 
        w-full xs:w-auto
        bg-[#11141a]/70 
        border border-[#FFD36940]
        shadow-[0_8px_30px_-6px_rgba(255,211,105,0.25)]
        backdrop-blur-xl
        transition-all duration-500
        hover:shadow-[0_12px_40px_-6px_rgba(255,211,105,0.45)]
      "
                  >
                    <div className="mb-4">{/* icon stays same */}</div>

                    <h2 className="text-lg sm:text-2xl font-semibold text-[#eeeeee]">
                      Streak
                    </h2>
                    <span className="mt-2 text-3xl sm:text-4xl font-bold text-[#FFD369] tracking-wide">
                      {reduxUser[0].streak[0]?.points
                        ?.toString()
                        .padStart(2, "0")}
                    </span>
                  </div>

                  {/* Gems */}
                  <div
                    className="
        flex flex-col items-center justify-center
        px-6 py-6 
        sm:px-10 sm:py-8
        rounded-2xl 
        w-full xs:w-auto
        bg-[#11141a]/70 
        border border-[#62a9fa40]
        shadow-[0_8px_30px_-6px_rgba(98,169,250,0.25)]
        backdrop-blur-xl
        transition-all duration-500
        hover:shadow-[0_12px_40px_-6px_rgba(98,169,250,0.45)]
      "
                  >
                    <div className="mb-4">{/* icon stays same */}</div>

                    <h2 className="text-lg sm:text-2xl font-semibold text-[#eeeeee]">
                      Gems
                    </h2>
                    <span className="mt-2 text-3xl sm:text-4xl font-bold text-[#62a9fa] tracking-wide">
                      {reduxUser[0].gems?.toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* Tracks */}
                  <div
                    className="
        flex flex-col items-center justify-center
        px-6 py-6 
        sm:px-10 sm:py-8
        rounded-2xl 
        w-full xs:w-auto
        bg-[#11141a]/70 
        border border-[#bc5fee40]
        shadow-[0_8px_30px_-6px_rgba(188,95,238,0.25)]
        backdrop-blur-xl
        transition-all duration-500
        hover:shadow-[0_12px_40px_-6px_rgba(188,95,238,0.45)]
      "
                  >
                    <div className="mb-4">{/* icon stays same */}</div>

                    <h2 className="text-lg sm:text-2xl font-semibold text-[#eeeeee]">
                      Tracks
                    </h2>
                    <span className="mt-2 text-3xl sm:text-4xl font-bold text-[#bc5fee] tracking-wide">
                      {tracksLength?.toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* daily reward */}
                <div className="w-full px-2  mt-8">
                  <div
                    className="
        bg-[#1b2331]/70 
        border border-white/10 
        backdrop-blur-xl
        rounded-2xl 
        py-8 px-6 
        shadow-[inset_0_0_30px_rgba(0,0,0,0.4)]
        flex flex-col items-center gap-3 
         mx-auto
      "
                  >
                    <h1 className="text-3xl sm:text-4xl font-semibold text-[#FFD369] tracking-wide drop-shadow">
                      Daily Reward
                    </h1>

                    <p className="text-base sm:text-lg text-[#e6e6e6c0]">
                      {reduxUser[0].dailyReward
                        ? `${reduxUser[0].dailyReward}`
                        : "Not created yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <LoadingScreen />
          )}
        </div>
      </div>

      {shareThis && (
            <AnimatePresence>
              <ShareSection
                onClose={() => setShareThis(false)}
                data={{
                  name: `${reduxUser[0].firstName} ${reduxUser[0].lastName}`,
                  streak : reduxUser[0].streak[0]?.points?.toString().padStart(2, "0"),
                  gems : reduxUser[0].gems?.toString().padStart(2, "0"),tracks : tracksLength?.toString().padStart(2, "0")
                }}
              />
            </AnimatePresence>
          
          )}
    </div>
  );
}

export default Profile;
