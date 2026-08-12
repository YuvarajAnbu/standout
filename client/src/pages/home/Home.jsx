import React from "react";
import Trending from "@/pages/home/components/Trending";
import WomenSection from "@/pages/home/components/WomenSection";
import MenSection from "@/pages/home/components/MenSection";
import BestSeller from "@/pages/home/components/BestSeller";
import Features from "@/pages/home/components/Features";
import "@/pages/home/Home.scss";

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
