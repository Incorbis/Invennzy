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
import Notifications from "./components/admincomponents/Notification.jsx";
import Notification from "./components/Inchargecomponents/Notification.jsx";
import PrivateRoute from "./Utils/PrivateRoute.jsx";
import AddItems from "./components/Inchargecomponents/AddItems.jsx";
import Requests from "./components/Inchargecomponents/Requests.jsx";

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
        <Route path="reports" element={<Reports />} />
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
        <Route path="notifications" element={<Notifications />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="additems" element={<AddItems />} />
        <Route path="requests" element={<Requests />} />
        <Route path="reports" element={<Reports />} />
        <Route path="" element={<Overview />} />
        <Route path="settings" element={<Settings />} />
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
        <Route path="notification" element={<Notification />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="reports" element={<Reports />} />
        <Route path="" element={<Overview />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
