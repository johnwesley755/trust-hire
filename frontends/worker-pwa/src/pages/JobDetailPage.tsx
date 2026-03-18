import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { jobService } from '../api/job.service';
import { applicationService } from '../api/application.service';
import { profileService } from '../api/profile.service';
import { useState } from 'react';
import { ArrowLeft, MapPin, IndianRupee, Send, CheckCircle, ShieldCheck, Clock } from 'lucide-react';
import { formatMissingProfileFields, getMissingProfileFields } from '../utils/profileCompletion';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hasJustApplied, setHasJustApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(id!),
    enabled: !!id
  });

  const { data: profile } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  const { data: myApplications = [], refetch: refetchApplications } = useQuery({
    queryKey: ['myApplications'],
    queryFn: applicationService.getMyApplications,
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof applicationService.applyForJob>[0]) => applicationService.applyForJob(data),
    onSuccess: async () => {
      setHasJustApplied(true);
      await refetchApplications();
    },
    onError: async (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to submit application.';
      if (String(message).toLowerCase().includes('already applied')) {
        setHasJustApplied(true);
        await refetchApplications();
        return;
      }
      alert(message);
    }
  });

  const handleApply = () => {
    const missingFields = getMissingProfileFields(profile);
    if (missingFields.length > 0) {
      alert(`Complete your profile before applying. Missing: ${formatMissingProfileFields(missingFields)}.`);
      navigate('/profile');
      return;
    }
    mutation.mutate({ jobId: id!, coverLetter });
  };

  const alreadyApplied = hasJustApplied || myApplications.some((application) => application.jobId === id);

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!job) return <div className="min-h-screen bg-slate-50 text-slate-900 p-8">Job not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-32">
      <header className="p-6 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-xl z-50 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold truncate">{job.title}</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-semibold tracking-widest rounded-full">
                {job.industry}
              </span>
              <h2 className="text-3xl font-bold leading-none">{job.title}</h2>
              <p className="text-slate-500 flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4" /> {job.location}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold text-emerald-400 flex items-center justify-end gap-1">
                <IndianRupee className="w-6 h-6" />
                {job.budget?.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-widest">Project budget</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">Client status</p>
                <p className="text-sm font-semibold">Verified</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-sm">
              <Clock className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">Posted</p>
                <p className="text-sm font-semibold">Today</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold tracking-widest text-slate-500">Job description</h3>
          <p className="text-slate-600 leading-relaxed text-lg font-medium">
            {job.description}
          </p>
        </section>

        {!alreadyApplied ? (
          <section className="space-y-6 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Interested?</h3>
              <p className="text-slate-500 text-sm">Tell the employer why you're a good fit for this job.</p>
            </div>
              <textarea 
              placeholder="Enter your cover letter or introduction..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-900"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <button 
              onClick={handleApply}
              disabled={mutation.isPending}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-semibold text-lg hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
            >
              {mutation.isPending ? 'Processing...' : <><Send className="w-6 h-6" /> Apply Now</>}
            </button>
          </section>
        ) : (
          <div className="p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-4 shadow-2xl shadow-emerald-500/5 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-semibold">Application sent!</h3>
            <p className="text-slate-400 text-sm font-medium">The employer will contact you if they're interested.</p>
            <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-semibold transition-all cursor-pointer">Back to Dashboard</button>
          </div>
        )}
      </main>
    </div>
  );
}
