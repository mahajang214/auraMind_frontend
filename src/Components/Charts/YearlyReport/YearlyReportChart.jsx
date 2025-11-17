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
  LineChart,
  Line,
} from "recharts";

const YearlyReportChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    name: item.year.toString(),
    TotalTasks: item.totalTasks,
    CompletedTasks: item.completedTasks,
    Progress: item.progress,
   
  }));

  return (
    <div className="w-full bg-gray-900 text-white p-4 sm:p-6 rounded-2xl shadow-lg h-full">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center">
        📊 Yearly Progress Report
      </h2>

      {/* 📉 Bar Chart Section */}
      <div className="w-full h-[250px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#ccc", fontSize: 10 }}
              interval={0}
            />
            <YAxis tick={{ fill: "#ccc", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222",
                border: "1px solid #444",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ color: "#fff", fontSize: 12 }} />
            <Bar
              dataKey="TotalTasks"
              fill="#8884d8"
              name="Total Tasks"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="CompletedTasks"
              fill="#82ca9d"
              name="Completed Tasks"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📈 Line Chart Section */}
      <div className="mt-6 w-full h-[220px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#ccc", fontSize: 10 }}
              interval={0}
            />
            <YAxis tick={{ fill: "#ccc", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222",
                border: "1px solid #444",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ color: "#fff", fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="Progress"
              stroke="#ff7300"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Progress %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default YearlyReportChart;
