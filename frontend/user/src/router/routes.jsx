import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../components/login";
import Register from "../pages/Register";
import UserProfile from "../pages/UserProfile";
import AdminDash from "../pages/adminDash";
import UserTypeSelection from "../pages/adminuser";
import Home from "../pages/home";
import CivilianLogin from "../pages/logincivil";

export const ROUTES = {
  home: "/",
  portal: "/portal",
  adminLogin: "/login",
  adminDashboard: "/admin",
  register: "/register",
  civilianLogin: "/login-civil",
  profile: "/profile",
};

const appBackground =
  "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,255,255,.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,.15),_transparent_40%),linear-gradient(135deg,_#030712,_#081B33,_#050816)]";

const withBackground = (page) => <div className={appBackground}>{page}</div>;

export const router = createBrowserRouter([
  { path: ROUTES.home, element: withBackground(<Home />) },
  { path: ROUTES.portal, element: withBackground(<UserTypeSelection />) },
  { path: ROUTES.adminLogin, element: withBackground(<Login />) },
  { path: ROUTES.adminDashboard, element: withBackground(<AdminDash />) },
  { path: ROUTES.register, element: withBackground(<Register />) },
  { path: ROUTES.civilianLogin, element: withBackground(<CivilianLogin />) },
  { path: ROUTES.profile, element: withBackground(<UserProfile />) },
  { path: "*", element: <Navigate to={ROUTES.home} replace /> },
]);
