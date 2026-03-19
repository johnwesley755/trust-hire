import { Users, Briefcase, ChevronRight, Loader2, User, Mail, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '../../api/job.service';
import { applicationService } from '../../api/application.service';
import { workerService } from '../../api/worker.service';
import { useNavigate } from 'react-router-dom';


export const StatsGrid = () => {
    const { data: jobs } = useQuery({ queryKey: ['employerJobs'], queryFn: jobService.getEmployerJobs });
    const jobIds = jobs?.map(j => j.id).filter((id): id is string => !!id) || [];
    const { data: applications = [], isError: applicationsIsError } = useQuery({
        queryKey: ['employerJobApplications', jobIds],
        queryFn: () => applicationService.getApplicationsForEmployerJobs(jobIds),
        enabled: jobIds.length > 0,
        staleTime: 0,
        refetchOnMount: 'always'
    });
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
                { label: 'Active Jobs', value: jobs?.filter(j => j.status === 'OPEN').length || 0, trend: 'Jobs currently live', icon: <Briefcase className="w-5 h-5" /> },
                { label: 'Total Postings', value: jobs?.length || 0, trend: 'Lifetime listings', icon: <Users className="w-5 h-5" /> },
                { label: 'Pending Reviews', value: applicationsIsError ? 0 : applications.filter(app => app.status === 'PENDING').length, trend: 'Awaiting action', icon: <Clock className="w-5 h-5" /> },
            ].map((stat) => (
                <div key={stat.label} className="p-8 rounded-[2.5rem] bg-white border border-brand-border shadow-sm flex flex-col justify-between hover:border-brand-primary hover:shadow-2xl hover:shadow-brand-primary/5 transition-all group active:scale-[0.98]">
                    <div className="flex justify-between items-start mb-6">
                        <p className="text-brand-muted text-[10px] font-medium uppercase tracking-[0.2em]">{stat.label}</p>
                        <div className="w-10 h-10 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-muted group-hover:bg-brand-primary group-hover:text-brand-secondary transition-colors">
                            {stat.icon}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-5xl font-semibold text-brand-secondary tracking-tight">{stat.value}</p>
                        <p className="text-brand-primary text-xs font-medium uppercase tracking-widest">{stat.trend}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const RecentApplicants = () => {
    const navigate = useNavigate();
    const { data: jobs } = useQuery({ queryKey: ['employerJobs'], queryFn: jobService.getEmployerJobs });
    const jobIds = jobs?.map(j => j.id).filter((id): id is string => !!id) || [];
    
    const { data: applications, isLoading, isError, error } = useQuery({
        queryKey: ['recentApplications', jobIds],
        queryFn: () => applicationService.getApplicationsForEmployerJobs(jobIds),
        enabled: jobIds.length > 0,
        staleTime: 0,
        refetchOnMount: 'always'
    });

    const workerIds = applications?.map((application) => application.workerId) || [];
    const { data: workers = [] } = useQuery({
        queryKey: ['applicationWorkers', workerIds],
        queryFn: () => workerService.getProfilesByUserIds(workerIds),
        enabled: workerIds.length > 0
    });

    const workersById = new Map(workers.map((worker) => [worker.userId, worker]));
    const jobsById = new Map((jobs || []).filter((job) => job.id).map((job) => [job.id!, job]));

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-brand-secondary tracking-tight flex items-center gap-3">
                    <div className="w-2 h-8 bg-brand-primary rounded-full" />
                    Recent Applications
                </h3>
            </div>
            
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-20"><Loader2 className="w-12 h-12 text-brand-primary animate-spin mx-auto" /></div>
                ) : isError ? (
                    <div className="text-center py-20 bg-white rounded-4xl border border-brand-border shadow-sm">
                        <h4 className="text-xl font-semibold text-brand-secondary tracking-tight mb-2">Couldn’t load applications</h4>
                        <p className="text-brand-muted font-medium text-sm max-w-xl mx-auto">
                            {String((error as any)?.response?.data?.message || (error as any)?.message || 'Request failed')}
                        </p>
                    </div>
                ) : applications?.length ? (
                    applications.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-6 rounded-3xl bg-white border border-brand-border hover:border-brand-primary hover:shadow-xl hover:shadow-brand-primary/5 transition-all group shadow-sm active:scale-[0.99] cursor-pointer" onClick={() => navigate('/applications')}>
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-brand-surface border border-brand-border overflow-hidden shrink-0">
                                    {workersById.get(app.workerId)?.profileImageUrl ? (
                                        <img
                                            src={workersById.get(app.workerId)?.profileImageUrl}
                                            alt={workersById.get(app.workerId)?.fullName || 'Applicant'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-brand-secondary group-hover:bg-brand-primary transition-colors">
                                            <User className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-semibold text-brand-secondary tracking-tight">
                                        {workersById.get(app.workerId)?.fullName || `Applicant #${app.workerId.substring(0, 6).toUpperCase()}`}
                                    </p>
                                    <p className="text-[10px] text-brand-primary/70 font-semibold uppercase tracking-widest">
                                        {jobsById.get(app.jobId)?.title || 'Job application'}
                                    </p>
                                    <p className="text-sm text-brand-muted font-medium truncate max-w-sm">
                                        {workersById.get(app.workerId)?.city || workersById.get(app.workerId)?.address || app.coverLetter || "View application details."}
                                    </p>
                                    {workersById.get(app.workerId)?.email && (
                                        <p className="text-[10px] text-brand-muted font-semibold uppercase tracking-widest flex items-center gap-2">
                                            <Mail className="w-3 h-3 text-brand-primary" />
                                            {workersById.get(app.workerId)?.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-6 items-center">
                                <div className="hidden md:block text-right">
                                    <p className="text-[10px] font-medium text-brand-muted uppercase tracking-widest mb-1">Status</p>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border transition-colors ${
                                        app.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-brand-primary group-hover:text-brand-secondary group-hover:border-brand-primary' : 
                                        app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                        'bg-brand-surface text-brand-muted border-brand-border'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-brand-secondary flex items-center justify-center text-brand-primary shadow-lg group-hover:scale-110 transition-transform">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-24 bg-white rounded-4xl border-2 border-dashed border-brand-border">
                        <div className="w-20 h-20 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10 text-brand-muted/30" />
                        </div>
                        <h4 className="text-xl font-semibold text-brand-secondary tracking-tight mb-2">No Applications Found</h4>
                        <p className="text-brand-muted font-medium">New worker applications will appear here.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
