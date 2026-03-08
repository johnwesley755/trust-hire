import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../api/job.service';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Tag, Plus, X, Navigation } from 'lucide-react';

export const JobPostingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const mutation = useMutation({
    mutationFn: (job: import('../api/job.service').Job) => jobService.createJob(job),
    onSuccess: () => {
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
      location: locationName,
      latitude: coords?.lat,
      longitude: coords?.lon,
      budget: Number(formData.get('budget')),
      requiredSkills: skills,
    };
    mutation.mutate(jobData);
  };

  const detectLocation = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setLocationName("Current Location (GPS Detected)");
          setIsDetecting(false);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-lg">
        <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-8">
          Post a New Job
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
              <input
                name="title"
                required
                placeholder="e.g. Master Plumber for High-Rise"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Industry / Domain</label>
              <select name="industry" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-sm">
                <option value="CONSTRUCTION">Construction</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="PLUMBING">Plumbing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Location</label>
              <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
                    <input 
                        name="location" 
                        required 
                        placeholder="Bangalore, Electronic City" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-sm" 
                        value={locationName}
                        onChange={(e) => {
                            setLocationName(e.target.value);
                            setCoords(null); // Reset coords if they type manually
                        }}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={detectLocation}
                    disabled={isDetecting}
                    className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-3 rounded-xl transition-colors shadow-sm flex items-center justify-center border border-indigo-100"
                    title="Detect Current Location"
                  >
                    <Navigation className={`h-5 w-5 ${isDetecting ? 'animate-pulse' : ''}`} />
                  </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Description</label>
            <textarea name="description" rows={4} required placeholder="Detail the job requirements and scope..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 resize-none shadow-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Total Budget (Est.)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
              <input name="budget" type="number" required placeholder="5000" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-sm" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-600">Required Skills</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g. Soldering"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-sm"
                />
              </div>
              <button
                type="button"
                onClick={addSkill}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors shadow-md"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map(skill => (
                <span key={skill} className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1 text-sm font-medium text-slate-700">
                  {skill}
                  <X className="h-4 w-4 cursor-pointer hover:text-red-600" onClick={() => removeSkill(skill)} />
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-indigo-500/10 transition-all disabled:opacity-50 mt-4"
          >
            {mutation.isPending ? 'Publishing...' : 'Publish Job Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};
