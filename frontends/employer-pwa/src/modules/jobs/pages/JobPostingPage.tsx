import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../../../services/job.service';
import { useNavigate } from 'react-router-dom';
import { 
    Briefcase, MapPin, Plus, X, 
    ChevronRight, Loader2, 
    HardHat,
    CheckCircle, Lightbulb, IndianRupee
} from 'lucide-react';
import { LocationPicker } from '../components/LocationPicker';

export const JobPostingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);

  const mutation = useMutation({
    mutationFn: (job: Partial<import('../../../services/job.service').Job>) => jobService.createJob(job),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      navigate('/dashboard');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const jobData = {
      title: formData.get('title') as string,
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
    mutation.mutate(jobData);
  };

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <main className="flex-1 p-4 md:p-8 font-['Bricolage_Grotesque'] bg-[#F5F4EF] min-h-screen">
      {/* TopAppBar Context */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 px-2 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1F3F34] leading-tight">
            Create a New Opportunity
          </h1>
          <p className="text-[#1F3F34]/60 font-medium text-sm">Connect with the best regional talent across India.</p>
        </div>
        {/* <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button className="p-2.5 text-[#1F3F34]/60 hover:bg-[#FACD15]/10 rounded-full transition-colors shrink-0">
            <Bell className="w-5 h-5" />
          </button>
          <div className="h-8 w-px bg-[#1F3F34]/10 mx-2 shrink-0"></div>
          <button className="bg-[#FACD15] text-[#1F3F34] font-black uppercase text-[10px] tracking-widest px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-[#FACD15]/20 shrink-0">
            <HelpCircle className="w-3.5 h-3.5" />
            Help Center
          </button>
        </div> */}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* Main Form Section */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white rounded-4xl p-8 md:p-10 shadow-sm border border-[#EFEEE9] relative group">
            <div className="absolute inset-0 overflow-hidden rounded-4xl pointer-events-none">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FACD15] opacity-[0.03] rounded-full group-hover:scale-110 transition-transform duration-700"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Step 1: Basic Info */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 text-[#1F3F34]">
                  <div className="bg-[#FACD15]/10 p-3 rounded-2xl">
                    <Briefcase className="w-6 h-6 text-[#1F3F34]" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Job Fundamentals</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/40 ml-1">Job Title</label>
                    <input 
                      name="title"
                      required
                      className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl p-4.5 text-sm font-bold text-[#1F3F34] focus:outline-none transition-all placeholder-[#1F3F34]/20" 
                      placeholder="e.g. Lead Site Supervisor" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 ml-1">Industry Sector</label>
                    <select name="industry" className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl p-4.5 text-sm font-bold text-[#1F3F34] focus:outline-none transition-all appearance-none cursor-pointer">
                      <option value="CONSTRUCTION">Construction</option>
                      <option value="MAINTENANCE">Maintenance & Repair</option>
                      <option value="ELECTRICAL">Electrical Work</option>
                      <option value="PLUMBING">Plumbing</option>
                      <option value="LOGISTICS">Logistics & Delivery</option>
                      <option value="COOKING_CHEF">Cooking / Chef</option>
                      <option value="HOSPITALITY">Hospitality & Hotel</option>
                      <option value="DOMESTIC_HELP">Domestic Help / Housekeeping</option>
                      <option value="RETAIL">Retail / Shop Assistant</option>
                      <option value="SECURITY">Security Services</option>
                      <option value="AGRICULTURE">Agriculture & Farming</option>
                      <option value="MANUFACTURING">Manufacturing & Factory</option>
                      <option value="GARMENT">Tailoring / Garment</option>
                      <option value="BEAUTY">Salon & Beauty Services</option>
                      <option value="HEALTHCARE">Healthcare / Nursing Assistant</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 ml-1">Job Description</label>
                  <textarea 
                    name="description"
                    required
                    className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl p-5 text-sm font-bold text-[#1F3F34] focus:outline-none transition-all placeholder-[#1F3F34]/20 min-h-[120px]" 
                    placeholder="Describe the day-to-day responsibilities and special requirements..." 
                  />
                </div>
              </div>

              <div className="h-px bg-[#1F3F34]/5"></div>

              {/* Step 2: Location & Logistics */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 text-[#1F3F34]">
                  <div className="bg-[#FACD15]/10 p-3 rounded-2xl">
                    <MapPin className="w-6 h-6 text-[#1F3F34]" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Site Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 ml-1">Address</label>
                    <input 
                      name="address"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl p-4.5 text-sm font-bold text-[#1F3F34] focus:outline-none transition-all" 
                      placeholder="Site No. 4, Industrial Area Phase 2" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 ml-1">City / Region</label>
                    <input 
                      name="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl p-4.5 text-sm font-bold text-[#1F3F34] focus:outline-none transition-all" 
                      placeholder="e.g. Gurugram" 
                      type="text" 
                    />
                  </div>
                </div>

                <LocationPicker 
                    onLocationSelect={(lat, lon, addr, cty) => {
                        setCoords({ lat, lon });
                        setAddress(addr);
                        setCity(cty);
                    }} 
                />
              </div>

              <div className="h-px bg-[#1F3F34]/5"></div>

              {/* Step 3: Requirements & Budget */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 text-[#1F3F34]">
                  <div className="bg-[#FACD15]/10 p-3 rounded-2xl">
                    <IndianRupee className="w-6 h-6 text-[#1F3F34]" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Terms & Talent</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 ml-1">Budget (Monthly)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FACD15]" />
                      <input 
                        name="budget"
                        type="number"
                        required
                        className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl pl-12 pr-4 py-4.5 text-sm font-bold text-[#1F3F34] focus:outline-none transition-all" 
                        placeholder="25,000" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 ml-1">Experience (Years)</label>
                    <input 
                      name="experienceYearsRequired"
                      type="number"
                      min={0}
                      className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl p-4.5 text-sm font-bold text-[#1F3F34] focus:outline-none transition-all" 
                      placeholder="e.g. 3" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 ml-1">Required Skills</label>
                  <div className="flex gap-2">
                      <input 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl px-5 py-4.5 text-sm font-bold text-[#1F3F34] focus:outline-none transition-all" 
                        placeholder="e.g. Welding, Industrial Wiring, Masonry..." 
                      />
                      <button type="button" onClick={addSkill} className="bg-[#1F3F34] text-[#FACD15] px-6 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#1F3F34]/10">
                          <Plus className="w-5 h-5" />
                      </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                        <div key={skill} className="bg-[#1F3F34] text-[#FACD15] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group shadow-lg shadow-[#1F3F34]/10 animate-in fade-in zoom-in">
                            {skill}
                            <X className="w-3 h-3 cursor-pointer group-hover:text-white" onClick={() => removeSkill(skill)} />
                        </div>
                    ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <p className="text-xs text-[#1F3F34]/40 font-medium leading-relaxed max-w-sm">
                  By posting this job, you agree to the <span className="text-[#1F3F34] font-black">Hearth Employer Standards</span> and verified worker protection policies.
                </p>
                <button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="bg-[#1F3F34] text-[#FACD15] w-full md:w-auto px-12 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#1F3F34]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>Post <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Side Sidebar: Tips & Stats */}
        <div className="lg:col-span-4 space-y-8">
          {/* Advice Card */}
          <section className="bg-[#1F3F34] text-[#F5F4EF] p-8 rounded-4xl relative overflow-hidden group shadow-2xl">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#FACD15] opacity-5 rounded-full -mb-12 -mr-12 group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-[#FACD15]" />
                </div>
                <h3 className="text-xl font-black tracking-tight">Post with Confidence</h3>
              </div>
              <ul className="space-y-6">
                {[
                  "Detailed descriptions get 40% more applications.",
                  "Specific addresses help local talent find you faster.",
                  "Budget transparency unlocks verification badges."
                ].map((tip, i) => (
                  <li key={i} className="flex gap-4 group/item">
                    <div className="shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-[#FACD15]" />
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-[#F5F4EF]/80 group-hover/item:text-white transition-colors">
                      {tip}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Preview Card */}
          <section className="bg-white border-2 border-[#F5F4EF] p-6 rounded-4xl shadow-sm hover:border-[#FACD15]/20 transition-colors">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 mb-6 px-1">Worker View Preview</h3>
            <div className="bg-[#F5F4EF]/50 p-6 rounded-3xl border border-[#EFEEE9] space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FACD15]/5 rounded-full -mt-8 -mr-8"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div className="bg-[#1F3F34] p-2.5 rounded-2xl shadow-lg">
                        <HardHat className="w-5 h-5 text-[#FACD15]" />
                    </div>
                    <span className="text-[9px] font-black bg-[#FACD15] px-3 py-1.5 rounded-full text-[#1F3F34] shadow-sm tracking-wider">NEW</span>
                </div>
                <div className="space-y-3">
                    <div className="h-5 w-3/4 bg-[#1F3F34]/10 rounded-full"></div>
                    <div className="h-3 w-1/2 bg-[#1F3F34]/5 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="h-8 bg-white rounded-2xl border border-[#EFEEE9]"></div>
                    <div className="h-8 bg-white rounded-2xl border border-[#EFEEE9]"></div>
                </div>
                <div className="h-12 bg-[#1F3F34] rounded-2xl mt-4 w-full shadow-lg shadow-[#1F3F34]/10"></div>
            </div>
            <p className="mt-6 text-[10px] font-bold text-[#1F3F34]/30 text-center uppercase tracking-widest">
              Live preview of search results
            </p>
          </section>

          {/* Employer Trust Score */}
          <section className="bg-white p-6 rounded-4xl flex items-center gap-6 border-2 border-[#F5F4EF] shadow-sm group">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="absolute w-full h-full -rotate-90 group-hover:scale-110 transition-transform" viewBox="0 0 36 36">
                <path className="text-[#F5F4EF]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                <path className="text-[#FACD15]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="85, 100" strokeLinecap="round" strokeWidth="4"></path>
              </svg>
              <span className="text-sm font-black text-[#1F3F34] relative z-10">85%</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-[#1F3F34] uppercase tracking-tight">Trust Reputation</h4>
              <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest mt-1">Top 15% of Employers</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
