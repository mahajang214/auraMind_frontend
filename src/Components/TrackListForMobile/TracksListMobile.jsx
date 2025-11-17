import { motion, AnimatePresence } from "framer-motion";

const TracksListMobile = ({ tracks, handleActiveTrack, debugKey }) => {
  if (!Array.isArray(tracks) || tracks.length === 0) return null;

  return (
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
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#00FF8C">
                <path d="M21 2.992v18.016a1 1 0 0 1-.993.992H3.993A.993.993 0 0 1 3 21.008V2.992A1 1 0 0 1 3.993 2h16.014c.548 0 .993.444.993.992zm-9.707 10.13l-2.475-2.476-1.414 1.415 3.889 3.889 5.657-5.657-1.414-1.414-4.243 4.242z"></path>
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#FF6B6B">
                <path d="M21 2.992v18.016a1 1 0 0 1-.993.992H3.993A.993.993 0 0 1 3 21.008V2.992A1 1 0 0 1 3.993 2h16.014c.548 0 .993.444.993.992zM19 4H5v16h14V4z"></path>
              </svg>
            )}
            <h2 className="text-base font-medium truncate">{track.title}</h2>
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
  );
};

export default TracksListMobile;
