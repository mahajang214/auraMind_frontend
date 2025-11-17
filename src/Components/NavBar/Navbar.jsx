import { NavLink, useNavigate } from "react-router-dom";
import { showToast } from "../Utils/ToastService";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const baseUrl=import.meta.env.VITE_BACKEND_URL
  const token=localStorage.getItem("jwtToken")

  const handleLogout = async() => {
    // Example logic — customize this as needed
    // localStorage.removeItem("token");
    try {
      await axios.post(
        `${baseUrl}/api/auth/logout`, 
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      localStorage.removeItem("jwtToken")
      showToast("success", "Successfully logged out");
      navigate("/login");


    } catch (error) {
      console.log("Error : ",error.message);
      showToast("error","404 Error");
      
    }
  };

  return (
    <nav className="bg-[#0F1115]/95 backdrop-blur-xl text-white hidden lg:flex justify-center items-center w-full fixed top-0 z-50 border-b border-[#1E1E24] shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center px-10 py-3 w-full max-w-[1300px]">
        {/* Navigation Links */}
        <ul className="flex justify-center items-center gap-8 font-medium tracking-wide">
          <NavItem to="/" label="Home" />
          <NavItem to="/create" label="Add" />
          <NavItem to="/self-reflection" label="Tasks" />
          <NavItem to="/analytics" label="Progress" />
          <NavItem to="/profile" label="Profile" />
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold
          text-[#0F1115] 
          bg-linear-to-r from-[#0F1115] via-[#FBB03B] to-[#0F1115]
          shadow-[0_0_16px_0_rgba(251,176,59,0.42)]
          hover:shadow-[0_0_32px_0_rgba(251,176,59,0.68)]
          transition-all duration-500 overflow-hidden group cursor-pointer
          hover:scale-[1.06] active:scale-[0.98] border border-[#FBB03B]/60
        "
        >
          {/* Glowing animated overlay */}
          <span
            className="absolute inset-0 bg-linear-to-r from-transparent via-[#fff9e6]/40 to-transparent 
            opacity-0 group-hover:opacity-100 -translate-x-[180%] group-hover:translate-x-[180%] 
            transition-all duration-[1.2s] ease-in-out pointer-events-none"
          ></span>

          {/* Stronger golden border on hover */}
          <span className="absolute inset-0 rounded-xl border border-[#FBB03B]/20 group-hover:border-[#FBB03B]/90 transition-all"></span>

          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#0F1115"
            className="w-5 h-5 drop-shadow-[0_0_8px_#FBB03B] transition-all duration-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25a.75.75 0 00-.75-.75h-9a.75.75 0 00-.75.75v13.5a.75.75 0 00.75.75h9a.75.75 0 00.75-.75V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>

          <span className="relative z-10 tracking-wide font-semibold text-[#0F1115]">Logout</span>
        </button>
      </div>
    </nav>
  );
}

function NavItem({ to, label }) {
  const path = window.location.pathname;

  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 relative 
           ${isActive ? "text-yellow-400" : "text-gray-300 hover:text-white"}`
        }
      >
        {/* Animated underline */}
        <span
          className={`absolute bottom-0 left-0 h-0.5 w-full transition-all duration-500 ${
            path === to
              ? "bg-yellow-400"
              : "bg-transparent group-hover:bg-gray-400"
          }`}
          style={{
            display: "block",
            pointerEvents: "none",
          }}
        ></span>

        {/* Icons */}
        {label === "Home" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="24"
            height="24"
            fill="currentColor"
            className={`${
              path === to
                ? "text-yellow-400 animate-[spin_6s_linear_infinite] drop-shadow-[0_0_8px_#facc15]"
                : "group-hover:scale-125 transition-transform duration-500"
            }`}
          >
            <path d="M53.45,29.79A1.51,1.51,0,0,0,53,28.73l-4.3-3.85h0L33,10.88a1.5,1.5,0,0,0-2,0l-15.66,14h0L11,28.73a1.54,1.54,0,0,0-.49,1,1.52,1.52,0,0,0,1.19,1.59c0,.05,3,0,3.1,0V52a1.5,1.5,0,0,0,1.5,1.5H26.45A1.5,1.5,0,0,0,28,52V39.56h8.1V52a1.5,1.5,0,0,0,1.5,1.5H47.66a1.5,1.5,0,0,0,1.5-1.5V31.35c.14,0,3.09,0,3.1,0A1.51,1.51,0,0,0,53.45,29.79Z" />
          </svg>
        )}
        {label === "Add" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={26}
            height={26}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            className={`${
              path === to
                ? "text-yellow-400 animate-[spin_6s_linear_infinite] drop-shadow-[0_0_8px_#facc15]"
                : "group-hover:scale-125 transition-transform duration-500 "
            }`}
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
        )}
        {label === "Tasks" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width={26}
            height={26}
            fill="currentColor"
            className={`${
              path === to
                ? "text-yellow-400 animate-[spin_6s_linear_infinite] drop-shadow-[0_0_8px_#facc15]"
                : "group-hover:scale-125 transition-transform duration-500 "
            }`}
          >
            <path d="M6 2a2 2 0 0 0-2 2v1H3a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a1 1 0 0 0-1-1h-1V4a2 2 0 0 0-2-2H6zm0 2h8v1H6V4zm-2 3h12v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7z" />
          </svg>
        )}
        {label === "Progress" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={26}
            height={26}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`${
              path === to
                ? "text-yellow-400 animate-[spin_6s_linear_infinite] drop-shadow-[0_0_8px_#facc15]"
                : "group-hover:scale-125 transition-transform duration-500 "
            }`}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" strokeLinecap="round" />
          </svg>
        )}
        {label === "Profile" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={26}
            height={26}
            fill="currentColor"
            className={`${
              path === to
                ? "text-yellow-400 animate-[spin_6s_linear_infinite] drop-shadow-[0_0_8px_#facc15]"
                : "group-hover:scale-125 transition-transform duration-500 "
            }`}
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
          </svg>
        )}
        <span>{label}</span>
      </NavLink>
    </li>
  );
}
