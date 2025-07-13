import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import LoginSection from "../../components/LoginSection/LoginSection";
import HeroSection from "../../components/HeroSection/HeroSection";
import Features from "../../components/Features/Features";
import Footer from "../../components/Footer/Footer";

function MainPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <LoginSection />
      <Features />
      <Footer />
    </>
  );
}

export default MainPage;
