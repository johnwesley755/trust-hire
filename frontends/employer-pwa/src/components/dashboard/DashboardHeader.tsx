import { useAppSelector } from "../../store";
import { useNavigate } from "react-router-dom";
import { NotificationCenter } from "../notifications/NotificationCenter";

export const DashboardHeader = () => {
    const { user } = useAppSelector((state) => state.auth);
    const { profile } = useAppSelector((state) => state.profile);
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 w-full h-[72px] z-30 bg-white/80 backdrop-blur-md flex justify-between items-center px-8 border-b border-[#EFEEE9]">
            <div className="flex items-center gap-8">
                <h2 className="text-xl font-black text-[#1F3F34] uppercase bricolage tracking-tight">Dashboard</h2>
                <div className="hidden lg:flex bg-[#F5F4EF] px-5 py-2.5 rounded-2xl items-center gap-3 border border-[#1F3F34]/5 shadow-inner">
                    <span className="material-symbols-outlined text-[#1F3F34]/30 text-lg">search</span>
                    <input 
                        className="bg-transparent border-none focus:ring-0 text-xs font-bold w-64 placeholder:text-[#1F3F34]/20 p-0 uppercase tracking-widest" 
                        placeholder="Search candidates..." 
                        type="text"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-8">
                <div className="flex gap-2 items-center">
                    <NotificationCenter />
                    <button 
                        onClick={() => navigate('/profile')}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F5F4EF] text-[#1F3F34] transition-all overflow-hidden border border-[#EFEEE9] shadow-sm"
                    >
                        <img 
                            alt="Admin" 
                            className="w-full h-full object-cover grayscale-[0.2]" 
                            src={profile?.profileImageUrl || user?.profileImageUrl || "https://i.pravatar.cc/100?u=employer"}
                        />
                    </button>
                </div>
                <button 
                    onClick={() => navigate('/post-job')}
                    className="bg-[#FACD15] text-[#1F3F34] font-black text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 rounded-2xl shadow-xl shadow-[#FACD15]/20 hover:scale-[1.05] active:scale-95 transition-all hidden md:block"
                >
                    Post a Tactical Job
                </button>
            </div>
        </header>
    );
};
