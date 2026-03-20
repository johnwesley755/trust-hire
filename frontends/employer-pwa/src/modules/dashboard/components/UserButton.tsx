import { useState, useRef, useEffect } from 'react';
import { useAuth, useUser } from '../../../core/providers/AuthContext';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

export const UserButton = () => {
    const { logout } = useAuth();
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all active:scale-95"
            >
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden">
                    {user.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                        user.firstName?.[0] || 'E'
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-4 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                        <p className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button 
                        onClick={() => {
                            setIsOpen(false);
                            window.location.href = '/profile';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <User className="w-4 h-4" />
                        Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                    
                    <div className="h-px bg-slate-50 my-2" />
                    
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};
