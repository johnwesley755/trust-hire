import { LandingNavbar } from "../components/LandingNavbar";
import { LandingHero } from "../components/LandingHero";
import { LandingScoutingDemo } from "../components/LandingScoutingDemo";
import { LandingSecurityStack } from "../components/LandingSecurityStack";
import { LandingTalentCloud } from "../components/LandingTalentCloud";
import { LandingFooter } from "../components/LandingFooter";
import { ReactLenis } from "lenis/react";

export default function LandingPage() {
  return (
    <ReactLenis root>
      <div className="min-h-screen bg-brand-bg selection:bg-brand-primary selection:text-brand-secondary selection:font-black">
        <LandingNavbar />
        <main>
          <LandingHero />
          <LandingScoutingDemo />
          <LandingSecurityStack />
          <LandingTalentCloud />
        </main>
        <LandingFooter />
      </div>
    </ReactLenis>
  );
}
