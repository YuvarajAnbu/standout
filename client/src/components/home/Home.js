import React, { useEffect } from "react";
import Trending from "./subComponents/Trending";
import WomenSection from "./subComponents/WomenSection";
import MenSection from "./subComponents/MenSection";
import BestSeller from "./subComponents/BestSeller";
import Features from "./subComponents/Features";
import "./Home.css";

function Home() {
  useEffect(() => {
    document.title = "Stand Out - Online Clothing Store | Stand Out";
  }, []);

  return (
    <div className="home">
      <Trending />
      <WomenSection />
      <MenSection />
      <BestSeller />
      <Features />
    </div>
  );
}

export default Home;
