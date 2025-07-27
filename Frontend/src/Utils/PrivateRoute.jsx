import { Navigate } from "react-router-dom";
import React from "react";

const PrivateRoute = ({ children, allowedRoles }) => {
  // ✅ Get token & role from sessionStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // ✅ Check if user is authenticated and authorized
  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to={`/`} replace />;
  }

  // ✅ If authenticated & authorized, render the protected page
  return children;
};

export default PrivateRoute;
