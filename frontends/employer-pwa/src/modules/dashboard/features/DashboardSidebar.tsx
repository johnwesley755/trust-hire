import { useUser } from "../../../core/providers/AuthContext";
import { NotificationCenter } from './notifications/NotificationCenter';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Search Workers', icon: 'person_search', path: '/find-workers' },
    { name: 'Post a Job', icon: 'add_circle', path: '/post-job' },
    { name: 'My Active Jobs', icon: 'work', path: '/jobs' },
    { name: 'Applications', icon: 'description', path: '/applications' }, 
    { name: 'Profile', icon: 'person', path: '/profile' }, 
];

const secondaryItems = [
    { name: 'Settings', icon: 'settings', path: '/settings' },
    { name: 'Help & Support', icon: 'help', path: '/help' },
];

export const DashboardSidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-60 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#1F3F34] p-6 gap-2 shrink-0 z-70 transition-transform duration-300 md:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } md:flex flex-col`}>
                {/* Logo Section */}
                <div className="mb-8 px-2 flex justify-between items-center" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight">TrustHire</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#FACD15] opacity-90">Employer Portal</p>
                    </div>
                    <button onClick={onClose} className="md:hidden text-white/50 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

            {/* Main Navigation */}
            <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1 no-scrollbar">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button 
                            key={item.name}
                            onClick={() => {
                                navigate(item.path);
                                onClose();
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all group ${
                                isActive 
                                ? 'bg-[#FACD15] text-[#1F3F34] shadow-lg shadow-[#FACD15]/10' 
                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span className={`material-symbols-outlined ${isActive ? 'filled-icon' : ''}`} 
                                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0", fontSize: '20px' }}>
                                {item.icon}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Secondary & Profile Section */}
            <div className="mt-auto flex flex-col gap-1 pt-6 border-t border-white/10">
                {secondaryItems.map((item) => (
                    <button 
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white transition-all text-left"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
                    </button>
                ) )}
                
                <div className="mt-4 flex items-center gap-3 px-2 py-3 bg-white/5 rounded-2xl relative">
                    <div className="w-10 h-10 rounded-full border-2 border-[#FACD15]/30 overflow-hidden shrink-0">
                        <img 
                            alt="Employer" 
                            className="w-full h-full object-cover" 
                            src={user?.profileImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDB2IKihz2HBZd0YvzOOsCbtLo2SulU29Gl-66RaZ0YJu1cPL1c7gEIXDzmFS_blQp7DPx_68dl8H8Rt20b8QV8REGIk7AxmnYfhBUb6WOrdtxG8i2Xo6zbzCdHGAHY2f30l-mNztw8qHinR7O6zvr9OPtlVVb-zP_nlaG7GdSfLcvCMR4--5niBM_iua3ZjqJgXGdCfo0ke2z11Rnm8ykPyZxOftXvcLXMAJ6Sw6aEOQGXOP9afmh9Wj8ywyc9hayr3MG-fwARVAQ"}
                        />
                    </div>
                    <div className="flex flex-col truncate flex-1 pr-8">
                        <span className="text-[11px] font-bold text-white truncate">{user?.firstName} {user?.lastName}</span>
                        <span className="text-[9px] text-[#FACD15]/70 font-bold uppercase tracking-tight">Tier 1 Partner</span>
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <NotificationCenter />
                    </div>
                </div>
            </div>
        </aside>
        </>
    );
};

export const MobileNav = ({ onMenuClick }: { onMenuClick: () => void }) => {
    const navigate = useNavigate();

    return (
        <header className="md:hidden fixed top-0 w-full z-40 bg-[#F5F4EF]/80 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.05)] border-b border-[#EFEEE9]">
            <div className="flex justify-between items-center px-6 py-4 w-full">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onMenuClick}
                        className="active:scale-95 duration-200 transition-transform w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5"
                    >
                        <span className="material-symbols-outlined text-[#1F3F34] text-2xl">menu</span>
                    </button>
                    <h1 className="text-xl font-bold tracking-tight text-[#1F3F34]" onClick={() => navigate('/')}>TrustHire</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-black/5 rounded-full transition-colors active:scale-90">
                        <span className="material-symbols-outlined text-[#1F3F34]">search</span>
                    </button>
                    <button className="p-2 hover:bg-black/5 rounded-full transition-colors active:scale-90 relative">
                        <span className="material-symbols-outlined text-[#1F3F34]">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </div>
        </header>
    );
};
