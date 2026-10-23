export function LandingMarquee() {
  const items = [
    { text: "Success Story: Suresh (Guard) 40% Hike", type: "story" },
    { text: "Certified Cook", type: "badge" },
    { text: "Priya (Helper) Joined Level 2", type: "story" },
    { text: "Verified Skill Badge", type: "badge" },
  ];

  const content = (
    <div className="flex gap-12 items-center">
      {items.map((item, i) => (
        <div key={i} className="flex gap-12 items-center">
          {item.type === "story" ? (
            <span className="text-primary-fixed font-black text-2xl uppercase italic whitespace-nowrap">{item.text}</span>
          ) : (
            <span className="text-white font-bold text-xl px-4 py-1 border border-white/20 rounded-full whitespace-nowrap">{item.text}</span>
          )}
          <span className="w-2 h-2 rounded-full bg-primary-fixed/30 flex-shrink-0"></span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="bg-primary py-10 overflow-hidden relative">
      <div className="flex gap-12 whitespace-nowrap animate-marquee items-center">
        {content}
        {content}
      </div>
    </section>
  );
}
