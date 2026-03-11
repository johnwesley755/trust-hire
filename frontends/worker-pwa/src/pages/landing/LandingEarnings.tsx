import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CheckCircle } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Sign Up & Verify",
    desc: "Create your profile and complete Aadhaar + face verification in under 10 minutes.",
  },
  {
    num: "02",
    title: "Pass Skill Test",
    desc: "Take a short skill assessment to earn your verified L1 badge and access job listings.",
  },
  {
    num: "03",
    title: "Apply & Get Hired",
    desc: "One-tap apply to verified employers near you. Interviews are fast, decisions are instant.",
  },
  {
    num: "04",
    title: "Work & Get Paid",
    desc: "Complete the job, get employer sign-off, and receive your payment directly to your bank by end of day.",
  },
];

const PERKS = [
  "Daily bank settlements",
  "Transparent pay structure",
  "Bonus for top ratings",
  "Health insurance access",
  "Legal contract protection",
  "24/7 support line",
];

export function LandingEarnings() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const imgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section id="how-it-works" ref={containerRef} className="py-28 bg-[#f5f4ef] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: How it works */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#f0b429] font-black text-sm uppercase tracking-[0.2em]">
                How It Works
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#111] mt-3 mb-12 leading-tight">
                Start earning in{" "}
                <span className="text-[#1d4744]">4 simple steps.</span>
              </h2>
            </motion.div>

            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex gap-6 group"
                >
                  {/* Number */}
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#1d4744]/20 group-hover:bg-[#f0b429] group-hover:border-[#f0b429] transition-all duration-300 flex items-center justify-center">
                      <span className="text-sm font-black text-[#1d4744] group-hover:text-white transition-colors duration-300">
                        {step.num}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px h-8 bg-[#1d4744]/15 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="pb-2">
                    <h4 className="text-lg font-black text-[#111] mb-1">{step.title}</h4>
                    <p className="text-[#666] font-medium leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Instant Payouts visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            {/* Main card */}
            <div className="bg-[#1d4744] rounded-[40px] p-8 text-white relative flex flex-col justify-end min-h-[480px]">
              
              {/* Parallax Worker Image */}
              <motion.img 
                style={{ y: imgY }}
                src="/assets/landing/worker-payout.png" 
                alt="Worker holding phone with payment"
                className="absolute -top-20 -right-4 w-[110%] md:w-[130%] max-w-[450px] object-contain object-bottom z-10 drop-shadow-2xl pointer-events-none"
              />

              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#f0b429]/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-8 -mb-8" />

              <div className="relative z-10">
                <p className="text-white/60 font-bold text-sm uppercase tracking-widest mb-2">
                  Today's Earnings
                </p>
                <motion.p
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-6xl font-black mb-1"
                >
                  ₹2,450
                </motion.p>
                <p className="text-white/60 font-medium text-sm mb-8">
                  Settled to bank by 8 PM
                </p>

                <div className="space-y-3">
                  {PERKS.map((perk, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-4 h-4 text-[#f0b429] shrink-0" />
                      <span className="text-white/80 font-semibold text-sm">{perk}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating mini-cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f0b429] flex items-center justify-center text-lg">
                ⚡
              </div>
              <div>
                <p className="text-xs font-black text-[#111]">Instant Payout</p>
                <p className="text-xs text-[#777] font-medium">Within 2 hours</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-[#f0b429] rounded-2xl shadow-xl p-4"
            >
              <p className="text-sm font-black text-[#111]">94% Retention Rate</p>
              <p className="text-xs text-[#111]/70 font-medium">Workers stay & grow</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
