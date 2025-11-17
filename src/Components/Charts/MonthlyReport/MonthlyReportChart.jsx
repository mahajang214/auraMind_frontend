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

const MonthlyReportChart = ({ data }) => {
  // ✅ Prepare data for Recharts
  const formattedData = data.map((item) => ({
    name: `${item.monthName} ${item.year}`,
    TotalTasks: item.totalTasks,
    CompletedTasks: item.completedTasks,
    Progress: item.progress,
    
  }));

  return (
    <div className="w-full bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-center">
        📅 Monthly Progress Report
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={formattedData} barGap={10}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
          <YAxis tick={{ fill: "#ccc" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#222", border: "1px solid #444" }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar dataKey="TotalTasks" fill="#8884d8" name="Total Tasks" />
          <Bar dataKey="CompletedTasks" fill="#82ca9d" name="Completed Tasks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyReportChart;
