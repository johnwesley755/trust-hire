import { Users, ShieldCheck, Zap } from "lucide-react";

const FEATURES = [
  {
    title: "AI Face Identification",
    desc: "Eliminate proxy attendance. Our system matches workers' live faces with government IDs in real-time.",
    icon: <Users className="w-7 h-7" />,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Blockchain Verification",
    desc: "Work history and ratings are secured on-chain, ensuring tamper-proof professional reputation.",
    icon: <ShieldCheck className="w-7 h-7" />,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Instant Job Filling",
    desc: "Our matching algorithm finds the best available talent within minutes based on skill ratings and proximity.",
    icon: <Zap className="w-7 h-7" />,
    color: "bg-amber-50 text-amber-600",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto text-center space-y-6 mb-20">
        <h2 className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-sm">
          Our Difference
        </h2>
        <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          The Future of{" "}
          <span className="text-indigo-600">Workforce Management.</span>
        </h3>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Stop worrying about background checks and fake identities. We've
          built the ultimate trust layer.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES.map((feature, i) => (
          <div
            key={i}
            className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-indigo-400 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[5rem] -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            <div
              className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-inner`}
            >
              {feature.icon}
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-4">
              {feature.title}
            </h4>
            <p className="text-slate-600 leading-relaxed font-medium">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
