import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutUs from "./Pages/AboutUs/AboutUs.jsx";
import ContactUs from "./Pages/ContactUs/ContactUs.jsx";
import MainPage from "./Pages/MainPage/MainPage.jsx";
import FAQ from "./Pages/FAQ/FAQ.jsx";
import Services from "./Pages/ServicesPage/Services.jsx";
import DocsPage from "./Pages/DocsPage/DocsPage.jsx";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy.jsx";
import Terms from "./Pages/Terms&Condition/Terms.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/services" element={<Services />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />

    </Routes>
  );
}

export default App;
