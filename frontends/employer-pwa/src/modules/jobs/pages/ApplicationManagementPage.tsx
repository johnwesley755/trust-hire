import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService, type JobApplication } from '../api/application.service';
import { jobService } from '../api/job.service';
import { workerService } from '../../search/api/worker.service';
import { CheckCircle, XCircle, Clock, User, FileText, ChevronRight, Loader2, ShieldCheck, Mail, Phone, MapPin, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ApplicationManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: jobs } = useQuery({ queryKey: ['employerJobs'], queryFn: jobService.getEmployerJobs });
  const jobIds = jobs?.map(j => j.id).filter((id): id is string => !!id) || [];
  
  const { data: applications, isLoading } = useQuery({
      queryKey: ['allEmployerApplications', jobIds],
      queryFn: () => applicationService.getApplicationsForEmployerJobs(jobIds),
      enabled: jobIds.length > 0,
      staleTime: 0,
      refetchOnMount: 'always'
  });

  const workerIds = applications?.map((app) => app.workerId) || [];
  const { data: workers = [] } = useQuery({
    queryKey: ['employerApplicationWorkers', workerIds],
    queryFn: () => workerService.getProfilesByUserIds(workerIds),
    enabled: workerIds.length > 0,
  });

  const workersById = new Map(workers.map((worker) => [worker.userId, worker]));
  const jobsById = new Map((jobs || []).filter((job) => job.id).map((job) => [job.id!, job]));

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: JobApplication['status'] }) => 
      applicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allEmployerApplications'] });
    }
  });

  return (
    <>
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
      
      <header className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-neutral-900 leading-tight">Applications</h1>
          <p className="text-brand-primary text-[10px] font-semibold uppercase tracking-widest mt-2">Review and manage job applications</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">Loading applications...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {applications?.map((app, idx) => (
              <motion.div 
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-8 md:p-10 rounded-4xl bg-brand-surface border border-brand-border hover:border-brand-primary/30 transition-all flex flex-col lg:flex-row gap-10 items-start lg:items-center shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                    <ShieldCheck className="w-40 h-40 text-brand-primary" />
                </div>

                <div className="flex-1 space-y-6 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[1.75rem] overflow-hidden bg-brand-secondary border border-brand-secondary shadow-2xl group-hover:scale-105 transition-transform shrink-0">
                      {workersById.get(app.workerId)?.profileImageUrl ? (
                        <img
                          src={workersById.get(app.workerId)?.profileImageUrl}
                          alt={workersById.get(app.workerId)?.fullName || 'Applicant'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-primary">
                          <User className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold text-brand-secondary tracking-tight leading-tight mb-2">
                        {workersById.get(app.workerId)?.fullName || `Applicant #${app.workerId.substring(0, 8)}`}
                      </h3>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-primary/70 mb-2">
                        {jobsById.get(app.jobId)?.title || 'Job application'}
                      </p>
                      <p className="text-brand-primary text-[10px] font-semibold flex items-center gap-2 uppercase tracking-widest">
                        <Clock className="w-4 h-4" /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs font-medium text-brand-muted">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 border border-brand-border">
                          <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                          {workersById.get(app.workerId)?.city || workersById.get(app.workerId)?.address || 'Location not provided'}
                        </span>
                        {workersById.get(app.workerId)?.email && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 border border-brand-border">
                            <Mail className="w-3.5 h-3.5 text-brand-primary" />
                            {workersById.get(app.workerId)?.email}
                          </span>
                        )}
                        {workersById.get(app.workerId)?.phoneNumber && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 border border-brand-border">
                            <Phone className="w-3.5 h-3.5 text-brand-primary" />
                            {workersById.get(app.workerId)?.phoneNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,0.8fr] gap-6">
                    <div className="bg-white p-8 rounded-4xl border border-brand-border text-brand-muted font-medium text-lg leading-relaxed relative shadow-inner">
                      <FileText className="absolute top-6 right-6 w-6 h-6 text-brand-primary/10" />
                      <p className="line-clamp-4">
                        "{workersById.get(app.workerId)?.bio || app.coverLetter || "No profile summary provided."}"
                      </p>
                    </div>

                    <div className="bg-white p-8 rounded-4xl border border-brand-border shadow-inner space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-brand-muted font-semibold">Applicant Snapshot</span>
                        <BadgeCheck className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div className="space-y-3 text-sm text-brand-secondary">
                        <p><span className="text-brand-muted">Experience:</span> {workersById.get(app.workerId)?.experienceYears ?? 0} years</p>
                        <p><span className="text-brand-muted">Level:</span> {workersById.get(app.workerId)?.level || 'L1'}</p>
                        <p><span className="text-brand-muted">Address:</span> {workersById.get(app.workerId)?.address || 'Not provided'}</p>
                      </div>
                      {workersById.get(app.workerId)?.skills && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {workersById.get(app.workerId)!.skills!.split(',').map((skill) => (
                            <span
                              key={`${app.workerId}-${skill.trim()}`}
                              className="px-3 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-semibold uppercase tracking-widest border border-brand-primary/20"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full lg:w-80 relative z-10">
                  <div className="flex flex-col gap-4 w-full">
                    <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted ml-1">Status</label>
                        <span className={`w-full py-4 rounded-2xl text-center text-[10px] font-semibold uppercase tracking-widest border flex items-center justify-center gap-2 shadow-sm ${
                        app.status === 'PENDING' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' : 
                        app.status === 'ACCEPTED' ? 'bg-brand-secondary text-brand-primary border-brand-secondary' : 
                        'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                        {app.status === 'PENDING' ? 'Pending' : app.status === 'ACCEPTED' ? 'Approved' : 'Rejected'}
                        </span>
                    </div>
                    
                    {app.status === 'PENDING' && (
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                        <button 
                          onClick={() => mutation.mutate({ id: app.id!, status: 'ACCEPTED' })}
                          className="flex-1 py-5 bg-brand-secondary text-brand-primary rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all hover:bg-neutral-900 active:scale-[0.98] shadow-2xl shadow-brand-secondary/20"
                        >
                          <CheckCircle className="w-5 h-5" /> Approve
                        </button>
                        <button 
                          onClick={() => mutation.mutate({ id: app.id!, status: 'REJECTED' })}
                          className="flex-1 py-5 bg-white border border-brand-border text-brand-muted hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                        >
                          <XCircle className="w-5 h-5" /> Reject
                        </button>
                      </div>
                    )}
                    
                    <button 
                        onClick={() => navigate(`/worker/${app.workerId}`)}
                        className="w-full py-4 bg-white border border-brand-border text-brand-secondary hover:text-brand-primary rounded-2xl font-semibold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all mt-2 group/dossier"
                    >
                        View Profile <ChevronRight className="w-4 h-4 group-hover/dossier:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {(!applications || applications.length === 0) && (
                <div className="text-center py-32 bg-brand-surface rounded-4xl border border-dashed border-brand-border/50">
                    <div className="w-24 h-24 bg-brand-secondary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                        <FileText className="w-10 h-10 text-brand-muted/30" />
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 uppercase tracking-tight mb-2">No Applications</h3>
                    <p className="text-brand-muted font-medium uppercase tracking-widest text-xs">You haven't received any applications for your jobs yet.</p>
                </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
