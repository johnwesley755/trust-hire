import React from "react";
import { useAuth } from "../../../providers/AuthContext";
import WorkerProfileDetailsPage from "./WorkerProfileDetailsPage";
import EmployerProfileDetailsPage from "./EmployerProfileDetailsPage";

export default function ProfilePage() {
  const { user } = useAuth();

  if (user?.role === "EMPLOYER") {
    return <EmployerProfileDetailsPage />;
  }

  return <WorkerProfileDetailsPage />;
}
