import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Camera, Loader2 } from 'lucide-react';

interface ProfileHeroCardProps {
  user: any;
  profile: any;
  isUploadingImage: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditingLocation: boolean;
  setIsEditingLocation: (isEditing: boolean) => void;
  locationInput: string;
  setLocationInput: (input: string) => void;
  onUpdateLocation: () => void;
  useCurrentLocation: () => void;
}

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
  user,
  profile,
  isUploadingImage,
  onImageUpload,
  isEditingLocation,
  setIsEditingLocation,
  locationInput,
  setLocationInput,
  onUpdateLocation,
  useCurrentLocation,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden group border border-[#1F3F34]/5"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FACD15] opacity-[0.03] rounded-bl-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
        <div className="relative group/photo cursor-pointer shrink-0">
          <input 
            type="file" 
            accept="image/*" 
            onChange={onImageUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
            title="Update Profile Image"
          />
          <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-[#F5F4EF] shadow-2xl relative group-hover/photo:scale-105 transition-all bg-[#F5F4EF]">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt={user.firstName || ""} 
                className={`w-full h-full object-cover grayscale-[0.1] transition-opacity ${isUploadingImage ? 'opacity-50' : ''}`}
              />
            ) : (
              <div className="w-full h-full bg-[#E9E8E3] flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-[#1F3F34]/10">person</span>
              </div>
            )}
            <div className="absolute inset-0 bg-[#1F3F34]/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity backdrop-blur-sm">
              <Camera className="w-10 h-10 text-[#FACD15]" />
            </div>
          </div>

          {isUploadingImage && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-[2rem] flex items-center justify-center z-20">
              <Loader2 className="w-8 h-8 text-[#1F3F34] animate-spin" />
            </div>
          )}

          <div className="absolute -bottom-2 -right-2 bg-[#FACD15] text-[#1F3F34] p-2.5 rounded-xl border-4 border-white shadow-xl rotate-6">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-black text-[#1F3F34] tracking-tight leading-none">
              {profile?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
              <span className="text-[10px] font-black text-[#1F3F34] uppercase tracking-widest bg-[#FACD15] px-3 py-1 rounded-full shadow-sm">Verified Professional</span>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start gap-4 pt-2">
            <AnimatePresence mode="wait">
              {isEditingLocation ? (
                <motion.div 
                  key="location-edit"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col sm:flex-row gap-2 bg-[#F5F4EF] p-2 rounded-2xl border border-[#1F3F34]/10 w-full md:w-auto"
                >
                  <input 
                    type="text" 
                    value={locationInput} 
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter operating base..."
                    className="bg-white border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-[#FACD15] text-[#1F3F34] min-w-[200px]"
                  />
                  <div className="flex gap-1.5">
                    <button 
                      onClick={useCurrentLocation}
                      className="bg-[#1F3F34] text-[#FACD15] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5" /> GPS
                    </button>
                    <button 
                      onClick={onUpdateLocation}
                      className="bg-[#FACD15] text-[#1F3F34] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditingLocation(false)}
                      className="bg-white text-[#1F3F34]/60 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#1F3F34]/10 hover:bg-gray-50 transition-all active:scale-95"
                    >
                      Exit
                    </button>
                  </div>
                </motion.div>
              ) : (
                <button 
                  onClick={() => {
                    setLocationInput(profile?.address || profile?.city || profile?.location || "");
                    setIsEditingLocation(true);
                  }}
                  className="flex items-center gap-2.5 px-6 py-2.5 bg-[#F5F4EF] rounded-full border border-[#1F3F34]/5 text-[#1F3F34] hover:border-[#FACD15] hover:bg-white transition-all text-sm font-bold group shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-[#FACD15] group-hover:scale-110 transition-transform" /> 
                  <span className="opacity-80">
                    {profile?.address || profile?.city || profile?.location || "No Operating Base Defined"}
                  </span>
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
