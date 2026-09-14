import React from "react";
import { useAuth } from "../../../providers/AuthContext";
import { Navigate } from "react-router-dom";
import EmployerOnboardingPage from "./EmployerOnboardingPage";

export default function OnboardingPage() {
  const { user } = useAuth();

  if (user?.role === "EMPLOYER") {
    return <EmployerOnboardingPage />;
  }

  // Workers never see onboarding - redirect directly to job search portal
  return <Navigate to="/search" replace />;
}
