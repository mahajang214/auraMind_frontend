import React from "react";

const toastStyles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    padding: "10px 16px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    zIndex: 9999,
    width: "100%", // ✅ full-width background
    boxSizing: "border-box",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
  },
  icon: {
    fontSize: "1.2rem",
  },
  closeButton: {
    backgroundColor: "#dc2626", // red close button
    border: "none",
    color: "white",
    fontSize: "1rem",
    width: "24px",
    height: "100%",
    borderRadius: "5%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};

const bgColors = {
  success: "#16a34a",
  error: "#dc2626",
  info: "#2563eb",
  warning: "#facc15",
};

const CustomToast = ({ type = "info", message, closeToast }) => {
  return (
    <div style={{ ...toastStyles.container, backgroundColor: bgColors[type] }}>
      <div style={toastStyles.leftSection}>
        <span style={toastStyles.icon}>
          {type === "success" && "✅"}
          {type === "error" && "❌"}
          {type === "info" && "ℹ️"}
          {type === "warning" && "⚠️"}
        </span>
        <span>{message}</span>
      </div>

      {/* ✅ Close Button */}
      <button onClick={closeToast} style={toastStyles.closeButton}>
        ×
      </button>
    </div>
  );
};

export default CustomToast;
