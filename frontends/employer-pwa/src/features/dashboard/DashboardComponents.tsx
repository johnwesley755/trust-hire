import { Users, Briefcase, LayoutDashboard, PlusCircle, Clock } from 'lucide-react';
import { useUser } from "../../providers/AuthContext";
import { UserButton } from "../../components/UserButton";
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
        <aside className="w-64 border-r border-slate-200 p-6 space-y-10 flex flex-col bg-white">
            <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                TrustHire
            </div>
            
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button 
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                                isActive 
                                ? 'bg-indigo-50 text-indigo-600 font-bold shadow-sm border border-indigo-100' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                            }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <UserButton />
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
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
                <div key={stat.label} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm text-slate-900 leading-tight hover:border-indigo-400 transition-all group">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                    <p className="text-4xl font-black group-hover:text-indigo-600 transition-colors">{stat.value}</p>
                    <p className="text-indigo-400 text-sm font-medium">{stat.trend}</p>
                </div>
            ))}
        </div>
    );
};

export const RecentApplicants = () => {
    const navigate = useNavigate();
    const { data: jobs } = useQuery({ queryKey: ['employerJobs'], queryFn: jobService.getEmployerJobs });
    const jobIds = jobs?.map(j => j.id).filter((id): id is string => !!id) || [];
    
    const { data: applications, isLoading } = useQuery({
        queryKey: ['recentApplications', jobIds],
        queryFn: () => applicationService.getApplicationsByJobs(jobIds),
        enabled: jobIds.length > 0
    });

    return (
        <section className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Recent Applicants
            </h3>
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div></div>
                ) : applications?.length ? (
                    applications.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 transition-all group shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-indigo-600 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                    {app.status[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Applicant ID: {app.workerClerkId.substring(0, 8)}</p>
                                    <p className="text-sm text-slate-500 italic truncate max-w-xs">{app.coverLetter || "No cover letter provided."}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    app.status === 'PENDING' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                    app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                                }`}>
                                </span>
                                <button onClick={() => navigate('/applications')} className="text-xs font-bold text-slate-400 hover:text-indigo-600 cursor-pointer uppercase tracking-tighter">Review</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 italic">No new applications to display.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
