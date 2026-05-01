import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchProfile, updateEmployerProfile } from '../../store/slices/profileSlice';
import { syncUser, logout } from '../../store/slices/authSlice';
import apiClient from '../../api/apiClient';
import { 
    User, Mail, MapPin, Building2, LogOut, ShieldCheck, 
    Camera, Loader2, Globe, ExternalLink, 
    Verified, X, Check, Briefcase, Settings
} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const { profile, loading } = useAppSelector((state) => state.profile);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }

        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await apiClient.post('/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            await dispatch(syncUser()).unwrap();
            dispatch(fetchProfile());
        } catch (err: any) {
            console.error("Failed to upload image:", err);
            alert(err.response?.data?.message || "Failed to update profile image");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/sign-in');
    };

    if (loading && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F4EF]">
                <Loader2 className="w-12 h-12 text-[#1F3F34] animate-spin opacity-20" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#F5F4EF] min-h-screen selection:bg-[#FACD15] selection:text-[#1F3F34]">
            {/* Header Section */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#EFEEE9] px-8 py-5 flex justify-between items-center">
                <h2 className="text-xl font-black text-[#1F3F34] tracking-tight uppercase bricolage">Enterprise Identity</h2>
                <div className="flex items-center gap-6">
                    <Link to="/settings" className="text-[#1F3F34]/30 hover:text-[#FACD15] transition-colors p-2.5 rounded-xl bg-[#F5F4EF] border border-[#EFEEE9]">
                        <Settings className="w-5 h-5" />
                    </Link>
                    <button onClick={handleLogout} className="text-[#1F3F34]/30 hover:text-red-600 transition-colors p-2.5 rounded-xl bg-[#F5F4EF] border border-[#EFEEE9]">
                        <LogOut className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#EFEEE9] shadow-sm">
                        <img 
                            src={profile?.profileImageUrl || user?.profileImageUrl || "https://i.pravatar.cc/100?u=employer"} 
                            alt="Profile" 
                            className="w-full h-full object-cover grayscale-[0.2]"
                        />
                    </div>
                </div>
            </header>

            <main className="p-4 lg:p-10 space-y-10 max-w-[1600px] mx-auto w-full pb-32 text-left">
                {/* Profile Hero Card */}
                <section className="bg-white rounded-[3.5rem] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-start shadow-2xl shadow-[#1F3F34]/5 relative overflow-hidden group border border-[#EFEEE9]">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FACD15] opacity-[0.03] rounded-full -mr-48 -mt-48 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                    
                    <div className="relative shrink-0">
                        <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] bg-[#F5F4EF] overflow-hidden shadow-inner relative border-4 border-white ring-1 ring-[#EFEEE9]">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                title="Update Tactical Profile Photo"
                            />
                            {profile?.profileImageUrl || user?.profileImageUrl ? (
                                <img 
                                    src={profile?.profileImageUrl || user?.profileImageUrl} 
                                    alt={user?.firstName || ""} 
                                    className={`w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 ${isUploadingImage ? 'opacity-50' : 'group-hover:opacity-90'}`}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#1F3F34]/10">
                                    <User className="w-20 h-20" />
                                </div>
                            )}
                            
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <Camera className="w-10 h-10 text-white" />
                            </div>

                            {isUploadingImage && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-30">
                                    <Loader2 className="w-10 h-10 text-[#1F3F34] animate-spin opacity-20" />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-[#1F3F34] text-[#FACD15] p-3 rounded-2xl border-4 border-white shadow-2xl z-40 transform hover:scale-110 transition-transform">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 pt-4">
                        <div className="flex flex-wrap items-center gap-6">
                            <h3 className="text-4xl md:text-6xl font-black text-[#1F3F34] leading-[0.9] tracking-tighter uppercase bricolage">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <div className="px-6 py-2 bg-[#FACD15] text-[#1F3F34] text-[10px] font-black uppercase tracking-[0.25em] rounded-full shadow-xl shadow-[#FACD15]/20">
                                VERIFIED STRATEGIC PARTNER
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-[#1F3F34]/40">
                            <p className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-[#FACD15]" />
                                {profile?.city || "Operational Hub Unknown"}
                            </p>
                            <p className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[#FACD15]" />
                                {user?.email}
                            </p>
                        </div>

                        <div className="pt-8 flex flex-wrap gap-4">
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="bg-[#1F3F34] text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-[#1F3F34]/20 hover:bg-[#FACD15] hover:text-[#1F3F34] active:scale-95 transition-all"
                            >
                                MODULATE PROFILE
                            </button>
                            <Link 
                                to="/settings"
                                className="bg-white text-[#1F3F34] px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border-2 border-[#EFEEE9] hover:border-[#FACD15] transition-all active:scale-95 flex items-center gap-3"
                            >
                                <Settings className="w-4 h-4" />
                                CORE SETTINGS
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Bento Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Enterprise Identity Column */}
                    <div className="lg:col-span-8 space-y-10">
                        <section className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9]">
                            <h4 className="text-[10px] font-black text-[#1F3F34]/30 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                                <span className="w-2 h-2 bg-[#FACD15] rounded-full"></span>
                                ENTERPRISE IDENTITY BRIEF
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3 p-6 bg-[#F5F4EF] rounded-[2rem] border border-transparent hover:border-[#FACD15]/20 transition-all overflow-hidden group">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30">MISSION CALLSIGN</label>
                                    <p className="text-xl font-black text-[#1F3F34] break-words uppercase bricolage">{profile?.companyName || "NOT INITIALIZED"}</p>
                                </div>
                                <div className="space-y-3 p-6 bg-[#F5F4EF] rounded-[2rem] border border-transparent hover:border-[#FACD15]/20 transition-all group">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30">STRATEGIC SECTOR</label>
                                    <p className="text-xl font-black text-[#1F3F34] uppercase bricolage">{profile?.industry || "RECONNAISSANCE"}</p>
                                </div>
                                <div className="md:col-span-2 space-y-3 p-6 bg-[#F5F4EF] rounded-[2rem] border border-transparent hover:border-[#FACD15]/20 transition-all overflow-hidden group">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30">DIGITAL DEPLOYMENT</label>
                                    <div className="flex items-center justify-between gap-6">
                                        <p className="text-xl font-black text-[#1F3F34] break-all bricolage">{profile?.companyWebsite || "N/A"}</p>
                                        <ExternalLink className="w-5 h-5 text-[#FACD15] shrink-0 opacity-40 group-hover:opacity-100 transition-all" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-4 pt-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 px-2">OPERATIONAL OVERVIEW</label>
                                    <div className="text-md leading-relaxed text-[#1F3F34]/70 font-medium bg-[#F5F4EF]/50 p-10 rounded-[3rem] border border-[#EFEEE9] break-words overflow-hidden italic shadow-inner">
                                        "{profile?.profileBio || "Initializing tactical mission brief... Acme remains at the forefront of strategic infrastructure deployments across Bharat."}"
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Personal Protocol & Activity Column */}
                    <div className="lg:col-span-4 space-y-10">
                        <section className="bg-[#1F3F34] text-[#F5F4EF] rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FACD15] opacity-5 rounded-full -mb-24 -mr-24 group-hover:scale-125 transition-transform duration-1000"></div>
                            
                            <h4 className="text-[10px] font-black text-[#FACD15] uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                                <ShieldCheck className="w-5 h-5" />
                                SECURITY PROTOCOL
                            </h4>

                            <div className="space-y-10 relative z-10">
                                <div className="flex items-center gap-6 group/item">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover/item:bg-[#FACD15]/20 transition-all border border-white/5 shadow-inner">
                                        <Mail className="w-6 h-6 text-[#FACD15]" />
                                    </div>
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <label className="text-[8px] font-black uppercase tracking-[0.25em] text-white/30">PROTOCOL EMAIL</label>
                                        <p className="text-[11px] font-black break-all uppercase tracking-widest">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 group/item">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover/item:bg-[#FACD15]/20 transition-all border border-white/5 shadow-inner">
                                        <MapPin className="w-6 h-6 text-[#FACD15]" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black uppercase tracking-[0.25em] text-white/30">OPERATIONAL HUB</label>
                                        <p className="text-[11px] font-black uppercase tracking-widest">{profile?.city || "GLOBAL HQ"}</p>
                                    </div>
                                </div>

                                <div className="space-y-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#FACD15]/10 flex items-center justify-center border border-[#FACD15]/20">
                                                <Verified className="w-6 h-6 text-[#FACD15]" />
                                            </div>
                                            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">TRUST INDEX</label>
                                        </div>
                                        <span className="text-2xl font-black text-[#FACD15] bricolage">98.4</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-[#FACD15] w-[98%] shadow-[0_0_20px_#FACD15]"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9] hover:border-[#FACD15]/40 transition-all">
                            <h4 className="text-[9px] font-black text-[#1F3F34]/20 uppercase tracking-[0.4em] mb-8">MISSION LOGS</h4>
                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_12px_rgba(16,185,129,0.5)] group-hover:scale-150 transition-all"></div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-[#1F3F34] uppercase tracking-tighter">Fleet Expanded: +3 Operatives</p>
                                        <p className="text-[9px] font-black text-[#1F3F34]/30 uppercase tracking-[0.1em]">2H AGO • SECTOR BLUE-4</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 group">
                                    <div className="w-3 h-3 rounded-full bg-[#FACD15] mt-1.5 shadow-[0_0_12px_rgba(250,205,21,0.5)] group-hover:scale-150 transition-all"></div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-[#1F3F34] uppercase tracking-tighter">Tactical Brief Posted</p>
                                        <p className="text-[9px] font-black text-[#1F3F34]/30 uppercase tracking-[0.1em]">24H AGO • MAIN HUB</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1F3F34]/60 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/20">
                        <div className="p-10 border-b border-[#F5F4EF] flex justify-between items-center bg-[#F5F4EF]/30">
                            <div>
                                <h3 className="text-3xl font-black text-[#1F3F34] uppercase bricolage tracking-tight">MODULATE IDENTITY</h3>
                                <p className="text-[9px] font-black text-[#1F3F34]/30 uppercase tracking-[0.3em] mt-2">Security Verification Required</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white hover:bg-red-50 text-[#1F3F34]/30 hover:text-red-600 transition-all border border-[#EFEEE9] shadow-sm">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar" onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const updates = {
                                companyName: formData.get('companyName') as string,
                                industry: formData.get('industry') as string,
                                companyWebsite: formData.get('companyWebsite') as string,
                                profileBio: formData.get('profileBio') as string,
                                city: formData.get('city') as string,
                            };
                            await dispatch(updateEmployerProfile(updates)).unwrap();
                            setIsEditModalOpen(false);
                        }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput label="MISSION CALLSIGN" name="companyName" defaultValue={profile?.companyName} icon={<Building2 className="w-4 h-4" />} />
                                <FormInput label="STRATEGIC SECTOR" name="industry" defaultValue={profile?.industry} icon={<Briefcase className="w-4 h-4" />} />
                                <FormInput label="DIGITAL DEPLOYMENT" name="companyWebsite" defaultValue={profile?.companyWebsite} icon={<Globe className="w-4 h-4" />} />
                                <FormInput label="OPERATIONAL HUB" name="city" defaultValue={profile?.city} icon={<MapPin className="w-4 h-4" />} />
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/40 px-2">MISSION BRIEF (BIO)</label>
                                    <textarea 
                                        name="profileBio"
                                        defaultValue={profile?.profileBio}
                                        rows={4}
                                        className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-[2rem] p-6 text-sm font-black text-[#1F3F34] focus:outline-none transition-all placeholder:text-[#1F3F34]/10 shadow-inner italic"
                                        placeholder="Outline your enterprise objectives..."
                                    />
                                </div>
                            </div>

                            <div className="pt-8 flex gap-6">
                                <button 
                                    type="submit"
                                    className="flex-1 bg-[#1F3F34] text-[#FACD15] py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-[#1F3F34]/20"
                                >
                                    <Check className="w-5 h-5 group-hover:scale-150 transition-transform" />
                                    VALIDATE CHANGES
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-10 bg-[#F5F4EF] text-[#1F3F34]/30 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] border-2 border-transparent hover:border-[#EFEEE9] transition-all hover:text-[#1F3F34]"
                                >
                                    ABORT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function FormInput({ label, name, defaultValue, icon }: { label: string, name: string, defaultValue?: string, icon: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/40 px-2">{label}</label>
            <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1F3F34]/20 group-focus-within:text-[#FACD15] transition-colors">
                    {icon}
                </div>
                <input 
                    type="text"
                    name={name}
                    defaultValue={defaultValue}
                    className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full pl-14 pr-8 py-4 text-sm font-black text-[#1F3F34] focus:outline-none transition-all placeholder:text-[#1F3F34]/10 shadow-inner" 
                    placeholder={`Enter ${label.toLowerCase()}...`}
                />
            </div>
        </div>
    );
}
