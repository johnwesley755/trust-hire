import React from "react";
import { useAuth } from "../../../providers/AuthContext";
import WorkerOnboardingPage from "./WorkerOnboardingPage";
import EmployerOnboardingPage from "./EmployerOnboardingPage";

export default function OnboardingPage() {
  const { user } = useAuth();

  if (user?.role === "EMPLOYER") {
    return <EmployerOnboardingPage />;
  }

  return <WorkerOnboardingPage />;
}
