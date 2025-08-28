import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import SignUp from "./component/SignUp";
import Home from "./component/Home";
import AddDataForm from "./component/AddData";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const location = useLocation();

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/signup" state={{ from: location }} replace />;
};

const App = () => {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddDataForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;


