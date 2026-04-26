import { useUser } from "../../../core/providers/AuthContext";
import { useNavigate } from "react-router-dom";
import { NotificationCenter } from "../features/notifications/NotificationCenter";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "../../profile/api/profile.service";

export const DashboardHeader = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const { data: profile } = useQuery({
        queryKey: ['employerProfile'],
        queryFn: profileService.getProfile,
    });

    return (
        <header className="sticky top-0 w-full z-30 bg-white/80 backdrop-blur-md flex justify-between items-center px-8 py-4 border-b border-[#EFEEE9]">
            <div className="flex items-center gap-6">
                <h2 className="text-xl font-bold text-[#1F3F34]">Dashboard</h2>
                <div className="hidden lg:flex bg-[#EFEEE9]/50 px-4 py-2 rounded-full items-center gap-2 border border-[#1F3F34]/5">
                    <span className="material-symbols-outlined text-[#1F3F34]/40 text-lg">search</span>
                    <input 
                        className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-[#1F3F34]/30 p-0" 
                        placeholder="Find candidates or jobs..." 
                        type="text"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex gap-1 items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#EFEEE9] text-[#1F3F34] relative transition-colors cursor-pointer">
                        <NotificationCenter />
                    </div>
                    <button 
                        onClick={() => navigate('/profile')}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#EFEEE9] text-[#1F3F34] transition-colors overflow-hidden border border-[#EFEEE9]"
                    >
                        <img 
                            alt="Admin" 
                            className="w-full h-full object-cover" 
                            src={profile?.profileImageUrl || user?.profileImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDB2IKihz2HBZd0YvzOOsCbtLo2SulU29Gl-66RaZ0YJu1cPL1c7gEIXDzmFS_blQp7DPx_68dl8H8Rt20b8QV8REGIk7AxmnYfhBUb6WOrdtxG8i2Xo6zbzCdHGAHY2f30l-mNztw8qHinR7O6zvr9OPtlVVb-zP_nlaG7GdSfLcvCMR4--5niBM_iua3ZjqJgXGdCfo0ke2z11Rnm8ykPyZxOftXvcLXMAJ6Sw6aEOQGXOP9afmh9Wj8ywyc9hayr3MG-fwARVAQ"}
                        />
                    </button>
                </div>
                <button 
                    onClick={() => navigate('/post-job')}
                    className="bg-[#FACD15] text-[#1F3F34] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-lg shadow-[#FACD15]/20 hover:scale-[1.02] active:scale-95 transition-all hidden md:block"
                >
                    Post a Job
                </button>
            </div>
        </header>
    );
};
