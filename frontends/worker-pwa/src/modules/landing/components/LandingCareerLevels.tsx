export function LandingCareerLevels() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary-fixed/10 blob-3 -z-10"></div>
      <div className="absolute left-1/4 top-1/4 w-32 h-32 bg-secondary-container/20 blob-1 -z-10"></div>
      
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-[42px] md:text-[52px] font-extrabold text-primary text-heavy mb-8 leading-tight">Climb the Ladder.<br/>Earn More.</h2>
          <p className="text-xl text-primary/70 mb-12">Think of TrustHire as your career game. Every job completed successfully helps you reach a higher level with better rewards.</p>
          
          <div className="space-y-8 relative">
            {/* Vertical Progress Path */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-primary/10 -z-10"></div>
            
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center font-black text-primary shadow-lg border-4 border-surface group-hover:scale-110 transition-transform">L4</div>
              <div>
                <h4 className="font-extrabold text-xl font-headline">VIP Professional</h4>
                <p className="text-primary/50 text-sm">₹35,000+ per month • VIP Status</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full bg-primary-fixed/60 flex items-center justify-center font-black text-primary/80 shadow-lg border-4 border-surface group-hover:scale-110 transition-transform">L3</div>
              <div>
                <h4 className="font-extrabold text-xl font-headline">Silver Tier</h4>
                <p className="text-primary/50 text-sm">Bonus payouts active • Top priority</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 group opacity-50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary/40 border-4 border-surface group-hover:scale-110 transition-transform">L2</div>
              <div>
                <h4 className="font-bold text-xl text-primary/40 font-headline">Verified Regular</h4>
                <p className="text-primary/40 text-sm">Building track record</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-fixed/20 blob-2 -z-10"></div>
          {/* Progress Widget Card */}
          <div className="bg-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden border border-surface-container">
            <div className="flex items-center gap-4 mb-8">
              <img 
                className="w-20 h-20 blob-1 object-cover" 
                alt="Profile photo of Ramesh K." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2Uqj11iXB9aHPEBOLyIAGQBz8J2ivAOZjSuc3-d_w-pai7VUMyz5wMpH_ZtN7YEVFW_DqvTpKZaaSvSj9IFWedPoBhIcuziev3SyBBhSk5pmQsk0Xyz0JqvvXKc9bpqmrPwosVzMdANUxBDcbGWHQUSVkWaXX0yS8A55O0HYGX1klQSHmt92_GyipDeSfaEj6YCzqlX3R3OvKXoe_VbfnUtLRbdnWysQPFB1YOCD3nRGz2E2VbWpBtNyoiA3onjIlAdpxBa5qQlA" 
              />
              <div>
                <h3 className="text-2xl font-black text-primary font-headline">Ramesh K.</h3>
                <p className="text-primary/50 font-bold uppercase text-xs">Security Guard • Level 3</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>Progress to L4</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-primary-fixed rounded-full"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-2xl border border-primary-fixed/10">
                  <p className="text-xs font-bold text-primary/40 uppercase">Reliability</p>
                  <p className="text-xl font-black text-primary font-headline">9.8/10</p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl border border-primary-fixed/10">
                  <p className="text-xs font-bold text-primary/40 uppercase">Work Hours</p>
                  <p className="text-xl font-black text-primary font-headline">480h</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-primary/5 flex items-center gap-2 text-emerald-600">
              <span className="material-symbols-outlined font-bold">verified</span>
              <span className="font-bold text-sm uppercase tracking-wider">Top Rated in Chennai</span>
            </div>
          </div>
          
          {/* Additional Float Image */}
          <div className="absolute -bottom-10 -left-10 w-32 h-32 blob-3 overflow-hidden border-4 border-white shadow-xl hidden md:block">
            <img 
              alt="Smiling Indian helper" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwGfmPiOmqVyvirtH3PxKpgHCLVIkEaa4Pg3eLwwvDxolM9vISWK_6kPYLDWaj3L3ZM59pcvpoP52Cv3ic4KoYuvPMY7kKnWaqDVghcSILvY0k8Ec3LPXr-SrzzJi_Aiphmploxh61zViVaKKwbgdQmgEVrgHCJm3Ke-p8RBb4_IdVoNg2Z1z0jl98kEcc2uxh8qdzjy6ly-Txjar9OxR1zyUt8q1ELr_mDKNozLeO2VQPQgqYTyS8v5oyqIUjBhAN_mYuZ3C038U" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
