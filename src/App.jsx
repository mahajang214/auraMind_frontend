import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoogleLoginPage from "./Pages/Auth/GoogleLoginPage";
import HomePage from "./Pages/Home/HomePage";
import Timer from "./Pages/StartTimer/Timer";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateNew from "./Pages/Create/CreateNew";
import SelfReflextion from "./Pages/SelfReflextion/SelfReflextion";
import Profile from "./Pages/Profile/Profile";
import Analytics from "./Pages/Analytics/Analytics";
import Navbar from "./Components/NavBar/Navbar";

function App() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const { activeTrack } = useSelector((state) => state.activeTrack);
  const location = useLocation();

  // hide navbar paths
  const hideNavbarPaths = ["/login"];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
      />
      <div>
        {/* routes will be here */}
      
        {!shouldHideNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<GoogleLoginPage />} />
            <Route
              path="/start/timer"
              element={
                isAuthenticated && activeTrack ? <Timer /> : <HomePage />
              }
            />
            <Route
              path="/create"
              element={isAuthenticated ? <CreateNew /> : <HomePage />}
            />
            <Route
              path="/self-reflection"
              element={isAuthenticated ? <SelfReflextion /> : <HomePage />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <HomePage />}
            />
            <Route
              path="/analytics"
              element={isAuthenticated ? <Analytics /> : <HomePage />}
            />

            <Route path="*" element={<GoogleLoginPage />} />
          </Routes>
      
      </div>
    </>
  );
}

export default App;
