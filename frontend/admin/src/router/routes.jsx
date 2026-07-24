import { createBrowserRouter, Navigate } from "react-router-dom";
import  Login from "../pages/login.jsx";
import AdminDash from "../pages/adminDash.jsx";
import Cctvcam from "../pages/cctvcam.jsx";
import AllViolations from "../pages/Allviolations.jsx";
import Cases from "../pages/cases.jsx";
import AdminProfile from "../components/adprofile.jsx";
import UserControll from "../pages/userControll.jsx";

// ── Private Route Guard ───────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

const AdminOnlyRoute = ({ children }) => {
  try {
    const officer = JSON.parse(sessionStorage.getItem("officer") || "null");
    return officer?.role?.toLowerCase() === "admin" ? children : <Navigate to="/admin" replace />;
  } catch {
    return <Navigate to="/" replace />;
  }
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminDash />
      </PrivateRoute>
    ),
  },
  {
    path: "/cctv",
    element: <Cctvcam/>
  },
  {
    path: "/violation",
    element: <AllViolations/>
  },
  {
    path: "/cases",
    element: <Cases/>
  },
  {
    path: "/me",
    element: <AdminProfile/>
  },
  {
    path: "/manage",
    element: <PrivateRoute><AdminOnlyRoute><UserControll/></AdminOnlyRoute></PrivateRoute>
  }

]);
