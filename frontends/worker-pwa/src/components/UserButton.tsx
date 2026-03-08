import { useState } from 'react';
import { useAuth, useUser } from '../providers/AuthContext';
import { User, LogOut } from 'lucide-react';

export const UserButton = () => {
    const { user } = useUser();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 overflow-hidden flex items-center justify-center hover:scale-105 transition-transform"
            >
                {user.imageUrl ? (
                    <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <User className="w-6 h-6 text-emerald-600" />
                )}
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-3 border-b border-slate-50 mb-2">
                            <p className="text-sm font-bold text-slate-900 truncate">
                                {user.firstName || 'User'} {user.lastName || ''}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        
                        <button 
                            onClick={logout}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserButton;
