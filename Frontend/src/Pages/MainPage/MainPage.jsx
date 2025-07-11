import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import LoginSection from "../../components/LoginSection/LoginSection";
import HeroSection from "../../components/HeroSection/HeroSection";
import Features from "../../components/Features/Features";

function MainPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <LoginSection />
      <Features />
    </>
  );
}

export default MainPage;
