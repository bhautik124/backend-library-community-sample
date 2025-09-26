import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/QN5tgkC/google-auth",
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-zinc-700">
        <h1 className="text-3xl font-bold mb-4">Join with Google</h1>
        <p className="mb-6 text-zinc-400">
          Sign up securely using your Google account
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSignupSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
            shape="pill"
            theme="filled_black"
            size="large"
            width="250"
          />
        </div>

        <div className="mt-6 text-sm text-zinc-500">
          <p>We’ll never post to your account without permission.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
