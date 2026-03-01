import { Users, Briefcase, LayoutDashboard, PlusCircle, Clock } from 'lucide-react';
import { useUser, UserButton } from "@clerk/clerk-react";
import { useQuery } from '@tanstack/react-query';
import { jobService } from '../../api/job.service';
import { applicationService } from '../../api/application.service';
import { NotificationCenter } from '../notifications/NotificationCenter';

import { useNavigate } from 'react-router-dom';

export const DashboardSidebar = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { name: 'Search Workers', icon: <Users className="w-5 h-5" />, path: '/find-workers' },
        { name: 'Post a Job', icon: <PlusCircle className="w-5 h-5" />, path: '/post-job' },
        { name: 'My Active Jobs', icon: <Briefcase className="w-5 h-5" />, path: '/jobs' },
    ];

    return (
        <aside className="w-64 border-r border-white/5 p-6 space-y-10 flex flex-col bg-slate-950">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                TrustHire
            </div>
            
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <button 
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-slate-400 hover:bg-white/5 hover:text-white`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </button>
                ))}
            </nav>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <UserButton afterSignOutUrl="/" />
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">Employer</p>
                    </div>
                </div>
                <NotificationCenter />
            </div>
        </aside>
    );
};

export const StatsGrid = () => {
    const { data: jobs } = useQuery({ queryKey: ['employerJobs'], queryFn: jobService.getEmployerJobs });
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
                { label: 'Active Jobs', value: jobs?.filter(j => j.status === 'OPEN').length || 0, trend: 'Currently listed' },
                { label: 'Total Postings', value: jobs?.length || 0, trend: 'Lifetime jobs' },
                { label: 'Pending Reviews', value: '0', trend: 'Applicants to view' },
            ].map((stat) => (
                <div key={stat.label} className="p-6 rounded-3xl bg-white/3 border border-white/6 space-y-2 shadow-2xl shadow-black/20 text-white leading-tight">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                    <p className="text-4xl font-black">{stat.value}</p>
                    <p className="text-blue-400 text-sm font-medium">{stat.trend}</p>
                </div>
            ))}
        </div>
    );
};

export const RecentApplicants = () => {
    const { data: jobs } = useQuery({ queryKey: ['employerJobs'], queryFn: jobService.getEmployerJobs });
    const jobIds = jobs?.map(j => j.id).filter((id): id is string => !!id) || [];
    
    const { data: applications, isLoading } = useQuery({
        queryKey: ['recentApplications', jobIds],
        queryFn: () => applicationService.getApplicationsByJobs(jobIds),
        enabled: jobIds.length > 0
    });

    return (
        <section className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Recent Applicants
            </h3>
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div></div>
                ) : applications?.length ? (
                    applications.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/2 border border-white/4 hover:bg-white/4 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-blue-400 border border-white/5">
                                    {app.status[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">Applicant ID: {app.workerClerkId.substring(0, 8)}</p>
                                    <p className="text-sm text-slate-500 italic truncate max-w-xs">{app.coverLetter || "No cover letter provided."}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                    app.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {app.status}
                                </span>
                                <button className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer uppercase tracking-tighter">Review</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-white/2 rounded-3xl border border-dashed border-white/5">
                        <p className="text-slate-500 italic">No new applications to display.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
