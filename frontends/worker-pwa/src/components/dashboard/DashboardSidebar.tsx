import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../core/hooks/useLanguage';

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    
    const handleLogout = () => {
        dispatch(logout());
        navigate('/sign-in');
        onClose?.();
    };

    const menuItems = [
        { name: t('sidebar.dashboard'), icon: 'dashboard', path: '/dashboard' },
        { name: t('sidebar.findJobs'), icon: 'search', path: '/search' },
        { name: 'Applied Jobs', icon: 'work_history', path: '/applied-jobs' },
        { name: t('sidebar.skillTests'), icon: 'psychology', path: '/tests' },
        { name: t('sidebar.profile'), icon: 'person', path: '/profile' },
    ];

    const accountItems = [
        { name: t('sidebar.verifyIdentity'), icon: 'verified_user', path: '/verify-identity' },
        { name: t('sidebar.settings'), icon: 'settings', path: '/settings' },
        { name: t('sidebar.help'), icon: 'help', path: '/help' },
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose?.();
    };

    return (
        <>
            <aside className="hidden lg:flex sticky top-0 left-0 h-screen w-72 shrink-0 z-40 bg-[#1F3F34] shadow-2xl">
                <SidebarContent 
                  menuItems={menuItems} 
                  accountItems={accountItems} 
                  onNavigate={handleNavigate} 
                  onLogout={handleLogout}
                  currentPath={location.pathname}
                />
            </aside>

            <div 
                className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <div 
                    className="absolute inset-0 bg-[#002117]/60 backdrop-blur-sm" 
                    onClick={onClose}
                />
                <aside 
                    className={`absolute top-0 left-0 h-full w-80 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <SidebarContent 
                      menuItems={menuItems} 
                      accountItems={accountItems} 
                      onNavigate={handleNavigate} 
                      onLogout={handleLogout}
                      currentPath={location.pathname}
                    />
                    <button 
                        onClick={onClose}
                        className="absolute top-6 -right-12 p-2 bg-[#FACD15] text-[#1F3F34] rounded-full shadow-lg active:scale-95"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </aside>
            </div>
        </>
    );
};

interface SidebarItem {
  name: string;
  icon: string;
  path: string;
}

interface SidebarContentProps {
  menuItems: SidebarItem[];
  accountItems: SidebarItem[];
  onNavigate: (path: string) => void;
  onLogout: () => void;
  currentPath: string;
}

const SidebarContent = ({ menuItems, accountItems, onNavigate, onLogout, currentPath }: SidebarContentProps) => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    return (
        <div className="flex flex-col h-full w-full bg-[#1F3F34] p-6 text-[#F5F4EF]/70 overflow-y-auto no-scrollbar">
            <div className="mb-10 px-4 group cursor-pointer" onClick={() => navigate('/')}>
                <h1 className="text-xl font-black text-[#FACD15] tracking-tighter transition-all group-hover:scale-105 bricolage">TrustHire</h1>
                <p className="text-[10px] font-black text-[#F5F4EF]/40 uppercase tracking-widest mt-1">Operative Portal</p>
            </div>

            <div className="mb-8 px-4 flex items-center gap-3 p-4 bg-white/5 rounded-[2rem] border border-white/5">
                <div className="relative shrink-0">
                    <img 
                        src={user?.profile_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-2xl border border-[#FACD15]/30 object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#1F3F34] rounded-full"></div>
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-black text-[#F5F4EF] truncate tracking-tight bricolage">
                        {user?.first_name || user?.fullName?.split(' ')[0]} {user?.last_name || user?.fullName?.split(' ')[1] || ''}
                    </p>
                    <p className="text-[9px] font-bold text-[#FACD15] uppercase tracking-widest mt-0.5">{user?.level || 'L1'} Professional</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                        <button
                            key={item.name}
                            onClick={() => onNavigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black transition-all duration-300 group ${
                                isActive 
                                ? 'bg-[#FACD15] text-[#1F3F34] shadow-lg translate-x-1' 
                                : 'text-[#F5F4EF]/70 hover:bg-white/10 hover:text-[#FACD15]'
                            }`}
                        >
                            <span className={`material-symbols-outlined transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-1 pt-6 border-t border-white/10">
                {accountItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => onNavigate(item.path)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-[#F5F4EF]/50 hover:text-[#FACD15] transition-all duration-200 text-[10px] font-black uppercase tracking-widest group"
                    >
                        <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">{item.icon}</span>
                        <span className="tracking-widest">{item.name}</span>
                    </button>
                ))}
                
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-rose-500/50 hover:text-rose-500 transition-all duration-200 text-[10px] font-black uppercase tracking-widest group mt-2"
                >
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">logout</span>
                    <span className="tracking-widest">Logout</span>
                </button>
            </div>
            <style>{`
                .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};
