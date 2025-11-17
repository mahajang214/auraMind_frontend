import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth, setUser } from "../../Components/Slices/userSlice.js"; // adjust exports in your userSlice
import axios from "axios";

const GoogleLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Sends ID token (credential) to backend; backend verifies and returns app JWT + user
  const handleLoginApi = async (idToken) => {
    try {
      const res = await axios.post(`${baseUrl}/api/auth/google`, {
        token: idToken,
      });
      // backend returns { token, user }
      return res.data;
    } catch (error) {
      console.error("Error during Google login API:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleSuccess = async (credentialResponse) => {
    // credentialResponse.credential is the Google ID token (JWT)
    const googleIdToken = credentialResponse?.credential;
    if (!googleIdToken) {
      alert("Google login returned no credential. Please try again.");
      return;
    }

    try {
      const data = await handleLoginApi(googleIdToken);

      if (data && data.token) {
        // Save our app JWT token
        localStorage.setItem("jwtToken", data.token);

        // Optionally save user in redux store if backend returned it
        if (data.user) {
          dispatch(setUser(data.user));
        }

        dispatch(setAuth(true)); // marks app as authenticated in redux
        navigate("/"); // redirect
      } else {
        throw new Error("No token received from backend");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    }
  };

  const handleError = () => {
    alert("Google login failed. Please try again or check your connection.");
    console.error("Google login failed.");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-8">Login with Google</h1>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} theme="outline" size="large" />
      <p className="mt-6 text-gray-400 text-sm">Secure login using Google OAuth 2.0</p>
    </div>
  );
};

export default GoogleLoginPage;
