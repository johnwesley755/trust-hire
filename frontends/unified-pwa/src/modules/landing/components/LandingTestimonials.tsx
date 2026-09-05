export function LandingTestimonials() {
  const stories = [
    {
      name: "Ramesh",
      role: "Security Guard, Mumbai",
      quote: "Pehle main naka par khada rehta tha. Ab TrustHire ki wajah se mere paas fixed naukri hai aur izzat bhi.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD07jGtFCwE_SXKto8Gkxd9WagrIE14rUvge0v97pWal6dbDRLYF3BFh-u3TPkACIT1Av93yKH4oLwWZNaWfYR2aeBy32rpaKv9M_OZB2vR12DPAt2yYNnyOCx8LNKMTvS5wylung0VogOYjef1R6NLlYa_3L9zvlKYxO6_ivOjAIQ8duGBbzcByzT8cpesLlhJqBOAoyFk5ug6aBl5VnHs9PPov1BkzM19pY8CmgenpKPy_Ucw0MQ5cfGkvNg5HEuYufA5an3aTOY",
      blob: "blob-1"
    },
    {
      name: "Priya",
      role: "Professional Cook, Pune",
      quote: "I got a 2.5x salary hike after reaching Level 4. The insurance helped me when my daughter was sick.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwGfmPiOmqVyvirtH3PxKpgHCLVIkEaa4Pg3eLwwvDxolM9vISWK_6kPYLDWaj3L3ZM59pcvpoP52Cv3ic4KoYuvPMY7kKnWaqDVghcSILvY0k8Ec3LPXr-SrzzJi_Aiphmploxh61zViVaKKwbgdQmgEVrgHCJm3Ke-p8RBb4_IdVoNg2Z1z0jl98kEcc2uxh8qdzjy6ly-Txjar9OxR1zyUt8q1ELr_mDKNozLeO2VQPQgqYTyS8v5oyqIUjBhAN_mYuZ3C038U",
      blob: "blob-2"
    },
    {
      name: "Suresh",
      role: "Executive Driver, Delhi",
      quote: "TrustHire is like my elder brother. They guide me on how to talk to clients and grow my skills.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEP-lC3Zt1n3wf4ak99rvS9xFNBjKL1dIpqv7u4NQX3PFUAhbqQMUdyMaETxcGkYf5fAiwGyTYZPzWMHbBXJERcVvdpQNjN9VjQWi4T3I_PSbuca6ysLccR5u0U3tIh1H5YcpY40nTNuTAAr3m88yyF7-AaZsmNPv4M-YQpIlL8f8LZETz6kxWn7n6jngeMyqztFKvWlJapROU0HQeRJSLAD8fPTOSvZ8UF0mEOmWWPING7NDeXAtV8DxqSKgGTdj5MpMPRMrxVXw",
      blob: "blob-3"
    }
  ];

  return (
    <section id="success-stories" className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-secondary-container/10 blob-3 -z-10"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-primary-fixed/10 blob-5 opacity-40 -z-10"></div>
      
      <h2 className="text-[42px] font-extrabold text-primary text-heavy mb-16 text-center font-headline">Join 12,000+ Happy Workers</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {stories.map((story, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-surface-container group hover:-translate-y-2">
            <div className={`${story.blob} w-full h-56 overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-500`}>
              <img 
                className="w-full h-full object-cover" 
                alt={`${story.name} smiling`}
                src={story.img}
              />
            </div>
            <h4 className="text-2xl font-black text-primary mb-2 font-headline">{story.name}</h4>
            <p className="text-primary/50 text-sm font-bold uppercase mb-4 font-label">{story.role}</p>
            <p className="text-primary/80 italic font-body">"{story.quote}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}
