import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/login";
import AdminDash from "../pages/adminDash";
import Register from "../pages/Register";
import CivilProfile from "../pages/civilprofile";
import LoginCivil from "../pages/logincivil";
import UserPortal from "../components/user/UserPortal";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Home Portal Page */}
      <Route path="/" element={<UserPortal />} />

      {/* Admin Login & Admin Dashboard */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDash />} />

      {/* Civil Pages */}
      <Route path="/logincivil" element={<LoginCivil />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<CivilProfile />} />

      {/* Redirect old portal route to root */}
      <Route path="/portal" element={<Navigate to="/" replace />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
