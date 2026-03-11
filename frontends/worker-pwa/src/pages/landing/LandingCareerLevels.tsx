import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const LEVELS = [
  {
    code: "L1",
    name: "Foundation",
    desc: "Entry-level verified professional. Access local residential jobs and build your work history.",
    perks: ["Local residential jobs", "Basic tools allowance", "Foundational training"],
    color: "bg-white border border-black/10",
    accent: "text-[#1d4744]",
    tag: null,
  },
  {
    code: "L2",
    name: "Professional",
    desc: "Proven track record. Unlock higher-paying commercial contracts and priority job matching.",
    perks: ["Priority job matching", "Commercial contracts", "+20% pay premium"],
    color: "bg-[#1d4744] text-white",
    accent: "text-[#f0b429]",
    tag: "Most Popular",
  },
  {
    code: "L3",
    name: "Senior Pro",
    desc: "Elite status. Work with major brands, lead small teams, and command top market rates.",
    perks: ["Brand partnerships", "Team lead roles", "+40% pay premium"],
    color: "bg-[#f0b429]",
    accent: "text-[#1d4744]",
    tag: null,
  },
  {
    code: "L4",
    name: "Master",
    desc: "Platform's top 1%. Exclusive corporate contracts, national projects, mentor role access.",
    perks: ["Corporate contracts", "National projects", "Mentor access"],
    color: "bg-white border border-black/10",
    accent: "text-[#1d4744]",
    tag: "Top 1%",
  },
];

export function LandingCareerLevels() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section id="levels" ref={containerRef} className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Master Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#f0b429] font-black text-sm uppercase tracking-[0.2em]">
              Career Growth
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111] mt-3 leading-tight">
              Climb the{" "}
              <span className="relative">
                <span className="relative z-10">career ladder.</span>
                <span className="absolute -bottom-2 left-0 right-0 h-4 bg-[#f0b429]/30 z-0 rounded" />
              </span>
            </h2>
            <p className="text-[#666] mt-4 max-w-xl font-medium leading-relaxed text-lg">
              Every completed job pushes you up a level. Higher levels unlock better pay, better
              projects, and platform perks only available to the elite.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-end relative"
          >
            {/* Background Accent */}
            <div className="absolute right-10 bottom-0 w-64 h-64 bg-[#1d4744]/5 rounded-[40px] rotate-6" />
            
            {/* Parallax Image */}
            <motion.img 
              style={{ y: imgY }}
              src="/assets/landing/worker-master.png"
              alt="Elite Level 4 Master Professional"
              className="relative z-10 h-[400px] object-contain drop-shadow-2xl origin-bottom"
            />
          </motion.div>
        </div>

        {/* Level cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LEVELS.map((level, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className={`relative rounded-3xl p-7 ${level.color} cursor-default`}
            >
              {level.tag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#f0b429] text-[#1d4744] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {level.tag}
                  </span>
                </div>
              )}
              <div className="mb-5">
                <span className={`text-4xl font-black ${level.accent}`}>{level.code}</span>
                <h3
                  className={`text-lg font-black mt-1 ${
                    level.color.includes("bg-[#1d4744]") ? "text-white" : "text-[#111]"
                  }`}
                >
                  {level.name}
                </h3>
              </div>
              <p
                className={`text-sm leading-relaxed mb-5 ${
                  level.color.includes("bg-[#1d4744]") ? "text-white/70" : "text-[#666]"
                } font-medium`}
              >
                {level.desc}
              </p>
              <ul className="space-y-2">
                {level.perks.map((perk, j) => (
                  <li
                    key={j}
                    className={`text-xs font-bold flex items-center gap-2 ${
                      level.color.includes("bg-[#1d4744]") ? "text-white/80" : "text-[#333]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        level.color.includes("bg-[#f0b429]") ? "bg-[#1d4744]" : "bg-[#f0b429]"
                      }`}
                    />
                    {perk}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            to="/sign-up"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1d4744] hover:bg-[#2a5f5b] text-white rounded-2xl font-black text-base transition-all hover:shadow-[0_8px_30px_rgba(29,71,68,0.3)] hover:-translate-y-1"
          >
            Start at L1 — It's Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
