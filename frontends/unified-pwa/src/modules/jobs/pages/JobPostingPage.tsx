import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../../../services/job.service';
import { useNavigate } from 'react-router-dom';
import { 
    Briefcase, Plus, X, 
    ChevronRight, Loader2, 
    CheckCircle, Lightbulb, IndianRupee, CalendarClock, ShieldCheck
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
    mutationFn: (job: any) => jobService.createJob(job),
    onSuccess: (newJob) => {
      if (newJob) {
        queryClient.setQueryData(['employerJobs'], (old: any) => {
          if (!old) return [newJob];
          return Array.isArray(old) ? [newJob, ...old] : old;
        });
        queryClient.setQueryData(['jobs'], (old: any) => {
          if (!old) return [newJob];
          return Array.isArray(old) ? [newJob, ...old] : old;
        });
      }
      navigate('/dashboard');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const expiresAtRaw = formData.get('expiresAt') as string;

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
      expiresAt: expiresAtRaw || undefined,
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
    <main className="flex-1 p-4 md:p-8 bg-slate-50/50 min-h-screen font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 max-w-7xl mx-auto px-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#0066FF] mb-1">
            <ShieldCheck className="w-4 h-4" /> Enterprise Hiring Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A1931] leading-tight">
            Post a Verified Trade Shift
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
            Instant candidate matching across our network with guaranteed escrow protection.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Main Form Section */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900">Shift Fundamentals</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Role / Shift Title *</label>
                    <input 
                      name="title"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066FF] rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none transition-all" 
                      placeholder="e.g. Master Electrician for Commercial Mall" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Industry Trade Category *</label>
                    <select name="industry" className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066FF] rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none transition-all cursor-pointer">
                      <option value="ELECTRICAL">Electrical Work</option>
                      <option value="PLUMBING">Plumbing</option>
                      <option value="CONSTRUCTION">Construction & Masonry</option>
                      <option value="MAINTENANCE">Facility Maintenance & Repair</option>
                      <option value="LOGISTICS">Logistics & Warehouse</option>
                      <option value="COOKING_CHEF">Cooking / Commercial Chef</option>
                      <option value="HOSPITALITY">Hospitality & Hotel Staff</option>
                      <option value="DOMESTIC_HELP">Housekeeping / Cleaning</option>
                      <option value="SECURITY">Security Services</option>
                      <option value="MANUFACTURING">Manufacturing & Fabrication</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Shift Scope & Responsibilities *</label>
                  <textarea 
                    name="description"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066FF] rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none transition-all min-h-[100px]" 
                    placeholder="Describe daily work duties, shift timings, tools provided, and specific site guidelines..." 
                  />
                </div>
              </div>

              {/* Step 2: Location & Logistics */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900">Job Site Location</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Street / Site Address *</label>
                    <input 
                      name="address"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066FF] rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none transition-all" 
                      placeholder="e.g. Plot 42, HSR Layout Sector 2" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">City / Region *</label>
                    <input 
                      name="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066FF] rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none transition-all" 
                      placeholder="e.g. Bengaluru" 
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

              {/* Step 3: Requirements & Budget */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900">Compensation & Skills</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Budget / Payout (₹) *</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        name="budget"
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066FF] rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none transition-all" 
                        placeholder="22000" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Min. Experience (Years)</label>
                    <input 
                      name="experienceYearsRequired"
                      type="text"
                      min={0}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066FF] rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none transition-all" 
                      placeholder="e.g. 2" 
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <CalendarClock className="w-3.5 h-3.5 text-[#0066FF]" /> Listing Auto-Expiry Date *
                  </label>
                  <input 
                    name="expiresAt"
                    type="date"
                    required
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066FF] rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none transition-all" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Specific Trade Skill Tags</label>
                  <div className="flex gap-2">
                      <input 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066FF] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none transition-all" 
                        placeholder="e.g. Conduit Bending, Three Phase, Soldering..." 
                      />
                      <button 
                        type="button" 
                        onClick={addSkill} 
                        className="bg-[#0066FF] hover:bg-blue-700 text-white px-4 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center"
                      >
                          <Plus className="w-4 h-4" />
                      </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {skills.map(skill => (
                        <div key={skill} className="bg-blue-50 text-[#0066FF] border border-blue-200 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                            {skill}
                            <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeSkill(skill)} />
                        </div>
                    ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400 font-medium">
                  Protected by <span className="text-slate-800 font-bold">TrustHyre Escrow</span> with instant worker dispatch.
                </p>
                <button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="bg-[#0066FF] hover:bg-blue-700 text-white w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>Publish Shift Now <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Sidebar: Benefits & Guarantees */}
        <div className="lg:col-span-4 space-y-4">
          <section className="bg-gradient-to-br from-[#0A1931] to-[#0066FF] text-white p-6 rounded-3xl shadow-md border border-blue-500/20 space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-300" />
              <h3 className="text-base font-extrabold text-white">TrustHyre Hiring Speed</h3>
            </div>
            <ul className="space-y-3 text-xs text-blue-100/90 leading-relaxed font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Nearby verified candidates receive instant push notifications.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Escrow lock ensures 0 payment disputes and faster shift confirmations.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Candidates with 4.8+ TrustScore get priority shift routing.</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
};
