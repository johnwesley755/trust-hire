import { LandingNavbar } from "./landing/LandingNavbar";
import { LandingHero } from "./landing/LandingHero";
import { LandingScoutingDemo } from "./landing/LandingScoutingDemo";
import { LandingSecurityStack } from "./landing/LandingSecurityStack";
import { LandingTalentCloud } from "./landing/LandingTalentCloud";
import { LandingFooter } from "./landing/LandingFooter";
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
