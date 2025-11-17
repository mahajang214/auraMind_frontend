import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaArrowLeft, FaTrash } from "react-icons/fa";
import { debugKey } from "../Debuger/DebugKeys";


export default function HabitCards({ allHabits, deleteHabit }) {
    const habits = allHabits[0]?.habits || [];
  
    // Pagination
    const [index, setIndex] = useState(0);
    const itemsPerPage = 2; // you can change this
  
    const next = () => {
      if (index < habits.length - itemsPerPage) setIndex(index + itemsPerPage);
    };
  
    const back = () => {
      if (index > 0) setIndex(index - itemsPerPage);
    };
  
    return (
      <>
        {/* HABIT LIST */}
        <div className="flex gap-4 h-full items-center w-full rounded-b-2xl py-2 overflow-x-auto">
          {habits.length > 0 ? (
            habits.slice(index, index + itemsPerPage).map((item,key) => (
              <motion.div
              key={debugKey(key, item, "ALL HABIT CARDS LIST")}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="
                  group relative w-[800px] bg-[#222831] rounded-lg 
                  hover:rounded-t-3xl hover:rounded-b-none
                  text-white px-4 py-6 my-2
                  transition-all duration-500 
                  hover:bg-[#2d333b] 
                  hover:shadow-[0_0_10px_rgba(18,69,198,0.4)]
                  overflow-y-visible
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    w-full bg-red-500 absolute left-0 rounded-b-3xl py-2 cursor-pointer
                    transition-all duration-500 z-10 flex items-center justify-center gap-2
                    opacity-0 group-hover:opacity-100
                    bottom-0 group-hover:-bottom-10
                  "
                  onClick={() => deleteHabit(item._id)}
                >
                  <FaTrash /> Delete
                </motion.button>
              </motion.div>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-8">
              <span className="text-lg text-gray-400">No habits created yet.</span>
            </div>
          )}
        </div>
  
        {/* NEXT - BACK Buttons */}
        {habits.length > itemsPerPage && (
          <div className="flex items-center justify-end w-full gap-4 mt-4 h-full">
  
            {/* Back */}
            <button
              onClick={back}
              disabled={index === 0}
              className="px-4 py-2 bg-gray-700 text-white rounded-md flex items-center gap-2
              hover:bg-gray-600 transition disabled:opacity-40"
            >
              <FaArrowLeft /> Back
            </button>
  
            {/* Next */}
            <button
              onClick={next}
              disabled={index >= habits.length - itemsPerPage}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md flex items-center gap-2
              hover:bg-cyan-500 transition disabled:opacity-40"
            >
              Next <FaArrowRight />
            </button>
          </div>
        )}
      </>
    );
  }
  