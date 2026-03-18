import { useState } from "react";
import { useAuth, useUser } from "../providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, type WorkerProfile } from "../api/profile.service";
import apiClient from "../api/apiClient";
import { User, Mail, MapPin, Award, LogOut, ChevronRight, ShieldCheck, Navigation, Camera, Loader2, Globe, Star, Clock } from "lucide-react";
import { DashboardSidebar } from "../features/dashboard/DashboardSidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { logout } = useAuth();
  const { user } = useUser();
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<WorkerProfile>) => profileService.updateProfile({ ...profile!, ...updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
      setIsEditingLocation(false);
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
      }
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      alert(err.response?.data?.message || "Failed to update profile image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUpdateLocation = () => {
    updateMutation.mutate({ location: locationInput, address: locationInput });
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsEditingLocation(true);
      setLocationInput("Detecting GPS...");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          let newAddress = "Current Location (GPS)";
          let newCity = "";
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await response.json();
            newAddress = data.display_name;
            newCity = data.address.city || data.address.town || data.address.village || data.address.suburb || "";
          } catch (err) {
             console.error("Reverse geocoding failed", err);
          }
          
          setLocationInput(newAddress);
          updateMutation.mutate({ 
            latitude, 
            longitude,
            location: newAddress,
            address: newAddress,
            city: newCity
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocationInput("GPS Failed");
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex text-brand-secondary selection:bg-brand-primary selection:text-brand-secondary">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
        
        <header className="p-8 lg:p-12 border-b border-brand-border bg-brand-bg/80 backdrop-blur-3xl sticky top-0 z-40">
            <div className="max-w-3xl mx-auto space-y-2">
                <div className="flex items-center gap-2 text-brand-secondary/40 font-semibold tracking-widest text-[10px]">
                    <Globe className="w-3.5 h-3.5 text-brand-primary" /> Identity & Integrity
                </div>
                <h1 className="text-5xl font-semibold tracking-tighter text-brand-secondary leading-[0.9]">Professional dossier</h1>
                <p className="text-brand-muted font-medium text-lg opacity-60">Management of your verified credentials and network presence.</p>
            </div>
        </header>

        <main className="max-w-3xl mx-auto p-8 lg:p-12 w-full space-y-12 relative z-10 pb-32">
            {/* Dossier Header Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-brand-border rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary opacity-[0.03] rounded-bl-full pointer-events-none" />
                
                <div className="flex flex-col items-center gap-8 relative z-10">
                    <div className="relative group/photo cursor-pointer">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                            title="Update Profile Image"
                        />
                         <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-8 border-brand-bg shadow-2xl relative group-hover/photo:scale-105 transition-all bg-brand-bg">
                            {user?.profileImageUrl ? (
                                <img 
                                    src={user.profileImageUrl} 
                                    alt={user.firstName || ""} 
                                    className={`w-full h-full object-cover grayscale-[0.1] transition-opacity ${isUploadingImage ? 'opacity-50' : ''}`}
                                />
                            ) : (
                                <div className="w-full h-full bg-brand-bg flex items-center justify-center">
                                    <User className="w-16 h-16 text-brand-secondary/10" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-brand-secondary/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity backdrop-blur-sm">
                                <Camera className="w-10 h-10 text-brand-primary" />
                            </div>
                        </div>

                        {isUploadingImage && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center z-20">
                                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                            </div>
                        )}

                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl border-4 border-white shadow-xl rotate-6">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-4xl font-semibold tracking-tight text-brand-secondary">{user?.firstName} {user?.lastName}</h2>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-[10px] font-semibold text-brand-primary tracking-widest bg-brand-secondary px-4 py-1 rounded-full">Verified professional</span>
                                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <AnimatePresence mode="wait">
                                {isEditingLocation ? (
                                    <motion.div 
                                        key="location-edit"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col sm:flex-row gap-3 bg-brand-bg p-3 rounded-2xl border border-brand-border"
                                    >
                                        <input 
                                            type="text" 
                                            value={locationInput} 
                                            onChange={(e) => setLocationInput(e.target.value)}
                                            placeholder="Enter operating base..."
                                            className="bg-white border border-brand-border rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary text-brand-secondary"
                                        />
                                        <div className="flex gap-2">
                                             <button 
                                                onClick={useCurrentLocation}
                                                className="bg-brand-secondary text-brand-primary px-4 py-2 rounded-xl text-[10px] font-semibold tracking-widest flex items-center gap-2 hover:bg-neutral-800 transition-colors"
                                            >
                                                <Navigation className="w-3 h-3" /> GPS
                                            </button>
                                            <button 
                                                onClick={handleUpdateLocation}
                                                className="bg-brand-primary text-brand-secondary px-4 py-2 rounded-xl text-[10px] font-semibold tracking-widest hover:bg-amber-500 transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                onClick={() => setIsEditingLocation(false)}
                                                className="bg-white text-brand-muted px-4 py-2 rounded-xl text-[10px] font-semibold tracking-widest border border-brand-border hover:bg-brand-bg transition-colors"
                                            >
                                                Exit
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            setLocationInput(profile?.location || "");
                                            setIsEditingLocation(true);
                                        }}
                                        className="flex items-center gap-2 px-6 py-2 bg-brand-bg rounded-full border border-brand-border text-brand-secondary hover:text-brand-secondary hover:border-brand-primary transition-all text-sm font-medium group"
                                    >
                                        <MapPin className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform" /> 
                                        {profile?.location || "No Operating Base Defined"}
                                    </button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Account Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-brand-border rounded-[2.5rem] p-10 space-y-8 shadow-sm">
                    <div className="space-y-1">
                         <h3 className="text-xl font-bold text-brand-secondary tracking-tighter">Core account</h3>
                         <p className="text-[9px] font-semibold text-brand-secondary/40 tracking-widest">Digital identity details</p>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center text-brand-secondary/20 border border-brand-border shadow-inner">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[8px] text-brand-muted font-semibold tracking-widest">Full name</p>
                                <p className="font-semibold text-brand-secondary tracking-tight">{user?.firstName} {user?.lastName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center text-brand-secondary/20 border border-brand-border shadow-inner">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[8px] text-brand-muted font-semibold tracking-widest">Verified email</p>
                                <p className="font-semibold text-brand-secondary tracking-tight">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-brand-border rounded-[2.5rem] p-10 space-y-8 shadow-sm">
                    <div className="space-y-1">
                         <h3 className="text-xl font-bold text-brand-secondary tracking-tighter">Market value</h3>
                         <p className="text-[9px] font-semibold text-brand-secondary/40 tracking-widest">Professional standing</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-brand-bg rounded-2xl border border-brand-border flex flex-col gap-2">
                             <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-brand-primary" />
                                <span className="text-[10px] text-brand-muted font-semibold tracking-tighter">Ranking</span>
                             </div>
                             <p className="text-3xl font-bold text-brand-secondary tracking-tighter">Lv {profile?.level || '1'}</p>
                        </div>
                        <div className="p-6 bg-brand-secondary rounded-2xl border border-brand-secondary flex flex-col gap-2 shadow-xl shadow-brand-secondary/10">
                             <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-brand-primary fill-brand-primary" />
                                <span className="text-[10px] text-brand-primary/60 font-semibold tracking-tighter">Reputation</span>
                             </div>
                             <p className="text-3xl font-bold text-brand-primary tracking-tighter">4.9</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-brand-bg rounded-2xl border border-brand-border">
                        <div className="flex items-center gap-3">
                             <Clock className="w-5 h-5 text-brand-primary" />
                             <span className="text-xs font-semibold text-brand-muted tracking-widest">History</span>
                        </div>
                        <span className="text-xl font-semibold text-brand-secondary tracking-tight">{profile?.experienceYears || 0} YRS</span>
                    </div>
                </div>
            </section>

            {/* Expertise Section */}
            <section className="bg-white border border-brand-border rounded-[3rem] p-12 space-y-10 shadow-sm relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-secondary opacity-[0.02] rounded-tl-full pointer-events-none" />
                
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-brand-secondary tracking-tighter">Expertise matrix</h3>
                    <p className="text-[10px] font-semibold text-brand-secondary/40 tracking-widest">Skill sets & Domain experience</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    {profile?.skills?.split(',').map((skill, i) => (
                        <motion.span 
                            key={skill.trim()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="px-6 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-semibold tracking-widest text-brand-secondary shadow-sm hover:border-brand-primary transition-colors hover:bg-white"
                        >
                            {skill.trim()}
                        </motion.span>
                    ))}
                    {!profile?.skills && (
                        <p className="text-brand-muted text-sm">No expertise defined. Update your protocol.</p>
                    )}
                </div>
            </section>

            {/* Operational Actions */}
            <div className="space-y-6">
                 <button className="w-full bg-white border border-brand-border p-8 rounded-[2rem] flex items-center justify-between group hover:border-brand-primary transition-all shadow-xl hover:-translate-y-1">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-brand-secondary text-brand-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Award className="w-7 h-7" />
                        </div>
                        <div className="text-left space-y-1">
                            <span className="text-xl font-bold text-brand-secondary tracking-tighter">Certification vault</span>
                            <p className="text-[9px] text-brand-muted font-semibold tracking-widest">Verify additional credentials</p>
                        </div>
                    </div>
                    <div className="p-3 bg-brand-bg rounded-xl group-hover:bg-brand-secondary group-hover:text-brand-primary transition-all">
                        <ChevronRight className="w-5 h-5 text-brand-muted" />
                    </div>
                </button>
                
                <button 
                    onClick={logout}
                    className="w-full bg-brand-accent/5 border border-brand-accent/10 p-8 rounded-[2rem] flex items-center justify-between group hover:bg-brand-accent transition-all shadow-sm"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-brand-accent text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <LogOut className="w-7 h-7" />
                        </div>
                         <div className="text-left space-y-1">
                            <span className="text-xl font-bold text-brand-accent group-hover:text-white tracking-tighter transition-colors">Terminate session</span>
                            <p className="text-[9px] text-brand-accent/50 group-hover:text-white/60 font-semibold tracking-widest transition-colors">Close all professional interfaces</p>
                        </div>
                    </div>
                    <div className="p-3 bg-brand-accent/10 rounded-xl group-hover:bg-white/20 transition-all">
                        <ChevronRight className="w-5 h-5 text-brand-accent group-hover:text-white transition-colors" />
                    </div>
                </button>
            </div>
            
            <div className="text-center pt-8">
                <p className="text-[10px] font-semibold text-brand-secondary/20 tracking-widest">TrustPro Dossier System v2.1.0 • Verified Network</p>
            </div>
        </main>
      </div>
    </div>
  );
}
