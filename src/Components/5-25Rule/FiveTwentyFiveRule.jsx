import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function FiveTwentyFiveRule() {
  const [allGoals, setAllGoals] = useState(Array(25).fill(""));
  const [selected, setSelected] = useState([]);

  const handleInputChange = (index, value) => {
    const updated = [...allGoals];
    updated[index] = value;
    setAllGoals(updated);
  };

  const toggleSelect = (i) => {
    if (selected.includes(i)) {
      setSelected(selected.filter((s) => s !== i));
    } else if (selected.length < 5) {
      setSelected([...selected, i]);
    }
  };

  const topFive = selected.map((i) => allGoals[i]);
  const avoidList = allGoals.filter((_, i) => !selected.includes(i));

  return (
    <div className="w-full h-full flex flex-col items-center py-10 bg-[#211E28]/40 border border-white/6 lg:bg-[#0f0f0f] text-white px-4 scroll-auto overflow-y-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-linear-to-r from-[#00ADB5] to-[#41DC1E] bg-clip-text text-transparent"
      >
        Warren Buffett 5/25 Rule
      </motion.h1>

      {/* 25 Goals Input Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="mt-10 w-full  bg-[#1b1b1b]/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6"
      >
        <h2 className="text-2xl font-semibold mb-4 text-[#00ADB5]">
          Write Your 25 Goals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {allGoals.map((goal, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selected.includes(i)
                  ? "border-[#41DC1E] bg-[#41DC1E]/10 shadow-lg"
                  : "border-white/10 bg-[#0f0f0f]/40"
              }`}
              onClick={() => toggleSelect(i)}
            >
              <input
                type="text"
                placeholder={`Goal ${i + 1}`}
                value={goal}
                onChange={(e) => handleInputChange(i, e.target.value)}
                className="w-full bg-transparent outline-none  text-white"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top 5 Section */}
      <AnimatePresence>
        {selected.length === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-10 w-full max-w-3xl bg-linear-to-br from-[#00ADB5]/30 to-[#41DC1E]/30 border border-[#00ADB5]/40 shadow-2xl rounded-3xl p-6 backdrop-blur-xl"
          >
            <h2 className="text-3xl font-semibold text-[#41DC1E] mb-4">
              Your Top 5 Priority Goals
            </h2>
            <ul className="space-y-3 text-lg">
              {topFive.map((g, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-[#1b1b1b]/70 rounded-xl border border-[#41DC1E]/40"
                >
                  {g || "(empty)"}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avoid List */}
      <AnimatePresence>
        {selected.length === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-10 w-full max-w-3xl bg-[#1b1b1b]/40 border border-white/10 shadow-xl rounded-3xl p-6 backdrop-blur"
          >
            <h2 className="text-2xl font-semibold text-red-400 mb-4">
              Avoid At All Costs (Other 20)
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-md text-white/60">
              {avoidList.map((g, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-[#0f0f0f]/40 rounded-xl border border-white/5"
                >
                  {g || "(empty)"}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
