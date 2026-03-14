import { LayoutDashboard, Search, Award, Briefcase, User as UserIcon } from 'lucide-react';
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
        <aside className="hidden md:flex w-64 border-r border-slate-200 p-6 space-y-10 flex-col bg-white h-screen sticky top-0">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black italic">TP</div>
                <div className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">
                    TrustPro
                </div>
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
                                ? 'bg-primary-50 text-primary-600 font-bold shadow-sm border border-primary-100' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-primary-600'
                            }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <UserButton />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate text-slate-900">{user?.firstName || 'Worker'}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">{t('sidebar.professional')}</p>
                    </div>
                </div>
                <NotificationCenter />
            </div>
        </aside>
    );
};
