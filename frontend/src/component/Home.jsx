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
    <div className="min-h-screen animated-bg text-white">
      {/* Modern Navigation Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h1 className="text-2xl font-bold text-gradient text-shadow">
                BlogSpace
              </h1>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Home
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Articles
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Categories
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                About
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddData}
                className="btn-gradient px-6 py-2.5 rounded-full text-white font-medium text-sm shadow-lg"
              >
                Create Post
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-300 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gradient leading-tight">
            Discover Amazing
            <br />
            Content & Stories
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Explore our curated collection of articles, insights, and stories from passionate writers around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleAddData}
              className="btn-gradient px-8 py-4 rounded-full text-white font-semibold text-lg shadow-xl"
            >
              Start Writing
            </button>
            <button className="px-8 py-4 rounded-full bg-transparent border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 font-semibold text-lg">
              Browse Articles
            </button>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Main Content */}
      <main className="pb-20">
        <WholeContent />
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <h3 className="text-xl font-bold text-gradient">BlogSpace</h3>
              </div>
              <p className="text-white/70 mb-4 max-w-md">
                A modern platform for sharing ideas, stories, and insights with the world. Join our community of passionate writers and readers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Articles</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2025 BlogSpace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
