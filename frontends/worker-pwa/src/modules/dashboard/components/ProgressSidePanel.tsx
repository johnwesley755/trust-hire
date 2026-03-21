import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  containerColor: string;
  hoverColor: string;
  iconColor: string;
  path: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, containerColor, hoverColor, iconColor, path }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(path)}
      className="bg-white p-4 rounded-2xl flex items-center gap-4 bento-card cursor-pointer group shadow-sm hover:shadow-md transition-all border border-[#c1c8c3]/10"
    >
      <div className={`w-12 h-12 ${containerColor} rounded-xl flex items-center justify-center ${iconColor} group-hover:${hoverColor} transition-all duration-300`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex-1">
        <h5 className="text-sm font-extrabold text-[#1F3F34]">{title}</h5>
        <p className="text-[0.65rem] text-[#414845] font-medium">{description}</p>
      </div>
      <span className="material-symbols-outlined text-[#414845] transform group-hover:translate-x-1 transition-transform">chevron_right</span>
    </div>
  );
};

export const ProgressSidePanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1F3F34] text-[#F5F4EF] p-6 rounded-[2rem] relative overflow-hidden bento-card shadow-lg hover:shadow-xl transition-all border border-[#FACD15]/10">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-[#FACD15]">trending_up</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-widest leading-none">Level Progress</span>
          </div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <h3 className="text-2xl font-extrabold text-white">L2 Skilled</h3>
              <p className="text-xs text-[#F5F4EF]/60 font-medium tracking-tight">To L3 Expert</p>
            </div>
            <span className="text-2xl font-extrabold text-[#FACD15]">75%</span>
          </div>
          <div className="h-3 w-full bg-[#FFFFFF]/10 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-[#FACD15] rounded-full w-[75%] shadow-[0_0_15px_rgba(250,205,21,0.3)]"></div>
          </div>
          <div className="space-y-3">
            <p className="text-[0.65rem] font-bold text-[#F5F4EF]/40 uppercase tracking-widest leading-none">Tasks to unlock L3</p>
            <div className="flex items-center gap-3 bg-[#FFFFFF]/5 p-3 rounded-xl hover:bg-[#FFFFFF]/10 transition-colors cursor-default">
              <span className="material-symbols-outlined text-[#FACD15] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-xs font-medium">Complete 5 jobs</span>
            </div>
            <div className="flex items-center gap-3 bg-[#FFFFFF]/5 p-3 rounded-xl border border-[#FFFFFF]/10 hover:bg-[#FFFFFF]/10 transition-colors cursor-default">
              <span className="material-symbols-outlined text-[#F5F4EF]/30 text-sm">radio_button_unchecked</span>
              <span className="text-xs font-medium">Pass Expert Skill Test</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#FACD15]/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <h2 className="text-xl font-extrabold text-[#1F3F34] flex items-center gap-2 px-2 tracking-tight">
        <span className="w-2 h-6 bg-[#FACD15] rounded-full"></span>
        Quick Actions
      </h2>
      
      <div className="space-y-4">
        <ActionCard 
          title="Verify Identity" 
          description="Unlock premium job access" 
          icon="fingerprint" 
          containerColor="bg-[#c7ebdb]/30" 
          hoverColor="bg-[#FACD15]"
          iconColor="text-[#1F3F34]"
          path="/verify-identity"
        />
        <ActionCard 
          title="Take Skill Test" 
          description="Boost your profile visibility" 
          icon="quiz" 
          containerColor="bg-[#ffe081]/30" 
          hoverColor="bg-[#FACD15]"
          iconColor="text-[#1F3F34]"
          path="/tests"
        />
        
        <div className="bg-[#f5f4ef] p-6 rounded-[2rem] text-center border border-[#c1c8c3]/20 shadow-sm relative overflow-hidden group">
          <div className="mb-4 inline-block p-4 bg-white rounded-full shadow-sm transform group-hover:rotate-12 transition-transform duration-500">
            <span className="material-symbols-outlined text-4xl text-[#1F3F34]" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
          </div>
          <h5 className="text-sm font-extrabold mb-1 text-[#1F3F34]">Refer & Earn</h5>
          <p className="text-[0.65rem] text-[#414845] font-medium mb-4">Get ₹200 for every friend who joins</p>
          <button className="w-full py-2.5 rounded-xl border-2 border-[#1F3F34] text-[#1F3F34] text-[0.65rem] font-extrabold uppercase hover:bg-[#1F3F34] hover:text-[#f5f4ef] transition-all active:scale-95">
            Share Link
          </button>
        </div>
      </div>
    </div>
  );
};
