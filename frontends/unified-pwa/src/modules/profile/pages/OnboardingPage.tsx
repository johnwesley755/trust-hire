import React from "react";
import { useAuth } from "../../../providers/AuthContext";
import EmployerOnboardingPage from "./EmployerOnboardingPage";
import WorkerOnboardingPage from "./WorkerOnboardingPage";

export default function OnboardingPage() {
  const { user } = useAuth();

  if (user?.role === "EMPLOYER") {
    return <EmployerOnboardingPage />;
  }

  return <WorkerOnboardingPage />;
}
