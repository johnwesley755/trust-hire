import { 
  User, 
  ChevronRight, 
  Search, 
  Award, 
  Briefcase, 
  ShieldCheck, 
  Star,
  Home
} from 'lucide-react';
import { useAppSelector } from '../../store';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../core/hooks/useLanguage';

export const ProfileCard = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-[2.5rem] border border-[#1F3F34]/5 overflow-hidden shadow-sm hover:shadow-xl transition-all"
    >
        <div className="h-20 bg-[#1F3F34] relative">
             <div className="absolute inset-0 opacity-10 cloud-grid" />
        </div>

        <div className="px-6 pb-8 -mt-10 flex flex-col items-center text-center">
            <div className="relative mb-4">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-[#F5F4EF]">
                    {user?.profile_image_url ? (
                        <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <User className="w-10 h-10 text-[#1F3F34]/20" />
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-xl shadow-md border-2 border-white">
                    <ShieldCheck className="w-4 h-4" />
                </div>
            </div>

            <div className="space-y-1 mb-8">
                <h2 className="text-2xl font-black tracking-tight text-[#1F3F34] bricolage leading-none">
                    {user?.first_name || user?.fullName?.split(' ')[0]} {user?.last_name || user?.fullName?.split(' ')[1] || ''}
                </h2>
                <p className="text-[10px] font-black text-[#FACD15] uppercase tracking-[0.2em] mt-1">
                    Verified Professional
                </p>
            </div>

            <div className="w-full border-y border-[#F5F4EF] py-6 flex justify-around mb-8">
                <div className="text-center">
                    <div className="text-[10px] font-black text-[#1F3F34]/40 uppercase tracking-widest">Level</div>
                    <div className="text-lg font-black text-[#1F3F34]">L{user?.level || '1'}</div>
                </div>
                <div className="w-px h-10 bg-[#F5F4EF] self-center" />
                <div className="text-center">
                    <div className="text-[10px] font-black text-[#1F3F34]/40 uppercase tracking-widest">Rating</div>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#FACD15] fill-[#FACD15]" />
                        <span className="text-lg font-black text-[#1F3F34]">4.9</span>
                    </div>
                </div>
            </div>

            <Link 
                to="/profile" 
                className="w-full py-4 bg-[#F5F4EF] hover:bg-[#FACD15]/10 text-[#1F3F34]/60 font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
                View Profile <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
        <style>{`
            .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
            .cloud-grid {
              background-image: 
                linear-gradient(rgba(250, 205, 21, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(250, 205, 21, 0.2) 1px, transparent 1px);
              background-size: 20px 20px;
            }
        `}</style>
    </motion.div>
  );
};

export const ActionTiles = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const actions = [
    { title: t('dashboard.actions.findJobs'), icon: <Search className="w-4 h-4" />, path: '/search' },
    { title: t('dashboard.actions.skillTests'), icon: <Award className="w-4 h-4" />, path: '/tests' },
    { title: t('dashboard.actions.history'), icon: <Briefcase className="w-4 h-4" />, path: '/applied-jobs' },
    { title: t('dashboard.actions.verifyId'), icon: <ShieldCheck className="w-4 h-4" />, path: '/verify-identity' },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-[#1F3F34]/5 p-3 shadow-sm">
      <div className="px-6 py-4 border-b border-[#F5F4EF] mb-2">
        <span className="text-[10px] font-black tracking-widest text-[#1F3F34]/30 uppercase">Quick Actions</span>
      </div>
      {actions.map((action) => (
        <button
          key={action.title}
          onClick={() => navigate(action.path)}
          className="w-full flex items-center justify-between p-5 rounded-[1.5rem] hover:bg-[#F5F4EF] group transition-all"
        >
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 bg-[#F5F4EF] rounded-xl flex items-center justify-center text-[#1F3F34] group-hover:bg-[#FACD15]/20 transition-colors">
                {action.icon}
            </div>
            <span className="text-xs font-black text-[#1F3F34] tracking-tight uppercase tracking-widest text-[10px]">{action.title}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#1F3F34]/10 group-hover:text-[#FACD15] transition-all" />
        </button>
      ))}
    </div>
  );
};

export const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const items = [
        { icon: <Home className="w-6 h-6" />, path: '/dashboard', label: 'Hub' },
        { icon: <Search className="w-6 h-6" />, path: '/search', label: 'Search' },
        { icon: <Award className="w-6 h-6" />, path: '/tests', label: 'Verify' },
        { icon: <Briefcase className="w-6 h-6" />, path: '/applied-jobs', label: 'Work' },
        { icon: <User className="w-6 h-6" />, path: '/profile', label: 'Profile' },
    ];

    return (
        <div className="fixed bottom-6 left-6 right-6 h-20 bg-[#1F3F34] rounded-[2.5rem] flex items-center justify-around px-8 shadow-2xl border border-white/10 backdrop-blur-3xl z-50 lg:hidden">
            {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`p-3 transition-all active:scale-95 group flex flex-col items-center gap-1 ${isActive ? 'text-[#FACD15]' : 'text-white/40 hover:text-white'}`}
                    >
                        <div className={`transition-transform ${isActive ? 'scale-110' : 'group-hover:-translate-y-1'}`}>
                            {item.icon}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
