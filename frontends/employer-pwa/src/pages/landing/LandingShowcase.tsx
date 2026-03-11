import { CheckCircle2 } from "lucide-react";

const FEATURES = [
  {
    title: "Smart Daily Check-ins",
    desc: "Geofenced attendance with biometric verification.",
  },
  {
    title: "One-Click Payments",
    desc: "Pay your entire workforce securely with verified bank sync.",
  },
  {
    title: "Performance Analytics",
    desc: "Track worker quality and efficiency over time.",
  },
];

export function LandingShowcase() {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Copy */}
        <div className="space-y-8 order-2 lg:order-1">
          <h3 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Manage Your Entire Team{" "}
            <span className="text-indigo-400">from One Place.</span>
          </h3>
          <div className="space-y-6">
            {FEATURES.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h5 className="font-bold text-xl">{item.title}</h5>
                  <p className="text-slate-400 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="relative order-1 lg:order-2">
          <div className="absolute -inset-10 bg-indigo-500/20 rounded-full blur-[100px]" />
          <img
            src="/assets/landing/dashboard-mockup.png"
            alt="Dashboard Mockup"
            className="relative z-10 rounded-2xl shadow-2xl border border-white/10 opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </div>
    </section>
  );
}
