import React from "react";
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import Stats from "../components/state";
import Features from "../components/features";
import Footer from "../components/footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />
      <main className="flex-grow pt-16">
        <Hero />
        <Stats />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Home;