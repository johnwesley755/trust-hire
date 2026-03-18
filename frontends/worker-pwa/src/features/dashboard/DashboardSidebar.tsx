import { LayoutDashboard, Search, Award, Briefcase, User as UserIcon, ShieldCheck, BriefcaseIcon } from 'lucide-react';
import { useUser } from "../../providers/AuthContext";
import { UserButton } from "../../components/UserButton";
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { useLanguage } from '../../hooks/useLanguage';

export const DashboardSidebar = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    
    const menuItems = [
        { name: t('sidebar.dashboard'), icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { name: t('sidebar.findJobs'), icon: <Search className="w-5 h-5" />, path: '/search' },
        { name: t('sidebar.skillTests'), icon: <Award className="w-5 h-5" />, path: '/tests' },
        { name: t('sidebar.history'), icon: <Briefcase className="w-5 h-5" />, path: '/history' },
        { name: t('sidebar.profile'), icon: <UserIcon className="w-5 h-5" />, path: '/profile' },
    ];

    return (
        <aside className="hidden md:flex w-72 bg-brand-secondary border-r border-white/5 p-8 space-y-12 flex-col h-screen sticky top-0 z-40 text-white/70">
            <div className="flex items-center gap-4 px-2">
                <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer" onClick={() => navigate('/')}>
                    <BriefcaseIcon className="w-7 h-7 text-brand-secondary" />
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-semibold tracking-tight text-white leading-none">TrustPro</span>
                    <span className="text-[9px] font-medium text-brand-primary tracking-widest mt-1.5">Verified network</span>
                </div>
            </div>
            
            <nav className="flex-1 space-y-3">
                <div className="px-3 mb-6">
                    <p className="text-[10px] font-semibold tracking-widest text-white/20">Main repository</p>
                </div>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button 
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all cursor-pointer group ${
                                isActive 
                                ? 'bg-white/10 text-brand-primary shadow-xl' 
                                : 'hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <div className={`transition-colors ${isActive ? 'text-brand-primary' : 'group-hover:text-brand-primary'}`}>
                                {item.icon}
                            </div>
                            <span className={`text-sm tracking-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                {item.name}
                            </span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="relative">
                        <UserButton />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-brand-secondary shadow-sm">
                            <ShieldCheck className="w-3 h-3" />
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                            <p className="text-[13px] font-semibold truncate text-white">{user?.firstName || 'Professional'}</p>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        </div>
                        <p className="text-[9px] font-semibold tracking-widest text-brand-primary">Verified Hub</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <NotificationCenter />
                </div>
            </div>
        </aside>
    );
};
