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
import { useUser } from "../../../core/providers/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../core/hooks/useLanguage';

export const ProfileCard = () => {
  const { user } = useUser();
  
  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-3xl border border-brand-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
        {/* Header/Cover Placeholder */}
        <div className="h-16 bg-brand-secondary relative">
             <div className="absolute inset-0 opacity-10 cloud-grid" />
        </div>

        <div className="px-6 pb-6 -mt-10 flex flex-col items-center text-center">
            <div className="relative mb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-brand-bg">
                    {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-brand-surface flex items-center justify-center">
                            <User className="w-10 h-10 text-brand-secondary opacity-20" />
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg shadow-md border-2 border-white">
                    <ShieldCheck className="w-3.5 h-3.5" />
                </div>
            </div>

            <div className="space-y-1 mb-6">
                <h2 className="text-xl font-bold tracking-tight text-brand-secondary">
                    {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                    Verified Professional
                </p>
            </div>

            <div className="w-full border-y border-brand-border py-4 flex justify-around mb-6">
                <div className="text-center">
                    <div className="text-[10px] font-bold text-brand-muted uppercase tracking-widest opacity-40">Level</div>
                    <div className="text-sm font-black text-brand-secondary">Lv {user?.level || '1'}</div>
                </div>
                <div className="w-px h-8 bg-brand-border self-center" />
                <div className="text-center">
                    <div className="text-[10px] font-bold text-brand-muted uppercase tracking-widest opacity-40">Rating</div>
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-brand-primary fill-brand-primary" />
                        <span className="text-sm font-black text-brand-secondary">4.9</span>
                    </div>
                </div>
            </div>

            <Link 
                to="/profile" 
                className="w-full py-3 bg-brand-bg hover:bg-brand-primary/10 text-brand-muted font-bold rounded-xl border border-brand-border transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
                View Profile <ChevronRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    </motion.div>
  );
};

export const ActionTiles = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const actions = [
    { title: t('dashboard.actions.findJobs'), icon: <Search className="w-4 h-4" />, path: '/search' },
    { title: t('dashboard.actions.skillTests'), icon: <Award className="w-4 h-4" />, path: '/tests' },
    { title: t('dashboard.actions.history'), icon: <Briefcase className="w-4 h-4" />, path: '/history' },
    { title: t('dashboard.actions.verifyId'), icon: <ShieldCheck className="w-4 h-4" />, path: '/verify-identity' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-brand-border p-2 shadow-sm">
      <div className="px-4 py-3 border-b border-brand-border mb-1">
        <span className="text-[10px] font-black tracking-widest text-brand-muted uppercase opacity-40">Quick Actions</span>
      </div>
      {actions.map((action) => (
        <button
          key={action.title}
          onClick={() => navigate(action.path)}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-brand-bg group transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-brand-bg rounded-xl flex items-center justify-center text-brand-secondary group-hover:bg-brand-primary/20 transition-colors">
                {action.icon}
            </div>
            <span className="text-xs font-bold text-brand-secondary tracking-tight">{action.title}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-brand-muted/20 group-hover:text-brand-primary transition-all" />
        </button>
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
        <div className="fixed bottom-6 left-6 right-6 h-20 bg-brand-secondary rounded-4xl flex items-center justify-around px-8 shadow-2xl border border-white/10 backdrop-blur-3xl z-50">
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
