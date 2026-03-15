import { Users, Briefcase, LayoutDashboard, PlusCircle, Clock, Building2, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import { useUser } from "../../providers/AuthContext";
import { UserButton } from "../../components/UserButton";
import { useQuery } from '@tanstack/react-query';
import { jobService } from '../../api/job.service';
import { applicationService } from '../../api/application.service';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationCenter } from '../notifications/NotificationCenter';

export const DashboardSidebar = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { name: 'Search Workers', icon: <Users className="w-5 h-5" />, path: '/find-workers' },
        { name: 'Post a Job', icon: <PlusCircle className="w-5 h-5" />, path: '/post-job' },
        { name: 'My Active Jobs', icon: <Briefcase className="w-5 h-5" />, path: '/jobs' },
    ];

    return (
        <aside className="w-64 border-r border-brand-border p-6 space-y-10 flex flex-col bg-white">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center p-2 shadow-sm">
                    <Building2 className="w-full h-full text-brand-primary" />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-neutral-900 uppercase leading-tight">TrustHire</span>
                        <div className="bg-emerald-500/10 text-emerald-600 p-0.5 rounded-full border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" />
                        </div>
                    </div>
                    <span className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mt-0.5">Enterprise Hub</span>
                </div>
            </div>
            
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button 
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all cursor-pointer group active:scale-[0.98] ${
                                isActive 
                                ? 'bg-brand-secondary text-brand-primary font-black shadow-xl shadow-brand-secondary/10' 
                                : 'text-brand-muted hover:bg-brand-primary/5 hover:text-brand-secondary'
                            }`}
                        >
                            <div className={`${isActive ? 'text-brand-primary' : 'text-brand-muted group-hover:text-brand-secondary'} transition-colors`}>
                                {item.icon}
                            </div>
                            <span className={`text-sm tracking-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-brand-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <UserButton />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-neutral-900 truncate leading-tight">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest">Administrator</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
                { label: 'Active Jobs', value: jobs?.filter(j => j.status === 'OPEN').length || 0, trend: 'Jobs currently live', icon: <Briefcase className="w-5 h-5" /> },
                { label: 'Total Postings', value: jobs?.length || 0, trend: 'Lifetime listings', icon: <Users className="w-5 h-5" /> },
                { label: 'Pending Reviews', value: '0', trend: 'Awaiting action', icon: <Clock className="w-5 h-5" /> },
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
    
    const { data: applications, isLoading } = useQuery({
        queryKey: ['recentApplications', jobIds],
        queryFn: () => applicationService.getApplicationsByJobs(jobIds),
        enabled: jobIds.length > 0
    });

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
                ) : applications?.length ? (
                    applications.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-6 rounded-3xl bg-white border border-brand-border hover:border-brand-primary hover:shadow-xl hover:shadow-brand-primary/5 transition-all group shadow-sm active:scale-[0.99] cursor-pointer" onClick={() => navigate('/applications')}>
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-brand-surface border border-brand-border flex items-center justify-center font-semibold text-brand-secondary text-xl overflow-hidden group-hover:bg-brand-primary transition-colors">
                                    {app.status[0]}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-semibold text-brand-secondary tracking-tight">Applicant #{app.workerId.substring(0, 6).toUpperCase()}</p>
                                    <p className="text-sm text-brand-muted font-medium truncate max-w-sm">{app.coverLetter || "View application details."}</p>
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
