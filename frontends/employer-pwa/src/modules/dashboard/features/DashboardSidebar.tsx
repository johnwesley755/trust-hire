import { useState } from 'react';
import { Users, Briefcase, LayoutDashboard, PlusCircle, Building2, ShieldCheck, Settings, HelpCircle, LogOut, UserCircle, Menu, X } from 'lucide-react';
import { useUser, useAuth } from "../../../core/providers/AuthContext";
import { UserButton } from '../components/UserButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationCenter } from './notifications/NotificationCenter';

const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Search Workers', icon: <Users className="w-5 h-5" />, path: '/find-workers' },
    { name: 'Post a Job', icon: <PlusCircle className="w-5 h-5" />, path: '/post-job' },
    { name: 'My Active Jobs', icon: <Briefcase className="w-5 h-5" />, path: '/jobs' },
    { name: 'Applications', icon: <Briefcase className="w-5 h-5" />, path: '/applications' }, 
    { name: 'Profile', icon: <UserCircle className="w-5 h-5" />, path: '/profile' }, 
];

const secondaryItems = [
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
    { name: 'Help & Support', icon: <HelpCircle className="w-5 h-5" />, path: '/help' },
];

export const DashboardSidebar = () => {
    const { user } = useUser();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="hidden md:flex w-72 bg-brand-secondary border-r border-white/5 p-8 flex-col h-screen sticky top-0 z-40 text-white/70 overflow-hidden">
            {/* Logo Section */}
            <div className="flex items-center gap-4 px-2 mb-10 shrink-0">
                <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center p-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer" onClick={() => navigate('/')}>
                    <Building2 className="w-full h-full text-brand-secondary" />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight text-white leading-none">TrustHire</span>
                        <div className="bg-emerald-500/10 text-emerald-500 p-0.5 rounded-full border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" />
                        </div>
                    </div>
                    <span className="text-sm font-medium text-[#FACD15]/60 tracking-tight mt-1">Enterprise Hub</span>
                </div>
            </div>
            
            {/* Main Navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto pr-2 no-scrollbar">
                <div className="px-3 mb-4">
                    <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Dashboard</p>
                </div>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button 
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all cursor-pointer group active:scale-[0.98] ${
                                isActive 
                                ? 'bg-white/10 text-brand-primary shadow-lg shadow-black/10' 
                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <div className={`${isActive ? 'text-brand-primary' : 'text-white/40 group-hover:text-white'} transition-colors`}>
                                {item.icon}
                            </div>
                            <span className={`text-sm tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
                        </button>
                    );
                })}

                <div className="mt-8 pt-6 border-t border-white/5 space-y-1">
                    <div className="px-3 mb-4">
                        <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Settings</p>
                    </div>
                    {secondaryItems.map((item) => (
                        <button 
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className="w-full flex items-center gap-4 px-5 py-2.5 rounded-xl transition-all hover:bg-white/5 text-white/40 hover:text-white group"
                        >
                            <div className="text-white/40 group-hover:text-brand-primary/70 transition-colors">
                                {item.icon}
                            </div>
                            <span className="text-xs font-semibold tracking-tight">{item.name}</span>
                        </button>
                    ))}
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all hover:bg-red-500/10 text-red-400 group mt-6 font-bold"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs tracking-widest uppercase">Sign Out</span>
                    </button>
                </div>
            </nav>

            {/* Footer Section */}
            <div className="pt-8 mt-auto border-t border-white/5 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                        <UserButton />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate leading-tight">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[9px] font-bold text-brand-primary uppercase tracking-widest mt-0.5">Admin Hub</p>
                    </div>
                </div>
                <NotificationCenter />
            </div>
        </aside>
    );
};

export const MobileNav = () => {
    const { user } = useUser();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <div className="md:hidden fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-brand-bg/95 backdrop-blur-2xl">
                <div className="flex items-center justify-between px-4 py-4">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center shadow-sm">
                            <Building2 className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div className="text-left">
                            <div className="text-lg font-bold tracking-tight text-brand-secondary leading-none">TrustHire</div>
                            <div className="text-[9px] font-bold tracking-widest text-brand-primary mt-1 uppercase">Employer Hub</div>
                        </div>
                    </button>

                    <div className="flex items-center gap-2">
                        <NotificationCenter />
                        <button
                            onClick={() => setIsMobileMenuOpen((open) => !open)}
                            className="w-11 h-11 rounded-2xl border border-brand-border bg-white flex items-center justify-center text-brand-secondary shadow-sm"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-brand-secondary/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                        className="w-[84%] max-w-xs h-full bg-brand-secondary text-white/70 p-6 flex flex-col shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-10 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-brand-primary rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-brand-secondary" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-white tracking-tight">TrustHire</div>
                                    <div className="text-[9px] font-bold tracking-widest text-brand-primary uppercase">Menu</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
                                aria-label="Close menu"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar no-scrollbar">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavigate(item.path)}
                                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                                            isActive ? 'bg-white/10 text-brand-primary shadow-lg' : 'hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <div className={isActive ? 'text-brand-primary' : 'text-white/40'}>{item.icon}</div>
                                        <span className="text-sm font-bold tracking-tight">{item.name}</span>
                                    </button>
                                );
                            })}
                            
                            <div className="mt-8 pt-6 border-t border-white/10 space-y-1">
                                {secondaryItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavigate(item.path)}
                                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group"
                                    >
                                        <div className="text-white/30 group-hover:text-white">{item.icon}</div>
                                        <span className="text-sm font-semibold tracking-tight text-white/50 group-hover:text-white">{item.name}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 mt-4 transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm font-bold tracking-widest uppercase truncate text-left">Sign Out</span>
                                </button>
                            </div>
                        </nav>

                        <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-3 shrink-0">
                            <div className="relative">
                                <UserButton />
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-brand-secondary shadow-sm">
                                    <ShieldCheck className="w-3 h-3" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-bold text-white truncate">{user?.firstName} {user?.lastName}</div>
                                <div className="text-[9px] font-bold tracking-widest text-brand-primary uppercase">Admin Hub</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
