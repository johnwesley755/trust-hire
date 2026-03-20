import { LandingNavbar } from "../components/LandingNavbar";
import { LandingHero } from "../components/LandingHero";
import { LandingBenefits } from "../components/LandingBenefits";
import { LandingEarnings } from "../components/LandingEarnings";
import { LandingTrust } from "../components/LandingTrust";
import { LandingTestimonials } from "../components/LandingTestimonials";
import { LandingCareerLevels } from "../components/LandingCareerLevels";
import { LandingCinematic } from "../components/LandingCinematic";
import { LandingFooter } from "../components/LandingFooter";
import { ReactLenis } from 'lenis/react';

export default function LandingPage() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <div className="min-h-screen bg-brand-bg overflow-x-hidden">
        <LandingNavbar />
        <main className="bg-brand-secondary">
          {/* Wrap Hero and Benefits in a relative container so the sticky hero doesn't bleed into lower sections */}
          <div id="hero-benefits-wrapper" className="relative z-10 bg-brand-bg">
            <LandingHero />
            <LandingBenefits />
          </div>
          <LandingCinematic />
          <div className="relative z-10 bg-brand-bg">
            <LandingEarnings />
            <LandingTrust />
            <LandingTestimonials />
            <LandingCareerLevels />
          </div>
        </main>
        <LandingFooter />
      </div>
    </ReactLenis>
  );
}
