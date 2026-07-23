import React from "react";
import Trending from "./subComponents/Trending";
import WomenSection from "./subComponents/WomenSection";
import MenSection from "./subComponents/MenSection";
import BestSeller from "./subComponents/BestSeller";
import Features from "./subComponents/Features";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <title>Stand Out - Online Clothing Store | Stand Out</title>
      <Trending />
      <WomenSection />
      <MenSection />
      <BestSeller />
      <Features />
    </div>
  );
}

export default Home;
