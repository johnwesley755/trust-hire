import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../api/job.service';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Tag, Plus, X, Navigation, ChevronRight, Loader2 } from 'lucide-react';

export const JobPostingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const mutation = useMutation({
    mutationFn: (job: Partial<import('../api/job.service').Job>) => jobService.createJob(job),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      navigate('/dashboard');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const address = String(formData.get('address') ?? '').trim();
    const city = String(formData.get('city') ?? '').trim();

    const jobData: Partial<import('../api/job.service').Job> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      industry: formData.get('industry') as string,
      location: locationName,
      latitude: coords?.lat,
      longitude: coords?.lon,
      experienceYearsRequired: formData.get('experienceYearsRequired')
        ? Number(formData.get('experienceYearsRequired'))
        : undefined,
      budget: Number(formData.get('budget')),
      address,
      city,
      requiredSkills: skills,
      status: 'OPEN',
    };
    mutation.mutate(jobData);
  };

  const detectLocation = async () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lon: longitude });
          setLocationName("Detecting address...");

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await response.json();
            setLocationName(data.display_name || "Detected Location");
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
            setLocationName("Location Detected (Manual edit recommended)");
          } finally {
            setIsDetecting(false);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setIsDetecting(false);
          alert("Could not detect location. Please type it manually.");
        }
      );
    } else {
        setIsDetecting(false);
        alert("Geolocation is not supported by this browser.");
    }
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
    <div className="min-h-screen bg-brand-bg p-6 md:p-12 selection:bg-brand-primary selection:text-brand-secondary">
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto bg-brand-surface rounded-[3rem] border border-brand-border p-8 md:p-14 shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary/20" />
        
        <header className="mb-12 flex items-center gap-6">
            <div className="w-16 h-16 bg-brand-secondary text-brand-primary rounded-4xl flex items-center justify-center shadow-xl">
                <Plus className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-4xl font-bold text-brand-secondary tracking-tight leading-none">Post a Job</h1>
                <p className="text-brand-primary text-xs font-semibold uppercase tracking-widest mt-1">Listing Details</p>
            </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-3">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Job Title</label>
            <div className="relative group">
              <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted/30 group-focus-within:text-brand-primary h-5 w-5 transition-colors" />
              <input
                name="title"
                required
                placeholder="e.g. Project Manager"
                className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-brand-primary transition-all text-brand-secondary font-medium placeholder:text-brand-muted/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Industry Sector</label>
              <select name="industry" className="w-full bg-white border border-brand-border rounded-2xl py-5 px-5 focus:outline-none focus:border-brand-primary text-brand-secondary font-medium appearance-none cursor-pointer">
                <option value="CONSTRUCTION">Construction</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="LOGISTICS">Logistics</option>
                <option value="FACILITY">Facility Management</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Job Location</label>
              <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted/30 group-focus-within:text-brand-primary h-5 w-5 transition-colors" />
                    <input 
                        name="location" 
                        required 
                        placeholder="City, State" 
                        className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-brand-primary text-brand-secondary font-medium placeholder:text-brand-muted/20" 
                        value={locationName}
                        onChange={(e) => {
                            setLocationName(e.target.value);
                            setCoords(null);
                        }}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={detectLocation}
                    disabled={isDetecting}
                    className="bg-brand-surface text-brand-secondary hover:bg-neutral-800 hover:text-brand-primary p-5 rounded-2xl transition-all shadow-lg border border-brand-border group active:scale-95"
                    title="Detect Current Location"
                  >
                    <Navigation className={`h-6 w-6 ${isDetecting ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform`} />
                  </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Job Description</label>
            <textarea 
                name="description" 
                rows={4} 
                required 
                placeholder="Describe the role and requirements..." 
                className="w-full bg-white border border-brand-border rounded-2xl py-5 px-6 focus:outline-none focus:border-brand-primary text-brand-secondary font-medium resize-none placeholder:text-brand-muted/20" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Job Budget (Monthly)</label>
            <div className="relative group">
              <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted/30 group-focus-within:text-brand-primary h-5 w-5 transition-colors" />
              <input name="budget" type="number" required placeholder="Enter amount" className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-brand-primary text-brand-secondary font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">
                Experience Required (Years)
              </label>
              <input
                name="experienceYearsRequired"
                type="number"
                min={0}
                placeholder="e.g. 3"
                className="w-full bg-white border border-brand-border rounded-2xl py-5 px-5 focus:outline-none focus:border-brand-primary text-brand-secondary font-medium"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">
                Address
              </label>
              <input
                name="address"
                required
                placeholder="Street address"
                className="w-full bg-white border border-brand-border rounded-2xl py-5 px-5 focus:outline-none focus:border-brand-primary text-brand-secondary font-medium"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">
                City
              </label>
              <input
                name="city"
                required
                placeholder="City"
                className="w-full bg-white border border-brand-border rounded-2xl py-5 px-5 focus:outline-none focus:border-brand-primary text-brand-secondary font-medium"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Required Skills</label>
            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted/30 group-focus-within:text-brand-primary h-5 w-5 transition-colors" />
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g. Sales, Marketing"
                  className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-brand-primary text-brand-secondary font-medium placeholder:text-brand-muted/20"
                />
              </div>
              <button
                type="button"
                onClick={addSkill}
                className="bg-brand-secondary text-brand-primary p-5 rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {skills.map(skill => (
                <span key={skill} className="flex items-center gap-2 bg-brand-secondary text-brand-primary rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-widest border border-brand-secondary">
                  {skill}
                  <X className="h-4 w-4 cursor-pointer hover:text-white transition-colors" onClick={() => removeSkill(skill)} />
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-brand-secondary text-brand-primary py-6 rounded-4xl font-semibold text-xl uppercase tracking-widest shadow-2xl shadow-brand-secondary/10 hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-50 mt-8 flex items-center justify-center gap-4 group"
          >
            {mutation.isPending ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                <>Post Job <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
