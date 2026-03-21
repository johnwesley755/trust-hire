import React from 'react';

interface ProfileSideActionsProps {
  onLogout: () => void;
}

export const ProfileSideActions: React.FC<ProfileSideActionsProps> = ({ onLogout }) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#1F3F34]/5 relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FACD15] opacity-[0.05] rounded-full blur-xl" />
        <h4 className="text-[10px] font-black uppercase text-[#1F3F34]/30 mb-8 tracking-[0.2em] relative z-10">Dossier Control</h4>
        <div className="space-y-3 relative z-10">
          <button className="w-full py-4.5 bg-[#FACD15] text-[#1F3F34] rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-lg hover:shadow-[0_10px_20px_rgba(250,205,21,0.2)] active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">verified_user</span>
            Certification Vault
          </button>
          <button 
            onClick={onLogout}
            className="w-full py-4.5 bg-[#F5F4EF] text-[#1F3F34]/60 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-[#E9E8E3] hover:text-[#1F3F34] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Terminate Session
          </button>
        </div>
      </div>

      {/* Verification Badge Card */}
      <div className="bg-[#FACD15]/10 rounded-[2rem] p-8 border-2 border-[#FACD15] border-dashed group hover:border-solid transition-all duration-500">
        <div className="flex items-center gap-5 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#FACD15] flex items-center justify-center text-[#1F3F34] shadow-lg group-hover:rotate-6 transition-transform">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          </div>
          <div>
            <h4 className="font-black text-[#1F3F34] text-lg tracking-tight leading-none">Trust Score High</h4>
            <p className="text-[10px] text-[#1F3F34]/50 font-black uppercase tracking-widest mt-1">Verified Identity</p>
          </div>
        </div>
        <p className="text-sm text-[#1F3F34]/80 font-medium leading-relaxed mb-6">
          This dossier has been manually audited by the TrustHire compliance team. All certifications are currently active and verified.
        </p>
        <button className="text-[10px] font-black uppercase text-[#1F3F34] underline decoration-[#FACD15] decoration-4 underline-offset-8 hover:decoration-[#1F3F34] transition-all">
          Review Audit Log
        </button>
      </div>

      {/* Recent Activity */}
      <div className="p-4 px-8">
        <h4 className="text-[10px] font-black uppercase text-[#1F3F34]/30 mb-8 tracking-[0.2em]">Recent Dossier Activity</h4>
        <div className="space-y-8 relative">
          <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-[#1F3F34]/10" />
          
          <div className="flex gap-6 relative">
            <div className="w-2 h-2 rounded-full bg-[#FACD15] mt-1.5 shrink-0 shadow-[0_0_10px_rgba(250,205,21,1)]" />
            <div>
              <p className="text-sm font-black text-[#1F3F34]">Profile Synchronized</p>
              <p className="text-[10px] text-[#1F3F34]/40 font-bold uppercase mt-0.5">Automated Checkpoint • Today</p>
            </div>
          </div>

          <div className="flex gap-6 relative">
            <div className="w-2 h-2 rounded-full bg-[#1F3F34]/10 mt-1.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#1F3F34]">Industrial Level 4 Certified</p>
              <p className="text-[10px] text-[#1F3F34]/40 font-bold uppercase mt-0.5">Compliance Board • Mar 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
