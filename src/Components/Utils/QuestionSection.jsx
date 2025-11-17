import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "./ToastService";

const QuestionSection = ({ gems, allQuestions }) => {
  // show only remaining questions if gems > 0
  const questionsToAsk = gems === 0 ? allQuestions : allQuestions.slice(gems);
 

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const token = localStorage.getItem("jwtToken");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async () => {
    const currentQuestion = questionsToAsk[currentIndex];
    if (!answer.trim()) {
      showToast("error", "Please write your answer before continuing.");
      return;
    }

    setLoading(true);
    try {
      // Uncomment this when backend route ready
      const res = await axios.put(
        `${baseUrl}/api/features/update-whoami-questions`,
        { question: currentQuestion, answer },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

    //   console.log("Saved:", { question: currentQuestion, answer });
      showToast("success", "Answer saved successfully!");
    //   console.log("saved to db : ",res.data.data);

      // go to next question
      if (currentIndex < questionsToAsk.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setAnswer("");
      } else {
        setCompleted(true);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      showToast("error", "Failed to save answer.");
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center text-center w-full h-full p-6 text-white"
      >
        <h2 className="text-2xl font-bold text-[#00ADB5]">🎉 All Done!</h2>
        <p className="mt-3 text-[#EEEEEE]">
          You’ve completed all reflection questions.
        </p>
      </motion.div>
    );
  }

  const currentQuestion = questionsToAsk[currentIndex];

  return (<>
    <div className="flex flex-col gap-3 items-center w-full h-full  rounded-b-2xl p-4 relative overflow-y-auto">
      <h1 className="text-xl lg:text-left w-full text-[#EEEEEE] font-semibold mb-2">
        Self Reflection 
      </h1>

      <AnimatePresence mode="wait">
        <motion.div
          
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:hidden bg-[#222831] text-white p-4 rounded-xl shadow-md"
        >
          <h2 className="font-medium mb-2">
            {currentIndex + 1}. {currentQuestion}
          </h2>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full bg-[#393E46] text-[#EEEEEE] rounded-lg p-2 outline-none resize-none h-24 lg:h-84 focus:ring-2 focus:ring-[#00ADB5] transition"
            placeholder="Write your answer here..."
          ></textarea>
        </motion.div>
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        disabled={loading}
        onClick={handleSubmit}
        className="mt-4 lg:hidden bg-[#00ADB5] text-white px-6 py-2 rounded-full  cursor-pointer shadow-md hover:bg-[#00bfc7] transition-all "
      >
        {loading
          ? "Saving..."
          : currentIndex < questionsToAsk.length - 1
          ? "Next Question →"
          : "Finish ✨"}
      </motion.button>
      {/* laptops */}
      <div className="hidden lg:flex justify-end items-end w-full">
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        disabled={loading}
        onClick={handleSubmit}
        className="mt-4 bg-[#00ADB5] text-white px-6 py-2 rounded-full lg:rounded-lg cursor-pointer shadow-md hover:bg-[#00bfc7] transition-all duration-500 hover:font-bold hover:px-12"
      >
        {loading
          ? "Saving..."
          : currentIndex < questionsToAsk.length - 1
          ? "Next Question →"
          : "Finish ✨"}
      </motion.button>
      </div>

      <p className="text-sm text-[#EEEEEE80] mt-2">
        {currentIndex + 1} / {questionsToAsk.length}
      </p>
    </div>

    
    </>
  );
};

export default QuestionSection;
