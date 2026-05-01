import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Briefcase, MapPin, Plus, X, 
    ChevronRight, Loader2, 
    HardHat,
    CheckCircle, Lightbulb, IndianRupee
} from 'lucide-react';
import { LocationPicker } from '../../components/common/LocationPicker';
import { useAppDispatch } from '../../store';
import { postJob } from '../../store/slices/jobSlice';

export const JobPostingPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const jobData = {
      title: (formData.get('title') as string).toUpperCase(),
      description: formData.get('description') as string,
      industry: formData.get('industry') as string,
      location: address,
      latitude: coords?.lat,
      longitude: coords?.lon,
      experienceYearsRequired: Number(formData.get('experienceYearsRequired') || 0),
      budget: Number(formData.get('budget')),
      address: address,
      city: city,
      requiredSkills: skills,
      status: 'OPEN' as const,
    };

    try {
        await dispatch(postJob(jobData)).unwrap();
        navigate('/dashboard');
    } catch (err) {
        console.error("Failed to post job:", err);
        alert("Mission initialization failed. Please verify tactical data.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput.toUpperCase())) {
      setSkills([...skills, skillInput.toUpperCase()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <main className="flex-1 p-4 lg:p-12 bg-[#F5F4EF] min-h-screen selection:bg-[#FACD15] selection:text-[#1F3F34]">
      {/* TopAppBar Context */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 px-4 gap-8 text-left">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#1F3F34] leading-[0.9] uppercase bricolage">
            Initialize<br/>
            <span className="text-[#1F3F34]/30">Tactical Briefing</span>
          </h1>
          <p className="text-[#1F3F34]/60 font-black text-[10px] uppercase tracking-[0.3em]">Recruiting regional excellence across Bharat.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1600px] mx-auto text-left">
        {/* Main Form Section */}
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white rounded-[3.5rem] p-8 md:p-14 shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9] relative group overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FACD15] opacity-[0.03] rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-16">
              {/* Step 1: Basic Info */}
              <div className="space-y-12">
                <div className="flex items-center gap-6 text-[#1F3F34]">
                  <div className="bg-[#1F3F34] p-4 rounded-2xl shadow-xl shadow-[#1F3F34]/10">
                    <Briefcase className="w-8 h-8 text-[#FACD15]" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase bricolage">Mission Parameters</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 ml-2">Mission Callsign (Title)</label>
                    <input 
                      name="title"
                      required
                      className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full px-8 py-5 text-sm font-black text-[#1F3F34] focus:outline-none transition-all placeholder:text-[#1F3F34]/10 shadow-inner uppercase" 
                      placeholder="e.g. Lead Site Overseer" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 ml-2">Tactical Sector</label>
                    <div className="relative">
                        <select name="industry" className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full px-8 py-5 text-sm font-black text-[#1F3F34] focus:outline-none transition-all appearance-none cursor-pointer shadow-inner uppercase">
                          <option value="CONSTRUCTION">Construction</option>
                          <option value="MAINTENANCE">Maintenance & Repair</option>
                          <option value="ELECTRICAL">Electrical Work</option>
                          <option value="PLUMBING">Plumbing</option>
                          <option value="LOGISTICS">Logistics & Delivery</option>
                          <option value="COOKING_CHEF">Cooking / Chef</option>
                          <option value="HOSPITALITY">Hospitality & Hotel</option>
                          <option value="DOMESTIC_HELP">Domestic Help</option>
                          <option value="RETAIL">Retail / Shop</option>
                          <option value="SECURITY">Security Services</option>
                          <option value="AGRICULTURE">Agriculture</option>
                          <option value="MANUFACTURING">Manufacturing</option>
                          <option value="GARMENT">Tailoring / Garment</option>
                          <option value="BEAUTY">Salon & Beauty</option>
                          <option value="HEALTHCARE">Healthcare</option>
                        </select>
                        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FACD15] rotate-90 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 ml-2">Mission Briefing (Description)</label>
                  <textarea 
                    name="description"
                    required
                    className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-[2.5rem] p-10 text-sm font-black text-[#1F3F34] focus:outline-none transition-all placeholder:text-[#1F3F34]/10 shadow-inner min-h-[160px] resize-none" 
                    placeholder="Outline day-to-day tactical responsibilities and specialized mission requirements..." 
                  />
                </div>
              </div>

              {/* Step 2: Location & Logistics */}
              <div className="space-y-12">
                <div className="flex items-center gap-6 text-[#1F3F34]">
                  <div className="bg-[#1F3F34] p-4 rounded-2xl shadow-xl shadow-[#1F3F34]/10">
                    <MapPin className="w-8 h-8 text-[#FACD15]" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase bricolage">Deployment Hub</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 ml-2">Hub Address</label>
                    <input 
                      name="address"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value.toUpperCase())}
                      className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full px-8 py-5 text-sm font-black text-[#1F3F34] focus:outline-none transition-all placeholder:text-[#1F3F34]/10 shadow-inner uppercase" 
                      placeholder="Street, Building, Sector..." 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 ml-2">Target City / Zone</label>
                    <input 
                      name="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value.toUpperCase())}
                      className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full px-8 py-5 text-sm font-black text-[#1F3F34] focus:outline-none transition-all placeholder:text-[#1F3F34]/10 shadow-inner uppercase" 
                      placeholder="e.g. Gurugram HQ" 
                      type="text" 
                    />
                  </div>
                </div>

                <div className="px-2">
                    <LocationPicker 
                        onLocationSelect={(lat, lon, addr, cty) => {
                            setCoords({ lat, lon });
                            setAddress(addr.toUpperCase());
                            setCity(cty.toUpperCase());
                        }} 
                    />
                </div>
              </div>

              {/* Step 3: Requirements & Budget */}
              <div className="space-y-12">
                <div className="flex items-center gap-6 text-[#1F3F34]">
                  <div className="bg-[#1F3F34] p-4 rounded-2xl shadow-xl shadow-[#1F3F34]/10">
                    <IndianRupee className="w-8 h-8 text-[#FACD15]" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase bricolage">Financial Protocol</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 ml-2">Monthly Stipend (INR)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FACD15]" />
                      <input 
                        name="budget"
                        type="number"
                        required
                        className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full pl-14 pr-8 py-5 text-sm font-black text-[#1F3F34] focus:outline-none transition-all shadow-inner" 
                        placeholder="25,000" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 ml-2">Experience (Deployment Years)</label>
                    <input 
                      name="experienceYearsRequired"
                      type="number"
                      min={0}
                      className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full px-8 py-5 text-sm font-black text-[#1F3F34] focus:outline-none transition-all shadow-inner" 
                      placeholder="e.g. 3" 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 ml-2">Specialized Skillsets</label>
                  <div className="flex gap-4">
                      <input 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full px-8 py-5 text-sm font-black text-[#1F3F34] focus:outline-none transition-all placeholder:text-[#1F3F34]/10 shadow-inner uppercase" 
                        placeholder="e.g. WELDING, WIRING, MASONRY..." 
                      />
                      <button type="button" onClick={addSkill} className="bg-[#1F3F34] text-[#FACD15] w-16 h-16 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#1F3F34]/20 flex items-center justify-center">
                          <Plus className="w-8 h-8 font-black" />
                      </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    {skills.map(skill => (
                        <div key={skill} className="bg-[#1F3F34] text-[#FACD15] px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 group shadow-xl shadow-[#1F3F34]/20 animate-in fade-in zoom-in duration-300">
                            {skill}
                            <X className="w-4 h-4 cursor-pointer hover:text-white transition-colors" onClick={() => removeSkill(skill)} />
                        </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-12 border-t border-[#F5F4EF]">
                <div className="flex items-start gap-4 max-w-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#FACD15]/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-[#FACD15]" />
                    </div>
                    <p className="text-[10px] text-[#1F3F34]/40 font-black uppercase tracking-widest leading-relaxed">
                        By deploying this brief, you validate compliance with <span className="text-[#1F3F34]">Hearth Trust Standards</span> and operative safety protocols.
                    </p>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#FACD15] text-[#1F3F34] w-full md:w-auto px-16 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-[0_40px_80px_-20px_rgba(250,205,21,0.5)] hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin font-black" /> : (
                      <>DEPLOY MISSION <ChevronRight className="w-5 h-5 group-hover:translate-x-3 transition-transform font-black" /></>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Side Sidebar: Tips & Stats */}
        <div className="lg:col-span-4 space-y-10">
          {/* Advice Card */}
          <section className="bg-[#1F3F34] text-white p-12 rounded-[3.5rem] relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(31,63,52,0.4)]">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#FACD15] opacity-[0.03] rounded-full -mb-20 -mr-20 group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                  <Lightbulb className="w-8 h-8 text-[#FACD15]" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter uppercase bricolage">Tactical Edge</h3>
              </div>
              <ul className="space-y-8">
                {[
                  "Detailed briefings increase operative engagement by 40%.",
                  "Precise geofencing ensures local elite-tier matching.",
                  "Budget transparency unlocks immediate Trust Badges."
                ].map((tip, i) => (
                  <li key={i} className="flex gap-6 group/item">
                    <div className="shrink-0 mt-1">
                      <div className="w-2 h-2 bg-[#FACD15] rounded-full group-hover/item:scale-150 transition-transform"></div>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed text-white/60 group-hover/item:text-white transition-colors">
                      {tip}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Preview Card */}
          <section className="bg-white border-2 border-[#EFEEE9] p-10 rounded-[3.5rem] shadow-2xl shadow-[#1F3F34]/5 hover:border-[#FACD15]/40 transition-all text-center">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#1F3F34]/20 mb-10">OPERATIVE VISION PREVIEW</h3>
            <div className="bg-[#F5F4EF]/50 p-8 rounded-[2.5rem] border border-[#EFEEE9] space-y-8 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACD15]/5 rounded-full -mt-12 -mr-12"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div className="bg-[#1F3F34] p-3 rounded-2xl shadow-2xl">
                        <HardHat className="w-6 h-6 text-[#FACD15]" />
                    </div>
                    <span className="text-[8px] font-black bg-[#FACD15] px-4 py-2 rounded-full text-[#1F3F34] shadow-xl tracking-[0.2em]">INCOMING</span>
                </div>
                <div className="space-y-4">
                    <div className="h-6 w-3/4 bg-[#1F3F34]/10 rounded-full animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-[#1F3F34]/5 rounded-full animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-10 bg-white/50 rounded-2xl border border-[#EFEEE9]"></div>
                    <div className="h-10 bg-white/50 rounded-2xl border border-[#EFEEE9]"></div>
                </div>
                <div className="h-14 bg-[#1F3F34] rounded-2xl mt-6 w-full shadow-2xl shadow-[#1F3F34]/20 opacity-20"></div>
            </div>
            <p className="mt-8 text-[9px] font-black text-[#1F3F34]/20 uppercase tracking-[0.3em] italic">
              Real-time synchronization active
            </p>
          </section>

          {/* Employer Trust Score */}
          <section className="bg-[#1F3F34] p-10 rounded-[3rem] flex items-center gap-8 border border-white/5 shadow-2xl group">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="absolute w-full h-full -rotate-90 group-hover:scale-110 transition-transform duration-700" viewBox="0 0 36 36">
                <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                <path className="text-[#FACD15]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="85, 100" strokeLinecap="round" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 8px #FACD15)' }}></path>
              </svg>
              <span className="text-lg font-black text-white relative z-10 bricolage">85.0</span>
            </div>
            <div className="text-left">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Reputation Index</h4>
              <p className="text-[9px] font-black text-[#FACD15] uppercase tracking-[0.2em] mt-2">Elite-Tier Employer Status</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
