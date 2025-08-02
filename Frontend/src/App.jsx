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
import AdminReports from "./components/admincomponents/Reports.jsx";
import Settings from "./components/admincomponents/settings.jsx";
import Overview from "./components/admincomponents/overview.jsx";
import Notifications from "./components/admincomponents/Notification.jsx";

import PrivateRoute from "./Utils/PrivateRoute.jsx";

import LICRequests from "./components/Inchargecomponents/Requests.jsx";
import LICNotification from "./components/Inchargecomponents/Notification.jsx";
import LICReports from "./components/Inchargecomponents/Reports.jsx";
import LICSettingsPage from "./components/Inchargecomponents/settings.jsx";
import LICoverview from "./components/Inchargecomponents/overview.jsx";
import LICInventory from "./components/Inchargecomponents/Inventory.jsx";

import LAInventory from "./components/Assistantcomponents/Inventory.jsx";
import LAReports from "./components/Assistantcomponents/Reports.jsx";
import LASettings from "./components/Assistantcomponents/settings.jsx";
import LAOverview from "./components/Assistantcomponents/overview.jsx";
import LANotification from "./components/Assistantcomponents/notifications.jsx";

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

      {/* ✅ Admin Routes */}
      <Route
        path="/admindash"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDash />
          </PrivateRoute>
        }
      >
        <Route path="inventory" element={<Inventory />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="" element={<Overview />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* ✅ Lab Incharge Routes */}
      <Route
        path="/labinchargedash"
        element={
          <PrivateRoute allowedRoles={["labincharge"]}>
            <LabIncharge />
          </PrivateRoute>
        }
      >
        <Route path="notifications" element={<LICNotification />} />
        <Route path="inventory" element={<LICInventory />} />
        <Route path="requests" element={<LICRequests />} />
        <Route path="reports" element={<LICReports />} />
        <Route path="" element={<LICoverview />} />
        <Route path="settings" element={<LICSettingsPage />} />
      </Route>

      {/* ✅ Lab Assistant Routes */}
      <Route
        path="/labassistantdash"
        element={
          <PrivateRoute allowedRoles={["labassistant"]}>
            <LabAssistant />
          </PrivateRoute>
        }
      >
        <Route path="notifications" element={<LANotification />} />
        <Route path="inventory" element={<LAInventory />} />
        <Route path="reports" element={<LAReports />} />
        <Route path="" element={<LAOverview />} />
        <Route path="settings" element={<LASettings />} />
      </Route>
    </Routes>
  );
}

export default App;
