import { useQuery } from '@tanstack/react-query';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
import type { Job, JobApplication } from '../../../types';
import { 
    PlusCircle, 
    Plus, 
    Layers, 
    IndianRupee, 
    MapPin, 
    ArrowRight, 
    ChevronLeft, 
    ChevronRight,
    Loader2,
    Utensils,
    Shield,
    Sun,
    Package,
    Tag,
    CalendarClock
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

export function ActiveJobsPage() {
    const navigate = useNavigate();

    // Fetch Jobs
    const { data: jobs = [], isLoading: isLoadingJobs } = useQuery<Job[]>({ 
        queryKey: ['employerJobs'], 
        queryFn: jobService.getEmployerJobs 
    });

    // Fetch all applications for these jobs to calculate counts
    const jobIds = useMemo(() => jobs.map((j: Job) => j.id).filter((id): id is string => !!id), [jobs]);
    
    const { data: applications = [], isLoading: isLoadingApps } = useQuery<JobApplication[]>({
        queryKey: ['employerJobApplications', jobIds],
        queryFn: () => applicationService.getApplicationsByJobs(jobIds),
        enabled: jobIds.length > 0
    });

    // Calculate metadata for each job
    const jobMetadata = useMemo(() => {
        if (!jobs || !applications) return {};
        
        return jobs.reduce((acc: Record<string, { totalCount: number; newCount: number; workerIds: string[] }>, job: Job) => {
            const jobApps = applications.filter((app: JobApplication) => app.jobId === job.id);
            const newApps = jobApps.filter((app: JobApplication) => app.status === 'PENDING' || app.status === 'APPLIED').length;
            
            acc[job.id!] = {
                totalCount: jobApps.length,
                newCount: newApps,
                workerIds: jobApps.slice(0, 2).map((app: JobApplication) => app.workerId)
            };
            return acc;
        }, {});
    }, [jobs, applications]);

    const isLoading = isLoadingJobs || (jobIds.length > 0 && isLoadingApps);

    const getSectorIcon = (industry?: string) => {
        if (!industry) return <Tag className="w-4 h-4" />;
        const ind = industry.toLowerCase();
        if (ind.includes('culinary') || ind.includes('hospitality') || ind.includes('cook')) return <Utensils className="w-4 h-4" />;
        if (ind.includes('construct') || ind.includes('infra')) return <Layers className="w-4 h-4" />;
        if (ind.includes('safety') || ind.includes('security')) return <Shield className="w-4 h-4" />;
        if (ind.includes('solar') || ind.includes('renew')) return <Sun className="w-4 h-4" />;
        if (ind.includes('logistic') || ind.includes('ware')) return <Package className="w-4 h-4" />;
        return <Tag className="w-4 h-4" />;
    };

    const getExpiryBadge = (expiresAt?: string) => {
        if (!expiresAt) return null;
        const expiry = new Date(expiresAt);
        const now = new Date();
        const diffMs = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffdad6] text-[#ba1a1a] text-[9px] font-black uppercase tracking-widest rounded-xl">
                    <CalendarClock className="w-3 h-3" /> Expired
                </span>
            );
        }
        if (diffDays === 0) {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 text-[9px] font-black uppercase tracking-widest rounded-xl">
                    <CalendarClock className="w-3 h-3" /> Expires today
                </span>
            );
        }
        const color = diffDays <= 3 ? 'bg-orange-100 text-orange-700' : 'bg-[#d1fae5] text-[#4a6b5e]';
        return (
            <span className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl ${color}`}>
                <CalendarClock className="w-3 h-3" /> {diffDays}d left
            </span>
        );
    };



    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 text-[#0A1931] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0A1931]/40">Gathering Intelligence...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0A1931] font-body selection:bg-[#FACD15] selection:text-[#0A1931]">
            {/* Main Content Canvas */}
            <main className="max-w-7xl mx-auto py-10 px-8">
                {/* Page Header Section */}
                <section className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold bricolage text-[#0A1931] tracking-tight uppercase">My Active Jobs</h1>
                        <p className="text-[#0A1931]/60 font-medium mt-2">
                            You currently have {jobs.length} active postings across {new Set(jobs.map((j: Job) => j.industry)).size} sectors.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/post-job')}
                        className="bg-[#FACD15] text-[#0A1931] px-8 py-4 rounded-xl font-extrabold flex items-center gap-3 shadow-[0_4px_0_0_#C39F00] hover:shadow-none hover:translate-y-[2px] transition-all bricolage uppercase text-sm tracking-widest"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Post a New Job
                    </button>
                </section>

                {jobs.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto mt-8">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-[#0A1931] mb-3 uppercase tracking-tight bricolage">No Active Jobs</h3>
                        <p className="text-slate-500 font-medium mb-8">You currently don't have any active job postings. Once you post a new shift, it will appear here for you to manage applications and track performance.</p>
                        <button 
                            onClick={() => navigate('/post-job')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FACD15] text-[#0A1931] font-extrabold rounded-xl shadow-[0_4px_0_0_#C39F00] hover:shadow-none hover:translate-y-[2px] transition-all bricolage uppercase text-sm tracking-widest"
                        >
                            <PlusCircle className="w-5 h-5" /> Post Your First Job
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <AnimatePresence>
                            {jobs.map((job: Job, idx: number) => {
                                const meta = jobMetadata[job.id!] || { totalCount: 0, newCount: 0, workerIds: [] };
                                const isUrgent = job.description.toLowerCase().includes('urgent') || idx === 1;

                                return (
                                    <motion.div 
                                        key={job.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white p-6 rounded-2xl group hover:shadow-lg hover:border-[#FACD15] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between border border-slate-200 relative overflow-hidden"
                                    >
                                        {/* Left Side: Job Info */}
                                        <div className="flex-1 min-w-0 pr-8">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-black text-[#0A1931] bricolage uppercase tracking-tight truncate group-hover:text-[#C39F00] transition-colors">
                                                    {job.title}
                                                </h3>
                                                <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full tracking-widest bricolage uppercase shrink-0 ${
                                                    isUrgent ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#d1fae5] text-[#4a6b5e]'
                                                }`}>
                                                    {isUrgent ? 'URGENT' : 'ACTIVE'}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#0A1931]/60 text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    {getSectorIcon(job.industry)}
                                                    <span className="truncate max-w-[120px]">{job.industry}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <IndianRupee className="w-4 h-4 text-slate-400" />
                                                    <span className="font-bold text-[#0A1931]">₹{job.budget?.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    <span className="truncate max-w-[150px]">{job.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getExpiryBadge(job.expiresAt)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Stats & Action */}
                                        <div className="flex items-center gap-8 mt-6 md:mt-0 shrink-0 md:border-l md:border-slate-100 md:pl-8">
                                            <div className="text-center md:text-right">
                                                <span className="block text-[10px] uppercase font-black tracking-widest text-[#0A1931]/40 mb-1">
                                                    Applications
                                                </span>
                                                <div className="flex items-center gap-3 justify-center md:justify-end">
                                                    <div className="flex -space-x-2">
                                                        {meta.workerIds.length > 0 ? (
                                                            meta.workerIds.map((wid: string) => (
                                                                <div key={wid} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shrink-0">
                                                                    <img 
                                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${wid}`} 
                                                                        alt="worker" 
                                                                        className="w-full h-full object-cover" 
                                                                    />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                                0
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-lg font-black text-[#0A1931]">
                                                        {meta.totalCount} <span className="text-sm font-bold text-slate-400">Total</span>
                                                    </span>
                                                    {meta.newCount > 0 && (
                                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-full">
                                                            {meta.newCount} New
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => navigate('/applications')}
                                                className="hidden md:flex items-center justify-center w-12 h-12 bg-slate-50 text-[#0A1931] hover:bg-[#FACD15] rounded-xl transition-colors group/btn"
                                            >
                                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* Pagination/Footer Stats */}
                <footer className="mt-20 flex flex-col lg:flex-row justify-between items-center bg-[#0A1931] text-[#F8FAFC] p-8 lg:p-12 rounded-lg gap-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#FACD15] opacity-5 rounded-full blur-3xl"></div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-12 relative z-10 w-full lg:w-auto">
                        <div className="text-center sm:text-left">
                            <span className="block text-[10px] uppercase tracking-[0.2em] text-[#FACD15] font-black bricolage mb-2">Total Outreach</span>
                            <span className="text-4xl font-black bricolage tracking-tight font-sans">
                                {((jobs?.length || 0) * 112).toLocaleString()} <span className="text-xs opacity-30 font-bold uppercase tracking-widest ml-1">Views</span>
                            </span>
                        </div>
                        <div className="hidden sm:block h-12 w-[2px] bg-white/10"></div>
                        <div className="text-center sm:text-left">
                            <span className="block text-[10px] uppercase tracking-[0.2em] text-[#FACD15] font-black bricolage mb-2">Engagements</span>
                            <span className="text-4xl font-black bricolage tracking-tight font-sans">
                                {applications?.length || 0} <span className="text-xs opacity-30 font-bold uppercase tracking-widest ml-1">Applies</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 relative z-10 bg-white/5 p-2 rounded-full border border-white/10">
                        <button className="w-12 h-12 rounded-full border border-white/10 hover:bg-[#FACD15] hover:text-[#0A1931] transition-all flex items-center justify-center group">
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div className="px-4 text-xs font-black uppercase tracking-widest bricolage">
                            Page <span className="text-[#FACD15]">01</span> / 03
                        </div>
                        <button className="w-12 h-12 rounded-full border border-white/10 hover:bg-[#FACD15] hover:text-[#0A1931] transition-all flex items-center justify-center group">
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </footer>
            </main>

            {/* Background Decorative Organic Blobs */}
            <div className="fixed top-1/4 -right-40 w-[600px] h-[600px] bg-[#FACD15] opacity-[0.03] rounded-full blur-[120px] -z-10 pointer-events-none organic-blob"></div>
            <div className="fixed -bottom-40 -left-20 w-[800px] h-[800px] bg-[#0A1931] opacity-[0.02] rounded-full blur-[150px] -z-10 pointer-events-none organic-blob-alt"></div>
        </div>
    );
}
