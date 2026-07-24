import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router";

const App = () => {
  return (
    <div className="min-h-screen
      bg-[radial-gradient(circle_at_top_left,_rgba(0,255,255,.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,.15),_transparent_40%),linear-gradient(135deg,_#030712,_#081B33,_#050816)]">
      <Router>
        <AppRouter />
      </Router>
    </div>
  );
};

export default App;