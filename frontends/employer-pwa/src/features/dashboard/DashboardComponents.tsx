import { Users, Briefcase, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useUser, UserButton } from "@clerk/clerk-react";

export const DashboardSidebar = () => {
    const { user } = useUser();
    return (
        <aside className="w-64 border-r border-white/5 p-6 space-y-10 flex flex-col bg-slate-950">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                TrustHire
            </div>
            
            <nav className="flex-1 space-y-2">
                {[
                    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, active: true },
                    { name: 'Search Workers', icon: <Users className="w-5 h-5" /> },
                    { name: 'Post a Job', icon: <PlusCircle className="w-5 h-5" /> },
                    { name: 'My Active Jobs', icon: <Briefcase className="w-5 h-5" /> },
                ].map((item) => (
                    <button 
                        key={item.name}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${item.active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </button>
                ))}
            </nav>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <UserButton afterSignOutUrl="/" />
                <div className="flex-1 ml-3 overflow-hidden">
                    <p className="text-sm font-medium truncate">{user?.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">Employer</p>
                </div>
            </div>
        </aside>
    );
};

export const StatsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
            { label: 'Active Jobs', value: '4', trend: '+1 this week' },
            { label: 'Applicants', value: '28', trend: '12 new' },
            { label: 'Verification Pending', value: '3', trend: 'Action required' },
        ].map((stat) => (
            <div key={stat.label} className="p-6 rounded-3xl bg-white/3 border border-white/6 space-y-2 shadow-2xl shadow-black/20 text-white">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-4xl font-bold">{stat.value}</p>
                <p className="text-blue-400 text-sm font-medium">{stat.trend}</p>
            </div>
        ))}
    </div>
);

export const RecentApplicants = () => (
    <section className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Recent Applicants</h3>
        <div className="space-y-4">
            {[1, 2, 3].map((id) => (
                <div key={id} className="flex items-center justify-between p-5 rounded-2xl bg-white/2 border border-white/4 hover:bg-white/4 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 animate-pulse" />
                        <div>
                            <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">Applicant #{id}</p>
                            <p className="text-sm text-slate-500 italic text-pretty truncate">Experience in Cooking & Cleaning</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 text-xs font-bold border border-blue-600/20">L3 Worker</span>
                        <button className="text-sm font-medium text-slate-400 hover:text-white cursor-pointer">View Profile</button>
                    </div>
                </div>
            ))}
        </div>
    </section>
);
