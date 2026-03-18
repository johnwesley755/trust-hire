import { 
  User, 
  MapPin, 
  ChevronRight, 
  Search, 
  Award, 
  Briefcase, 
  ShieldCheck, 
  Star,
  Clock,
  Home,
  BriefcaseIcon
} from 'lucide-react';
import { useUser } from "../../providers/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

export const ProfileCard = () => {
  const { user } = useUser();
  
  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-white rounded-[2.5rem] border border-brand-border p-8 relative overflow-hidden group shadow-xl shadow-brand-secondary/5"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary opacity-[0.05] rounded-bl-full pointer-events-none" />
        <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
        
        <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
                <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative group-hover:rotate-2 transition-transform bg-brand-bg">
                    {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover grayscale-[0.2]" />
                    ) : (
                        <div className="w-full h-full bg-brand-surface flex items-center justify-center">
                            <User className="w-12 h-12 text-brand-secondary opacity-10" />
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                    <ShieldCheck className="w-5 h-5" />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <h2 className="text-3xl font-semibold tracking-tight text-brand-secondary leading-none">
                        {user?.firstName} {user?.lastName}
                    </h2>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <p className="text-brand-primary font-semibold tracking-widest text-[10px] bg-brand-secondary px-3 py-1 rounded-full">Verified professional</p>
                </div>
            </div>

            <div className="grid grid-cols-2 w-full gap-4 pt-4">
                 <div className="bg-brand-bg rounded-2xl p-4 border border-brand-border text-left">
                    <div className="text-[10px] font-semibold text-brand-secondary/40 tracking-widest mb-1">Reputation</div>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-brand-primary fill-brand-primary" />
                        <span className="font-semibold text-brand-secondary">4.9</span>
                    </div>
                </div>
                <div className="bg-brand-bg rounded-2xl p-4 border border-brand-border text-left">
                    <div className="text-[10px] font-semibold text-brand-secondary/40 tracking-widest mb-1">Experience</div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-brand-primary" />
                        <span className="font-semibold text-brand-secondary">Lv {user?.level || '1'}</span>
                    </div>
                </div>
            </div>

            <Link 
                to="/profile" 
                className="w-full py-4 bg-brand-bg hover:bg-brand-secondary hover:text-brand-primary text-brand-secondary font-semibold rounded-2xl border border-brand-border transition-all tracking-widest text-[10px] flex items-center justify-center gap-2"
            >
                Integrity Report <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
    </motion.div>
  );
};

export const ActionGrid = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const actions = [
    { title: t('dashboard.findJobs'), icon: <Search className="w-6 h-6" />, path: '/search', color: 'bg-brand-primary text-brand-secondary border-brand-primary shadow-brand-primary/20' },
    { title: t('dashboard.skillTests'), icon: <Award className="w-6 h-6" />, path: '/tests', color: 'bg-white text-brand-secondary border-brand-border hover:border-brand-primary' },
    { title: t('dashboard.history'), icon: <Briefcase className="w-6 h-6" />, path: '/history', color: 'bg-brand-secondary text-brand-primary border-brand-secondary shadow-brand-secondary/20' },
    { title: 'Security', icon: <ShieldCheck className="w-6 h-6" />, path: '/verify-identity', color: 'bg-white text-brand-secondary border-brand-border hover:border-brand-primary' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, i) => (
        <motion.button
          key={action.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => navigate(action.path)}
          className={`flex flex-col items-start p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ${action.color}`}
        >
          <div className="mb-6 group-hover:scale-110 transition-transform">{action.icon}</div>
          <span className="text-xs font-semibold tracking-widest group-hover:translate-x-1 transition-transform">{action.title}</span>
          <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity" />
        </motion.button>
      ))}
    </div>
  );
};

export const BottomNav = () => {
    const navigate = useNavigate();
    
    const items = [
        { icon: <Home className="w-6 h-6" />, path: '/dashboard', label: 'Hub' },
        { icon: <Search className="w-6 h-6" />, path: '/search', label: 'Search' },
        { icon: <Award className="w-6 h-6" />, path: '/tests', label: 'Verify' },
        { icon: <Briefcase className="w-6 h-6" />, path: '/history', label: 'Work' },
        { icon: <User className="w-6 h-6" />, path: '/profile', label: 'Profile' },
    ];

    return (
        <div className="fixed bottom-6 left-6 right-6 h-20 bg-brand-secondary rounded-[2.5rem] flex items-center justify-around px-8 shadow-2xl border border-white/10 backdrop-blur-3xl z-50">
            {items.map((item) => (
                <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="p-3 text-white/40 hover:text-brand-primary transition-all active:scale-95 group flex flex-col items-center gap-1"
                >
                    <div className="group-hover:-translate-y-1 transition-transform">
                        {item.icon}
                    </div>
                </button>
            ))}
        </div>
    );
};
