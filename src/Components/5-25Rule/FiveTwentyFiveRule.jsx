import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import LoadingScreen from "../Utils/LoadingScreen";
import axios from "axios";
import { showToast } from "../Utils/ToastService";

export default function FiveTwentyFiveRule() {
  const [allGoals, setAllGoals] = useState(Array(25).fill(""));
  const [selected, setSelected] = useState([]);
  const token = localStorage.getItem("jwtToken");
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(false);

  // -----------------------------
  // INPUT HANDLER
  // -----------------------------
  const handleInputChange = (i, value) => {
    const updated = [...allGoals];
    updated[i] = value;
    setAllGoals(updated);
  };

  // -----------------------------
  // SELECT / DESELECT
  // -----------------------------
  const toggleSelect = (i) => {
    if (selected.includes(i)) {
      setSelected(selected.filter((x) => x !== i));
    } else if (selected.length < 5) {
      setSelected([...selected, i]);
    }
  };

  const topFive = selected.map((i) => allGoals[i]);
  const avoidList = allGoals.filter((_, i) => !selected.includes(i));

  // -----------------------------
  // GET from BACKEND
  // -----------------------------
  const getAllGoals = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(`${backendURL}/api/features/get-5-25`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLoading(false);

      const data = res.data.data;

      if (
        !data ||
        data.fiveGoals.length !== 5 ||
        data.twentyGoals.length !== 20
      ) {
        setAllGoals(Array(25).fill(""));
        setSelected([]);
        return;
      }

      setAllGoals([...data.fiveGoals, ...data.twentyGoals]);
      setSelected([0, 1, 2, 3, 4]);
    } catch (err) {
      setIsLoading(false);
      showToast("error", "Unable to load goals");
    }
  };

  // -----------------------------
  // UPDATE (SAVE TOP 5 + AVOID 20)
  // -----------------------------
  const updateAllGoals = async () => {
    try {
      const five = selected.map((i) => allGoals[i]);
      const twenty = allGoals.filter((_, i) => !selected.includes(i));

      const res = await axios.post(
        `${backendURL}/api/features/update-5-25`,
        { fiveGoals:five, twentyGoals:twenty },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showToast("success", "Goals updated!");
    } catch (err) {
      showToast("error", "Update failed");
      console.log("Updation error: ",err.message)
    }
  };

  // -----------------------------
  // RESET (NEW 25 EMPTY GOALS)
  // -----------------------------
  const resetAllGoalsFunc = async () => {
    try {
      await axios.patch(
        `${backendURL}/api/features/reset-5-25`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAllGoals(Array(25).fill(""));
      setSelected([]);

      showToast("success", "Reset complete!");
    } catch (err) {
      showToast("error", "Reset failed");
    }
  };

  useEffect(() => {
    getAllGoals();
  }, []);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="w-full h-full lg:h-[98%]  flex flex-col items-center py-10 bg-[#211E28]/40 border border-white/6 lg:bg-[#0f0f0f] text-white px-4 scroll-auto overflow-y-auto">
      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-linear-to-r from-[#00ADB5] to-[#41DC1E] bg-clip-text text-transparent"
      >
        Warren Buffett 5/25 Rule
      </motion.h1>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={updateAllGoals}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-xl shadow-lg"
        >
          Save / Update
        </button>

        <button
          onClick={resetAllGoalsFunc}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-xl shadow-lg"
        >
          Reset All
        </button>
      </div>

      {/* INPUTS */}
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          className="mt-10 w-full bg-[#1b1b1b]/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 text-[#00ADB5]">
            Write Your 25 Goals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allGoals.map((goal, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                onClick={() => toggleSelect(i)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selected.includes(i)
                    ? "border-[#41DC1E] bg-[#41DC1E]/10 shadow-lg"
                    : "border-white/10 bg-[#0f0f0f]/40"
                }`}
              >
                <input
                  type="text"
                  placeholder={`Goal ${i + 1}`}
                  value={goal}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  className="w-full bg-transparent outline-none text-white"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TOP 5 SECTION */}
      <AnimatePresence>
        {selected.length === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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

      {/* AVOID LIST */}
      <AnimatePresence>
        {selected.length === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 w-full max-w-3xl bg-[#1b1b1b]/40 border border-white/10 rounded-3xl p-6 backdrop-blur"
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
