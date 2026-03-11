import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const VERIFICATION_STEPS = [
  "Identity Verification",
  "Skill Assessment",
  "Reference Checks",
  "Face Biometrics",
];

export function LandingNetwork() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        {/* Image */}
        <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
          <img
            src="/assets/landing/workers-collage.png"
            alt="Verified Workers"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
          />
        </div>

        {/* Copy */}
        <div className="w-full lg:w-1/2 space-y-8">
          <h3 className="text-4xl font-extrabold text-slate-900 leading-tight">
            Elite Workforce Network,{" "}
            <span className="text-indigo-600 underline decoration-indigo-200">
              Pre-Vetted.
            </span>
          </h3>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            We don't just provide workers; we provide a professional network.
            Every worker on TrustHire passes a rigorous 4-step verification
            process before they can even view your job postings.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VERIFICATION_STEPS.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 font-bold text-slate-700"
              >
                <div className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/sign-up"
            className="inline-block px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl active:scale-95"
          >
            Access the Network
          </Link>
        </div>
      </div>
    </section>
  );
}
