import { useQuery } from '@tanstack/react-query';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
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
    Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

export function ActiveJobsPage() {
    const navigate = useNavigate();

    // Fetch Jobs
    const { data: jobs, isLoading: isLoadingJobs } = useQuery({ 
        queryKey: ['employerJobs'], 
        queryFn: jobService.getEmployerJobs 
    });

    // Fetch all applications for these jobs to calculate counts
    const jobIds = useMemo(() => jobs?.map(j => j.id).filter((id): id is string => !!id) || [], [jobs]);
    
    const { data: applications, isLoading: isLoadingApps } = useQuery({
        queryKey: ['employerJobApplications', jobIds],
        queryFn: () => applicationService.getApplicationsByJobs(jobIds),
        enabled: jobIds.length > 0
    });

    // Calculate metadata for each job
    const jobMetadata = useMemo(() => {
        if (!jobs || !applications) return {};
        
        return jobs.reduce((acc, job) => {
            const jobApps = applications.filter(app => app.jobId === job.id);
            const newApps = jobApps.filter(app => app.status === 'PENDING').length;
            
            acc[job.id!] = {
                totalCount: jobApps.length,
                newCount: newApps,
                // Taking some worker IDs for avatar placeholders
                workerIds: jobApps.slice(0, 2).map(app => app.workerId)
            };
            return acc;
        }, {} as Record<string, { totalCount: number; newCount: number; workerIds: string[] }>);
    }, [jobs, applications]);

    const isLoading = isLoadingJobs || (jobIds.length > 0 && isLoadingApps);

    const getSectorIcon = (industry: string) => {
        const ind = industry.toLowerCase();
        if (ind.includes('culinary') || ind.includes('hospitality') || ind.includes('cook')) return <Utensils className="w-4 h-4" />;
        if (ind.includes('construct') || ind.includes('infra')) return <Layers className="w-4 h-4" />;
        if (ind.includes('safety') || ind.includes('security')) return <Shield className="w-4 h-4" />;
        if (ind.includes('solar') || ind.includes('renew')) return <Sun className="w-4 h-4" />;
        if (ind.includes('logistic') || ind.includes('ware')) return <Package className="w-4 h-4" />;
        return <Tag className="w-4 h-4" />;
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 text-[#1F3F34] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F3F34]/40">Gathering Intelligence...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F4EF] text-[#1F3F34] font-body selection:bg-[#FACD15] selection:text-[#1F3F34]">
            {/* Main Content Canvas */}
            <main className="max-w-7xl mx-auto py-10 px-8">
                {/* Page Header Section */}
                <section className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold bricolage text-[#1F3F34] tracking-tight uppercase">My Active Jobs</h1>
                        <p className="text-[#1F3F34]/60 font-medium mt-2">
                            You currently have {jobs?.length || 0} active postings across {new Set(jobs?.map(j => j.industry)).size} sectors.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/post-job')}
                        className="bg-[#FACD15] text-[#1F3F34] px-8 py-4 rounded-xl font-extrabold flex items-center gap-3 shadow-[0_4px_0_0_#C39F00] hover:shadow-none hover:translate-y-[2px] transition-all bricolage uppercase text-sm tracking-widest"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Post a New Job
                    </button>
                </section>

                {/* High-Density Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {jobs?.map((job, idx) => {
                            const meta = jobMetadata[job.id!] || { totalCount: 0, newCount: 0, workerIds: [] };
                            const isUrgent = job.description.toLowerCase().includes('urgent') || idx === 1; // Demo urgency logic

                            return (
                                <motion.div 
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white p-8 rounded-lg group hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden border border-[#F5F4EF]"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACD15]/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-[#FACD15]/10 transition-colors"></div>
                                    
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <span className={`px-4 py-1.5 text-[10px] font-black rounded-full tracking-widest bricolage uppercase ${
                                            isUrgent ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#c7ebdb] text-[#4a6b5e]'
                                        }`}>
                                            {isUrgent ? 'URGENT' : 'ACTIVE'}
                                        </span>
                                        <span className="text-[10px] font-mono text-[#1F3F34]/30 font-bold uppercase tracking-widest">
                                            #{job.id?.slice(-4).toUpperCase() || 'TEMP'}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-black text-[#1F3F34] bricolage leading-tight mb-4 group-hover:text-[#C39F00] transition-colors uppercase tracking-tight">
                                        {job.title}
                                    </h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3 text-[#1F3F34]/60 text-sm font-medium">
                                            <div className="w-8 h-8 rounded-lg bg-[#F5F4EF] flex items-center justify-center text-[#1F3F34]">
                                                {getSectorIcon(job.industry)}
                                            </div>
                                            <span>{job.industry}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[#1F3F34]/60 text-sm font-medium">
                                            <div className="w-8 h-8 rounded-lg bg-[#F5F4EF] flex items-center justify-center text-[#1F3F34]">
                                                <IndianRupee className="w-4 h-4" />
                                            </div>
                                            <span className="font-black text-[#1F3F34]">₹{job.budget?.toLocaleString()} / month</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[#1F3F34]/60 text-sm font-medium">
                                            <div className="w-8 h-8 rounded-lg bg-[#F5F4EF] flex items-center justify-center text-[#1F3F34]">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <span>{job.location}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between border-t border-[#F5F4EF] pt-6 gap-4">
                                        <div className="flex -space-x-3">
                                            {meta.workerIds.length > 0 ? (
                                                meta.workerIds.map((wid) => (
                                                    <div key={wid} className="w-10 h-10 rounded-full border-4 border-white bg-[#F5F4EF] flex items-center justify-center text-[10px] font-black overflow-hidden shadow-sm">
                                                        <img 
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${wid}`} 
                                                            alt="worker" 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="w-10 h-10 rounded-full border-4 border-white bg-[#F5F4EF] flex items-center justify-center text-[10px] font-black text-[#1F3F34]/20">
                                                    0
                                                </div>
                                            )}
                                            {meta.totalCount > 2 && (
                                                <div className="w-10 h-10 rounded-full border-4 border-white bg-[#F5F4EF] flex items-center justify-center text-[10px] font-black text-[#1F3F34] shadow-sm">
                                                    +{meta.totalCount - 2}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] uppercase font-black tracking-widest text-[#1F3F34]/30 mb-0.5">Applications</span>
                                            <span className="text-sm font-black text-[#1F3F34]">
                                                {meta.newCount > 0 ? `${meta.newCount} New` : `${meta.totalCount} Total`}
                                            </span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => navigate('/applications')}
                                        className="mt-6 w-full bg-[#FACD15] text-[#1F3F34] py-4 rounded-xl font-extrabold flex items-center justify-center gap-3 hover:bg-[#1F3F34] hover:text-white transition-all group/btn bricolage uppercase text-xs tracking-widest shadow-lg shadow-[#FACD15]/10"
                                    >
                                        VIEW APPLICATIONS
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            );
                        })}

                        {/* Create New Opening / Empty State Card */}
                        <motion.button 
                            onClick={() => navigate('/post-job')}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            className="border-4 border-dashed border-[#1F3F34]/10 hover:border-[#FACD15] hover:bg-white transition-all duration-300 rounded-lg p-12 flex flex-col items-center justify-center text-center group bg-transparent min-h-[400px]"
                        >
                            <div className="h-20 w-20 bg-[#FACD15]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#FACD15] transition-all duration-500">
                                <Plus className="w-10 h-10 text-[#FACD15] group-hover:text-[#1F3F34]" />
                            </div>
                            <h3 className="text-xl font-black bricolage text-[#1F3F34] mb-2 uppercase tracking-tight">Create New Opening</h3>
                            <p className="text-sm text-[#1F3F34]/40 px-8 font-medium">Find the best local talent by posting a new requirement today.</p>
                        </motion.button>
                    </AnimatePresence>
                </div>

                {/* Pagination/Footer Stats */}
                <footer className="mt-20 flex flex-col lg:flex-row justify-between items-center bg-[#1F3F34] text-[#F5F4EF] p-8 lg:p-12 rounded-lg gap-8 relative overflow-hidden shadow-2xl">
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
                        <button className="w-12 h-12 rounded-full border border-white/10 hover:bg-[#FACD15] hover:text-[#1F3F34] transition-all flex items-center justify-center group">
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div className="px-4 text-xs font-black uppercase tracking-widest bricolage">
                            Page <span className="text-[#FACD15]">01</span> / 03
                        </div>
                        <button className="w-12 h-12 rounded-full border border-white/10 hover:bg-[#FACD15] hover:text-[#1F3F34] transition-all flex items-center justify-center group">
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </footer>
            </main>

            {/* Background Decorative Organic Blobs */}
            <div className="fixed top-1/4 -right-40 w-[600px] h-[600px] bg-[#FACD15] opacity-[0.03] rounded-full blur-[120px] -z-10 pointer-events-none organic-blob"></div>
            <div className="fixed -bottom-40 -left-20 w-[800px] h-[800px] bg-[#1F3F34] opacity-[0.02] rounded-full blur-[150px] -z-10 pointer-events-none organic-blob-alt"></div>
        </div>
    );
}
