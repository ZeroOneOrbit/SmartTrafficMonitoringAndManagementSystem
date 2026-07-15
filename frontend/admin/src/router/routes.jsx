import { createBrowserRouter, Navigate } from "react-router-dom";
import  Login from "../pages/login.jsx";
import AdminDash from "../pages/adminDash.jsx";

// ── Private Route Guard ───────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
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
]);

