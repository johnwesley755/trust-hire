import React from 'react';
import { useUser } from '../../../core/providers/AuthContext';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick, className }) => {
  const { user } = useUser();

  return (
    <header className={`fixed top-0 right-0 left-0 lg:left-72 h-16 glass-header bg-[#F5F4EF]/80 backdrop-blur-md flex justify-between items-center px-4 md:px-8 z-30 border-b border-[#1F3F34]/5 transition-all ${className || ''}`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-[#1F3F34]/5 rounded-full transition-all text-[#1F3F34]"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        
        <div className="text-xl font-black text-[#1F3F34] tracking-tight lg:hidden">
          TrustHire
        </div>
        
        <div className="hidden md:flex items-center gap-4 bg-[#E9E8E3] px-4 py-1.5 rounded-full w-64 lg:w-96 group focus-within:ring-2 focus-within:ring-[#FACD15]/30 transition-all">
          <span className="material-symbols-outlined text-[#414845] text-xl">search</span>
          <input 
            type="text" 
            placeholder="Search for opportunities..." 
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full placeholder:text-[#414845]/50 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 hover:bg-[#E9E8E3] rounded-full transition-all relative group text-[#1F3F34]">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full animate-pulse"></span>
        </button>
        <button className="p-2 hover:bg-[#E9E8E3] rounded-full transition-all text-[#1F3F34]">
          <span className="material-symbols-outlined">chat_bubble</span>
        </button>
        
        <div className="h-8 w-[1px] bg-[#c1c8c3]/30 mx-1 md:mx-2 hidden sm:block"></div>
        
        <div className="flex items-center gap-3 group cursor-pointer hover:bg-[#1F3F34]/5 p-1.5 rounded-xl transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black leading-none text-[#1F3F34]">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-[#414845] font-bold uppercase mt-1 tracking-tighter">L2 Skilled Worker</p>
          </div>
          <div className="relative group">
            <img 
              src={user?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"} 
              alt="Profile" 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#FACD15] shadow-sm transform group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};
