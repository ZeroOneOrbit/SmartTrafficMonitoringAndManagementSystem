import React from "react";
import Hero from "../components/hero"
import Stats from "../components/state";
import Features from "../components/features";
import Navbar from "../components/navbar";
import Footer from "../components/footer";


const Home = () => {
    return( 
        <div>
            <Navbar />
            <Hero/>
            <Stats/>
            <Features/>
            <Footer />

        </div>
    );
}
export default Home;
