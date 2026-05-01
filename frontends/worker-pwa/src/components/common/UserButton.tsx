import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserButton = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/sign-in');
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-2xl bg-[#FACD15]/10 border border-[#FACD15] overflow-hidden flex items-center justify-center hover:scale-105 transition-all shadow-sm active:scale-95"
            >
                {user.profile_image_url ? (
                    <img src={user.profile_image_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <User className="w-5 h-5 text-[#1F3F34]" />
                )}
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-[2rem] shadow-2xl border border-[#1F3F34]/5 py-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-[#F5F4EF] mb-2">
                            <p className="text-xs font-black text-[#1F3F34] truncate bricolage">
                                {user.first_name || user.fullName || 'Professional'} {user.last_name || ''}
                            </p>
                            <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest truncate">{user.email}</p>
                        </div>
                        
                        <div className="px-2 space-y-1">
                            <button 
                                onClick={() => { navigate('/settings'); setIsOpen(false); }}
                                className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/60 hover:text-[#1F3F34] hover:bg-[#F5F4EF] rounded-xl flex items-center gap-3 transition-all"
                            >
                                <Settings className="w-4 h-4" /> Account Settings
                            </button>
                            <button 
                                onClick={() => { navigate('/help'); setIsOpen(false); }}
                                className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/60 hover:text-[#1F3F34] hover:bg-[#F5F4EF] rounded-xl flex items-center gap-3 transition-all"
                            >
                                <HelpCircle className="w-4 h-4" /> Help Center
                            </button>
                            
                            <div className="h-px bg-[#F5F4EF] mx-4 my-2" />
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl flex items-center gap-3 transition-all"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}
            <style>{`
                .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
            `}</style>
        </div>
    );
};

export default UserButton;
