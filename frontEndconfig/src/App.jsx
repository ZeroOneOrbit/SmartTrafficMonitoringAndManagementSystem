import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import AdminDash from "./pages/adminDash";
import Register from "./pages/Register";
import CivilProfile from "./pages/civilprofile";
import AdminUser from "./pages/adminuser";
import LoginCivil from "./pages/logincivil";


const App = () => {
  return (
    <div className="min-h-screen
      bg-[radial-gradient(circle_at_top_left,_rgba(0,255,255,.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,.15),_transparent_40%),linear-gradient(135deg,_#030712,_#081B33,_#050816)]">
      <Router>
        <Routes>

          {/* Admin Login (Operator / Command Center) */}
          <Route path="/login" element={<Login />} />

          

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDash />} />

          

          

          {/* Any unknown route → back to landing */}
          <Route path="*" element={<Login />} />
          
        </Routes>
      </Router>
    </div>
  );
};

export default App;