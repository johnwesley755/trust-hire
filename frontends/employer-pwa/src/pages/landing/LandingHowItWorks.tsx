import { motion } from "framer-motion";
import { UserPlus, Search, ShieldCheck, CheckCircle } from "lucide-react";

const STEPS = [
  {
    title: "Define Your Needs",
    desc: "Post your project requirements and the specific skills you need.",
    icon: UserPlus,
    color: "bg-brand-primary",
  },
  {
    title: "AI Matches Talent",
    desc: "Our engine filters the top 3% based on skill score and proximity.",
    icon: Search,
    color: "bg-brand-accent",
  },
  {
    title: "Face-Match Verify",
    desc: "Workers undergo biometric face-matching before they join.",
    icon: ShieldCheck,
    color: "bg-blue-500",
  },
  {
    title: "Secure Deployment",
    desc: "Talent arrives on-site or starts remotely with full trust.",
    icon: CheckCircle,
    color: "bg-emerald-500",
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-20">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <h2 className="text-sm font-bold text-brand-accent uppercase tracking-[0.3em]">Seamless Onboarding</h2>
            <h3 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-none text-brand-secondary">
              How TrustHire <br />
              <span className="text-brand-primary">Empowers Your Business.</span>
            </h3>
          </div>
          <p className="text-lg text-brand-muted max-w-md font-bold text-center lg:text-left">
            We've simplified the recruitment of verified labor. It only takes four steps to secure your elite work network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-brand-surface -z-10" />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-10 bg-brand-surface rounded-[50px] border-2 border-transparent hover:border-brand-primary hover:bg-white hover:shadow-2xl transition-all duration-500 group"
            >
              <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
                <step.icon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute top-10 right-10 text-4xl font-bold text-brand-secondary/5 group-hover:text-brand-primary/20 transition-colors">
                0{i + 1}
              </div>
              <h4 className="text-2xl font-bold text-brand-secondary mb-4">{step.title}</h4>
              <p className="text-sm text-brand-muted font-bold leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
