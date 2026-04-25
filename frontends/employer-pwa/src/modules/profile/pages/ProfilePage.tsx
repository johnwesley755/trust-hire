import { useState } from 'react';
import { useAuth, useUser } from "../../../core/providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, type EmployerProfile } from "../api/profile.service";
import apiClient from "../../../core/api/apiClient";
import { 
    User, Mail, MapPin, Building2, LogOut, ShieldCheck, 
    Camera, Loader2, Globe, ExternalLink, 
    Verified, X, Check, Briefcase, Settings
} from "lucide-react";
import { Link } from 'react-router-dom';

export default function ProfilePage() {
    const { logout } = useAuth();
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const { data: profile, isLoading } = useQuery({
        queryKey: ['employerProfile'],
        queryFn: profileService.getProfile,
    });

    const updateMutation = useMutation({
        mutationFn: (updates: Partial<EmployerProfile>) => profileService.updateProfile({ ...profile!, ...updates }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
            setIsEditModalOpen(false);
        }
    });

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
            const uploadRes = await apiClient.post('/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const newImageUrl = uploadRes.data.url;

            await apiClient.post('/api/auth/sync', { profileImageUrl: newImageUrl });

            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userObj = JSON.parse(storedUser);
                userObj.profileImageUrl = newImageUrl;
                localStorage.setItem('user', JSON.stringify(userObj));
                window.location.reload();
            }
        } catch (err: any) {
            console.error("Failed to upload image:", err);
            alert(err.response?.data?.message || "Failed to update profile image");
        } finally {
            setIsUploadingImage(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F4EF]">
                <Loader2 className="w-12 h-12 text-[#1F3F34] animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col font-['Bricolage_Grotesque'] bg-[#F5F4EF] min-h-screen">
            {/* Header Section */}
            <header className="sticky top-0 z-40 bg-[#F5F4EF]/80 backdrop-blur-xl border-b border-[#EFEEE9] px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-black text-[#1F3F34] tracking-tight">Enterprise Identity</h2>
                <div className="flex items-center gap-4">
                    <Link to="/settings" className="text-[#1F3F34]/60 hover:text-[#FACD15] transition-colors p-2 rounded-full hover:bg-white">
                        <Settings className="w-5 h-5" />
                    </Link>
                    <button onClick={logout} className="text-[#1F3F34]/60 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
                        <LogOut className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FACD15] shadow-sm">
                        <img 
                            src={user?.profileImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDu_-9A0uL8jewJUb7fnsTb5DmbTDJ-8WproHwY_Kynm4LGC4YzEpeMAKhoRTFNS9o5K1-d9t6OnkWdgu54p3Focwt-PutSV3WGF8IvLC1IaCq3fOl7ZCgFqES1yRoKT9wjzy92UQb_Z0qRSmsHU7QVQssx4-lN-4dAHmadeFUedQLiEfRIcERjkD5_R8-pNdnAaHK7C2tpD8Js3uJZgoAMiZNv61e3sW1lq5s0Iv_V6yx6QR2yC5ylgdy4vjBuP0R3vRLWlubIrqs"} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </header>

            <main className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full pb-32">
                {/* Profile Hero Card */}
                <section className="bg-white rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FACD15] opacity-[0.03] rounded-full -mr-24 -mt-24 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                    
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-[#F5F4EF] overflow-hidden shadow-inner relative">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                title="Change Profile Photo"
                            />
                            {user?.profileImageUrl ? (
                                <img 
                                    src={user.profileImageUrl} 
                                    alt={user.firstName || ""} 
                                    className={`w-full h-full object-cover transition-all ${isUploadingImage ? 'opacity-50' : 'group-hover:opacity-90'}`}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#1F3F34]/20">
                                    <User className="w-16 h-16" />
                                </div>
                            )}
                            
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <Camera className="w-8 h-8 text-white" />
                            </div>

                            {isUploadingImage && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-30">
                                    <Loader2 className="w-8 h-8 text-[#1F3F34] animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-600 text-white p-2 rounded-full border-4 border-white shadow-lg z-40 transform hover:scale-110 transition-transform">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 pt-2">
                        <div className="flex flex-wrap items-center gap-4">
                            <h3 className="text-3xl md:text-4xl font-black text-[#1F3F34] leading-tight">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <span className="px-4 py-1.5 bg-[#1F3F34] text-[#FACD15] text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-[#1F3F34]/10">
                                Verified Enterprise Administrator
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-[#1F3F34]/60">
                            <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#FACD15]" />
                                {profile?.city || "Chennai, Tamil Nadu, India"}
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#FACD15]" />
                                {user?.email}
                            </p>
                        </div>

                        <div className="pt-4 flex flex-wrap gap-4">
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="bg-[#FACD15] text-[#1F3F34] px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#FACD15]/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Update Profile
                            </button>
                            <Link 
                                to="/settings"
                                className="bg-white text-[#1F3F34] px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-[#1F3F34]/5 hover:border-[#FACD15] transition-all active:scale-95 flex items-center gap-2"
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </Link>
                            <button 
                                onClick={logout}
                                className="text-[#1F3F34]/60 hover:text-[#1F3F34] px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-[#1F3F34]/5 hover:border-[#1F3F34]/20 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </section>

                {/* Bento Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Enterprise Identity Column */}
                    <div className="md:col-span-12 lg:col-span-7 space-y-8">
                        <section className="bg-white rounded-lg p-8 shadow-sm border border-[#EFEEE9]">
                            <h4 className="text-xl font-black text-[#1F3F34] mb-8 flex items-center gap-3">
                                <div className="p-2 bg-[#FACD15]/10 rounded-xl">
                                    <Building2 className="w-6 h-6 text-[#FACD15]" />
                                </div>
                                Enterprise Identity
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5 p-4 bg-[#F5F4EF]/30 rounded-2xl border border-transparent hover:border-[#FACD15]/20 transition-all">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1F3F34]/40">Company Name</label>
                                    <p className="text-lg font-black text-[#1F3F34]">{profile?.companyName || "Acme Constructions"}</p>
                                </div>
                                <div className="space-y-1.5 p-4 bg-[#F5F4EF]/30 rounded-2xl border border-transparent hover:border-[#FACD15]/20 transition-all">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1F3F34]/40">Industry</label>
                                    <p className="text-lg font-black text-[#1F3F34]">{profile?.industry || "Facility Management"}</p>
                                </div>
                                <div className="md:col-span-2 space-y-1.5 p-4 bg-[#F5F4EF]/30 rounded-2xl border border-transparent hover:border-[#FACD15]/20 transition-all">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1F3F34]/40">Official Website</label>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-black text-[#1F3F34]">{profile?.companyWebsite || "https://acme.com"}</p>
                                        <ExternalLink className="w-4 h-4 text-[#FACD15]" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-3 pt-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1F3F34]/40 px-1">About Company</label>
                                    <div className="text-sm leading-relaxed text-[#1F3F34]/70 font-medium bg-[#F5F4EF]/50 p-6 rounded-3xl border border-[#EFEEE9]">
                                        {profile?.profileBio || "Acme Constructions is a leading infrastructure and facility management firm operating across Southern India. We specialize in high-density commercial developments and maintain a dedicated workforce of over 500+ verified professionals."}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Personal Protocol & Activity Column */}
                    <div className="md:col-span-12 lg:col-span-5 space-y-8">
                        <section className="bg-[#1F3F34] text-[#F5F4EF] rounded-lg p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#FACD15] opacity-5 rounded-full -mb-16 -mr-16 group-hover:scale-125 transition-transform duration-700"></div>
                            
                            <h4 className="text-xl font-black mb-8 flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-xl">
                                    <ShieldCheck className="w-6 h-6 text-[#FACD15]" />
                                </div>
                                Personal Protocol
                            </h4>

                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center gap-5 group/item">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover/item:bg-[#FACD15]/10 transition-colors">
                                        <Mail className="w-5 h-5 text-[#FACD15]" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Primary Protocol Email</label>
                                        <p className="text-sm font-black">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 group/item">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover/item:bg-[#FACD15]/10 transition-colors">
                                        <MapPin className="w-5 h-5 text-[#FACD15]" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Work Location</label>
                                        <p className="text-sm font-black">{profile?.city || "Chennai HQ Office"}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#FACD15]/10 flex items-center justify-center">
                                                <Verified className="w-5 h-5 text-[#FACD15]" />
                                            </div>
                                            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Trust Score</label>
                                        </div>
                                        <span className="text-xl font-black text-[#FACD15]">98/100</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#FACD15] w-[98%] shadow-[0_0_15px_rgba(250,205,21,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-lg p-8 shadow-sm border-2 border-[#F5F4EF] hover:border-[#FACD15]/30 transition-colors">
                            <h4 className="text-[10px] font-black text-[#1F3F34]/30 uppercase tracking-[0.3em] mb-6">Recent Activity</h4>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 shadow-[0_0_8px_rgba(34,197,94,0.4)] group-hover:scale-125 transition-transform"></div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-[#1F3F34]">Hired 3 Electricians</p>
                                        <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-tighter">2 hours ago • Project OMR-1</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FACD15] mt-1.5 shadow-[0_0_8px_rgba(250,205,21,0.4)] group-hover:scale-125 transition-transform"></div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-[#1F3F34]">Posted New Job Request</p>
                                        <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-tighter">Yesterday • Acme Constructions</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Section */}
                <footer className="pt-12 border-t border-[#1F3F34]/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F3F34]/20 italic">
                        © 2024 TrustHire Global. Protocol Activated.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 hover:text-[#FACD15] transition-colors">Privacy Policy</a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 hover:text-[#FACD15] transition-colors">System Health</a>
                    </div>
                </footer>
            </main>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1F3F34]/40 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-[#F5F4EF] flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-[#1F3F34]">Update Profile</h3>
                                <p className="text-xs font-bold text-[#1F3F34]/40 uppercase tracking-widest mt-1">Acme Constructions Protocol</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F4EF] hover:bg-red-50 text-[#1F3F34]/40 hover:text-red-600 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form className="p-8 space-y-6 max-h-[70vh] overflow-y-auto" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            updateMutation.mutate({
                                companyName: formData.get('companyName') as string,
                                industry: formData.get('industry') as string,
                                companyWebsite: formData.get('companyWebsite') as string,
                                profileBio: formData.get('profileBio') as string,
                                city: formData.get('city') as string,
                            });
                        }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Company Name" name="companyName" defaultValue={profile?.companyName} icon={<Building2 className="w-4 h-4" />} />
                                <FormInput label="Industry" name="industry" defaultValue={profile?.industry} icon={<Briefcase className="w-4 h-4" />} />
                                <FormInput label="Official Website" name="companyWebsite" defaultValue={profile?.companyWebsite} icon={<Globe className="w-4 h-4" />} />
                                <FormInput label="Location" name="city" defaultValue={profile?.city} icon={<MapPin className="w-4 h-4" />} />
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/60 px-1">About Company</label>
                                    <textarea 
                                        name="profileBio"
                                        defaultValue={profile?.profileBio}
                                        rows={4}
                                        className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-3xl p-4 text-sm font-bold text-[#1F3F34] focus:outline-none transition-all placeholder-[#1F3F34]/20"
                                        placeholder="Describe your enterprise protocol..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="flex-1 bg-[#1F3F34] text-[#FACD15] py-4 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-[#1F3F34]/20"
                                >
                                    {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 group-hover:scale-125 transition-transform" />}
                                    Submit
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-8 bg-[#F5F4EF] text-[#1F3F34]/40 py-4 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-neutral-100 transition-all hover:text-[#1F3F34]"
                                >
                                    Cancel
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
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/60 px-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1F3F34]/30 group-focus-within:text-[#FACD15] transition-colors">
                    {icon}
                </div>
                <input 
                    type="text"
                    name={name}
                    defaultValue={defaultValue}
                    className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full pl-12 pr-6 py-3.5 text-sm font-bold text-[#1F3F34] focus:outline-none transition-all placeholder-[#1F3F34]/20"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                />
            </div>
        </div>
    );
}
