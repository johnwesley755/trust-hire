const STATS = [
  { label: "Verified Workers", value: "25k+" },
  { label: "Active Employers", value: "1.2k+" },
  { label: "Cities Covered", value: "15+" },
  { label: "Job Retention", value: "94%" },
];

export function LandingStats() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-extrabold text-slate-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
