import { useAppSelector, useAppDispatch } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Search Workers', icon: 'person_search', path: '/search' },
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
    const { user } = useAppSelector((state) => state.auth);
    const { profile } = useAppSelector((state) => state.profile);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/sign-in');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-[#1F3F34]/60 z-60 md:hidden backdrop-blur-md"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#1F3F34] p-8 gap-2 shrink-0 z-70 transition-all duration-500 md:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } md:flex flex-col shadow-2xl`}>
                {/* Logo Section */}
                <div className="mb-12 px-2 flex justify-between items-center" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase bricolage">TrustHire</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FACD15] mt-1">Tactical Portal</p>
                    </div>
                    <button onClick={onClose} className="md:hidden text-white/50 hover:text-white transition-colors">
                        <span className="material-symbols-outlined font-black">close</span>
                    </button>
                </div>

            {/* Main Navigation */}
            <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 no-scrollbar text-left">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button 
                            key={item.name}
                            onClick={() => {
                                navigate(item.path);
                                onClose();
                            }}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                                isActive 
                                ? 'bg-[#FACD15] text-[#1F3F34] shadow-xl shadow-[#FACD15]/20' 
                                : 'text-white/40 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span className={`material-symbols-outlined font-black ${isActive ? '' : 'opacity-40 group-hover:opacity-100'}`} 
                                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0", fontSize: '22px' }}>
                                {item.icon}
                            </span>
                            <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Secondary & Profile Section */}
            <div className="mt-auto flex flex-col gap-2 pt-8 border-t border-white/5 text-left">
                {secondaryItems.map((item) => (
                    <button 
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className="flex items-center gap-4 px-6 py-3 text-white/30 hover:text-white transition-all group"
                    >
                        <span className="material-symbols-outlined font-black opacity-40 group-hover:opacity-100" style={{ fontSize: '20px' }}>{item.icon}</span>
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                    </button>
                ) )}

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-6 py-3 text-white/30 hover:text-red-400 transition-all group"
                >
                    <span className="material-symbols-outlined font-black opacity-40 group-hover:opacity-100" style={{ fontSize: '20px' }}>logout</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
                </button>
                
                <div className="mt-6 flex items-center gap-4 px-3 py-4 bg-white/5 rounded-[2rem] relative border border-white/5 group hover:bg-white/10 transition-all cursor-pointer" onClick={() => navigate('/profile')}>
                    <div className="w-12 h-12 rounded-[1.2rem] border-2 border-[#FACD15]/30 overflow-hidden shrink-0 shadow-lg grayscale-[0.2] group-hover:grayscale-0 transition-all">
                        <img 
                            alt="Employer" 
                            className="w-full h-full object-cover" 
                            src={profile?.profileImageUrl || user?.profileImageUrl || "https://i.pravatar.cc/100?u=employer"}
                        />
                    </div>
                    <div className="flex flex-col truncate flex-1 pr-2">
                        <span className="text-[11px] font-black text-white truncate uppercase tracking-tight">{user?.firstName} {user?.lastName}</span>
                        <span className="text-[9px] text-[#FACD15]/70 font-black uppercase tracking-widest mt-0.5">Tier 1 Partner</span>
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
        <header className="md:hidden fixed top-0 w-full h-[64px] z-40 bg-[#F5F4EF]/80 backdrop-blur-md border-b border-[#EFEEE9] flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick}
                    className="active:scale-95 duration-200 transition-transform w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#EFEEE9] shadow-sm"
                >
                    <span className="material-symbols-outlined text-[#1F3F34] text-xl font-black">menu</span>
                </button>
                <h1 className="text-xl font-black tracking-tighter text-[#1F3F34] uppercase bricolage" onClick={() => navigate('/')}>TrustHire</h1>
            </div>
            <div className="flex items-center gap-3">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#EFEEE9] shadow-sm active:scale-90 transition-transform">
                    <span className="material-symbols-outlined text-[#1F3F34] text-xl font-black">search</span>
                </button>
            </div>
        </header>
    );
};
