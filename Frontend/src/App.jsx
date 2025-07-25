import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutUs from "./Pages/AboutUs/AboutUs.jsx";
import ContactUs from "./Pages/ContactUs/ContactUs.jsx";
import MainPage from "./Pages/MainPage/MainPage.jsx";
import FAQ from "./Pages/FAQ/FAQ.jsx";
import Services from "./Pages/ServicesPage/Services.jsx";
import AdminDash from "./Pages/admindash/admindash.jsx";
import LabIncharge from "./Pages/LabInchargedash/LabInchargedash.jsx";
import LabAssistant from "./Pages/LabAssistentDash/LabAssistent.jsx";
import DocsPage from "./Pages/DocsPage/DocsPage.jsx";
import PPsection from "./Pages/PrivacyPolicy/PPsection.jsx";
import Terms from "./Pages/Terms&Condition/Terms.jsx";
import Inventory from "./components/admincomponents/Inventory.jsx";
import Reports from "./components/admincomponents/Reports.jsx";
import Settings from "./components/admincomponents/settings.jsx";
import Overview from "./components/admincomponents/overview.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/services" element={<Services />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/privacy" element={<PPsection />} />
      <Route path="/terms" element={<Terms />} />

      <Route path="/admindash" element={<AdminDash />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/settings" element={<Settings />} />


      <Route path="/labinchargedash" element={<LabIncharge />} />

      <Route path="/labassistantdash" element={<LabAssistant />} />
    </Routes>
  );
}

export default App;
