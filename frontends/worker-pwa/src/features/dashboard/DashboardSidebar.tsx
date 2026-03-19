import { useState } from 'react';
import { LayoutDashboard, Search, Award, Briefcase, User as UserIcon, ShieldCheck, BriefcaseIcon, ClipboardList, Menu, X, Settings, HelpCircle, LogOut, BarChart3, Star } from 'lucide-react';
import { useUser, useAuth } from "../../providers/AuthContext";
import { UserButton } from "../../components/UserButton";
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { useLanguage } from '../../hooks/useLanguage';

export const DashboardSidebar = () => {
    const { user } = useUser();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const menuItems = [
        { name: t('sidebar.dashboard'), icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { name: t('sidebar.findJobs'), icon: <Search className="w-5 h-5" />, path: '/search' },
        { name: 'Applied Jobs', icon: <ClipboardList className="w-5 h-5" />, path: '/applied-jobs' },
        { name: t('sidebar.skillTests'), icon: <Award className="w-5 h-5" />, path: '/tests' },
        { name: t('sidebar.levelDetails'), icon: <BarChart3 className="w-5 h-5" />, path: '/level' },
        { name: t('sidebar.history'), icon: <Briefcase className="w-5 h-5" />, path: '/history' },
        { name: t('sidebar.profile'), icon: <UserIcon className="w-5 h-5" />, path: '/profile' },
    ];

    const secondaryItems = [
        { name: t('sidebar.verifyIdentity'), icon: <ShieldCheck className="w-5 h-5" />, path: '/verify-identity' },
        { name: t('sidebar.settings'), icon: <Settings className="w-5 h-5" />, path: '/settings' },
        { name: t('sidebar.help'), icon: <HelpCircle className="w-5 h-5" />, path: '/help' },
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <div className="md:hidden fixed top-0 inset-x-0 z-50 border-b border-brand-border bg-brand-bg/95 backdrop-blur-2xl">
                <div className="flex items-center justify-between px-4 py-4">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center shadow-sm">
                            <BriefcaseIcon className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div className="text-left">
                            <div className="text-lg font-semibold tracking-tight text-brand-secondary leading-none"></div>
                            <div className="text-[9px] font-semibold tracking-widest text-brand-primary mt-1">Worker Hub</div>
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
                        className="w-[84%] max-w-xs h-full bg-brand-secondary text-white/70 p-6 space-y-8 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-brand-primary rounded-xl flex items-center justify-center">
                                    <BriefcaseIcon className="w-6 h-6 text-brand-secondary" />
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-white">TrustHire</div>
                                    <div className="text-[9px] font-semibold tracking-widest text-brand-primary">Menu</div>
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

                        <nav className="space-y-3 no-scrollbar overflow-y-auto">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavigate(item.path)}
                                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                                            isActive ? 'bg-white/10 text-brand-primary' : 'hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <div className={isActive ? 'text-brand-primary' : 'text-white/70'}>{item.icon}</div>
                                        <span className="text-sm font-medium tracking-tight">{item.name}</span>
                                    </button>
                                );
                            })}
                            <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
                                {secondaryItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavigate(item.path)}
                                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        <div className="text-white/40 group-hover:text-white">{item.icon}</div>
                                        <span className="text-sm font-medium tracking-tight text-white/60">{item.name}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-red-400 transition-all font-bold"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm tracking-tight">{t('sidebar.logout')}</span>
                                </button>
                            </div>
                        </nav>

                        <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                            <div className="relative">
                                <UserButton />
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-brand-secondary shadow-sm">
                                    <ShieldCheck className="w-3 h-3" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{user?.firstName || 'Professional'}</div>
                                <div className="text-[9px] font-semibold tracking-widest text-brand-primary">Verified Hub</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <aside className="hidden md:flex w-72 bg-brand-secondary border-r border-white/5 p-8 flex-col h-screen sticky top-0 z-40 text-white/70 overflow-hidden">
                {/* Logo Section */}
                <div className="flex items-center gap-4 px-2 mb-8 shrink-0">
                    <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer" onClick={() => navigate('/')}>
                        <BriefcaseIcon className="w-6 h-6 text-brand-secondary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white leading-none">TrustHire</span>
                        <span className="text-[8px] font-bold text-brand-primary tracking-widest mt-1 uppercase opacity-60">Professional Hub</span>
                    </div>
                </div>

                {/* Enhanced LinkedIn-style Profile Card */}
                <div className="mx-2 mb-8 group shrink-0">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-primary/10 transition-all duration-300 hover:shadow-md hover:border-brand-primary/20">
                        {/* Cover Image / Header Banner */}
                        <div className="h-16 bg-brand-primary relative">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                            <div className="absolute inset-0 opacity-10 cloud-grid" />
                        </div>

                        {/* Profile Content */}
                        <div className="px-4 pb-4 -mt-8 relative flex flex-col items-center">
                            {/* Avatar with ring */}
                            <div className="relative mb-2">
                                <div className="w-16 h-16 rounded-xl border-4 border-white overflow-hidden bg-brand-primary/10 shadow-sm transition-transform duration-500 group-hover:scale-105">
                                    {user?.profileImageUrl ? (
                                        <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                            <UserIcon className="w-8 h-8 text-slate-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center border-2 border-white shadow-sm">
                                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="text-center mb-4">
                                <h3 className="text-brand-secondary font-bold text-base tracking-tight mb-0.5">
                                    {user?.firstName} {user?.lastName}
                                </h3>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100/50">
                                        Verified Professional
                                    </span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="w-full grid grid-cols-2 gap-2 border-t border-slate-50 pt-3 mt-1">
                                <div className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] text-slate-400 font-medium uppercase mb-1">Level</span>
                                    <div className="flex items-center gap-1.5">
                                        <Award className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-brand-secondary font-bold text-sm">Lv {user?.level || '1'}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] text-slate-400 font-medium uppercase mb-1">Rating</span>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                        <span className="text-brand-secondary font-bold text-sm">4.9</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Navigation */}
                <nav className="flex-1 space-y-2 overflow-y-auto pr-2 no-scrollbar">
                    <div className="px-3 mb-4">
                        <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase">Navigation</p>
                    </div>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button 
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all cursor-pointer group ${
                                    isActive 
                                    ? 'bg-white/10 text-brand-primary shadow-lg' 
                                    : 'hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <div className={`transition-colors ${isActive ? 'text-brand-primary' : 'group-hover:text-brand-primary/80'}`}>
                                    {item.icon}
                                </div>
                                <span className={`text-xs tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>
                                    {item.name}
                                </span>
                                {isActive && (
                                    <div className="ml-auto w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                                )}
                            </button>
                        );
                    })}

                    <div className="mt-8 pt-6 border-t border-white/5 space-y-1">
                        <div className="px-3 mb-4">
                            <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase">Account</p>
                        </div>
                        {secondaryItems.map((item) => (
                            <button 
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className="w-full flex items-center gap-4 px-5 py-2.5 rounded-xl transition-all hover:bg-white/5 text-white/30 hover:text-white group"
                            >
                                <div className="group-hover:text-brand-primary/70 transition-colors">
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-bold tracking-tight uppercase">
                                    {item.name}
                                </span>
                            </button>
                        ))}
                         <button 
                            onClick={logout}
                            className="w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all hover:bg-red-500/10 text-red-400 group mt-6"
                        >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black tracking-widest uppercase">
                                {t('sidebar.logout')}
                            </span>
                        </button>
                    </div>
                </nav>

                {/* Footer Section */}
                <div className="pt-6 mt-auto border-t border-white/5 flex items-center justify-between shrink-0">
                    <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest">© 2026 TrustHire</p>
                    <NotificationCenter />
                </div>
            </aside>
        </>
    );
};
