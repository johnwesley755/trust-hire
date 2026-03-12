import { LandingNavbar } from "./landing/LandingNavbar";
import { LandingHero } from "./landing/LandingHero";
import { LandingBenefits } from "./landing/LandingBenefits";
import { LandingEarnings } from "./landing/LandingEarnings";
import { LandingTrust } from "./landing/LandingTrust";
import { LandingTestimonials } from "./landing/LandingTestimonials";
import { LandingCareerLevels } from "./landing/LandingCareerLevels";
import { LandingCinematic } from "./landing/LandingCinematic";
import { LandingFooter } from "./landing/LandingFooter";
import { ReactLenis } from 'lenis/react';

export default function LandingPage() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <div className="min-h-screen bg-[#f5f4ef] font-['Outfit'] overflow-x-hidden">
        <LandingNavbar />
        <main className="bg-black">
          {/* Wrap Hero and Benefits in a relative container so the sticky hero doesn't bleed into lower sections */}
          <div id="hero-benefits-wrapper" className="relative z-10 bg-[#f5f4ef]">
            <LandingHero />
            <LandingBenefits />
          </div>
          <LandingCinematic />
          <div className="relative z-10 bg-brand-cream">
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
