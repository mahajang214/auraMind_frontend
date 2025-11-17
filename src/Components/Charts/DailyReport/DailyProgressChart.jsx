import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DailyProgressChart = ({ dailyReports }) => {
  // ✅ Transform data for Recharts
  const chartData = dailyReports.map((report) => ({
    name: report.dayName || new Date(report.date).toLocaleDateString("en-US", { weekday: "short" }),
    totalTasks: report.totalTasks,
    completedTasks: report.completedTasks,
   
  }));

  return (
    <div className="w-full h-[400px] bg-[#222831] p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4 text-center">
        Daily Task Progress 📊
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#EEEEEE" />
          <YAxis stroke="#EEEEEE" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#393E46",
              borderRadius: "8px",
              color: "#EEEEEE",
            }}
          />
          <Legend wrapperStyle={{ color: "#EEEEEE" }} />
          {/* ✅ Grouped Bars */}
          <Bar dataKey="totalTasks" fill="#00ADB5" name="Total Tasks" barSize={25} />
          <Bar dataKey="completedTasks" fill="#4CAF50" name="Completed Tasks" barSize={25} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyProgressChart;
