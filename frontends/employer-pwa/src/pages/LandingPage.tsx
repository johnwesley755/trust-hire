import { LandingNavbar } from "./landing/LandingNavbar";
import { LandingHero } from "./landing/LandingHero";
import { LandingStats } from "./landing/LandingStats";
import { LandingFeatures } from "./landing/LandingFeatures";
import { LandingShowcase } from "./landing/LandingShowcase";
import { LandingNetwork } from "./landing/LandingNetwork";
import { LandingFooter } from "./landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-x-hidden">
      <LandingNavbar />
      <LandingHero />
      <LandingStats />
      <LandingFeatures />
      <LandingShowcase />
      <LandingNetwork />
      <LandingFooter />
    </div>
  );
}

