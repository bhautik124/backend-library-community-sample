import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WholeContent from "./AllContent";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/cl7E9YV/google-auth-logout",
        {},
        { withCredentials: true }
      );
      console.log("Logged out:", res.data);
      window.location.href = "/signup";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleAddData = () => {
    navigate("/add");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-zinc-700">
        <h1 className="text-2xl font-bold">Home</h1>
        <div className="flex gap-4">
          {" "}
          <button
            onClick={handleAddData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Add Data
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <WholeContent />
      </main>
    </div>
  );
};

export default Home;
