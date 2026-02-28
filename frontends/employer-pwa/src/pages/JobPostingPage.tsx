import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../api/job.service';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Tag, Plus, X } from 'lucide-react';

export const JobPostingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

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
      location: formData.get('location') as string,
      budget: Number(formData.get('budget')),
      requiredSkills: skills,
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
    <div className="min-h-screen bg-primary-950 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-primary-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-10 shadow-2xl">
        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-8">
          Post a New Job
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
              <input
                name="title"
                required
                placeholder="e.g. Master Plumber for High-Rise"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">Industry / Domain</label>
              <select name="industry" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="CONSTRUCTION" className="bg-primary-950">Construction</option>
                <option value="MAINTENANCE" className="bg-primary-950">Maintenance</option>
                <option value="ELECTRICAL" className="bg-primary-950">Electrical</option>
                <option value="PLUMBING" className="bg-primary-950">Plumbing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
                <input name="location" required placeholder="Bangalore, Electronic City" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Description</label>
            <textarea name="description" rows={4} required placeholder="Detail the job requirements and scope..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Total Budget (Est.)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
              <input name="budget" type="number" required placeholder="5000" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-white/60">Required Skills</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g. Soldering"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={addSkill}
                className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl transition-colors"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map(skill => (
                <span key={skill} className="flex items-center gap-1 bg-white/10 border border-white/5 rounded-lg px-3 py-1 text-sm font-medium">
                  {skill}
                  <X className="h-4 w-4 cursor-pointer hover:text-red-400" onClick={() => removeSkill(skill)} />
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 mt-4"
          >
            {mutation.isPending ? 'Publishing...' : 'Publish Job Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};
