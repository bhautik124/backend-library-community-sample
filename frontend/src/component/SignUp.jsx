import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "https://backendlibraryy-fullstack-backend.onrender.com/api/hvHWYN2/google-auth",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      console.log("Signup Success:", res.data);
      localStorage.setItem("isAuthenticated", "true"); // Set auth flag
      navigate("/");
    } catch (err) {
      console.error("Signup Failed", err);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>

      <div className="glass-card p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-white/10 relative z-10">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
          <span className="text-white font-bold text-2xl">B</span>
        </div>

        {/* Welcome Text */}
        <h1 className="text-4xl font-bold text-gradient mb-3">
          Welcome to BlogSpace
        </h1>
        <p className="text-xl text-white/70 mb-8 leading-relaxed">
          Join our community of passionate writers and readers. Share your stories with the world.
        </p>

        {/* Features List */}
        <div className="space-y-3 mb-8 text-left">
          <div className="flex items-center space-x-3 text-white/80">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></span>
            <span>Create and share your articles</span>
          </div>
          <div className="flex items-center space-x-3 text-white/80">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></span>
            <span>Connect with like-minded writers</span>
          </div>
          <div className="flex items-center space-x-3 text-white/80">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></span>
            <span>Discover amazing content daily</span>
          </div>
        </div>

        {/* Google Login */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSignupSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
              shape="pill"
              theme="filled_black"
              size="large"
              width="280"
            />
          </div>
          
          <p className="text-sm text-white/50">
            Secure authentication powered by Google
          </p>
        </div>

        {/* Privacy Note */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center space-x-2 text-sm text-white/60">
            <span>🔒</span>
            <span>Your privacy is our priority. We'll never post without permission.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;