import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import LoginSection from "../../components/LoginSection/LoginSection";
import HeroSection from "../../components/HeroSection/HeroSection";
import Features from "../../components/Features/Features";
import Footer from "../../components/Footer/Footer";
import FeatureSection from "../../components/Features/Features2";
import Testimonials from "../../components/testimonal/testimonal";

function MainPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <LoginSection />
      <Features />
      <FeatureSection />
      <Testimonials />
      <Footer />
    </>
  );
}

export default MainPage;
