import { UserButton } from "../components/UserButton";
import { ProfileCard, ActionGrid, BottomNav } from '../features/dashboard/DashboardComponents';
import { DashboardSidebar } from '../features/dashboard/DashboardSidebar';
import { useQuery } from '@tanstack/react-query';
import { searchJobs } from '../api/search.service';
import { profileService } from '../api/profile.service';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { NotificationCenter } from '../features/notifications/NotificationCenter';
import { BriefcaseIcon, MapPin, Search, Globe, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  const { data: jobs } = useQuery({ 
    queryKey: ['nearbyJobs', profile?.location, coords], 
    queryFn: () => searchJobs('', '', profile?.location || '', coords?.lat, coords?.lon, 50),
    staleTime: 60000 
  });

  return (
    <div className="min-h-screen w-full bg-brand-bg text-brand-secondary flex selection:bg-brand-primary selection:text-brand-secondary">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
        
        <header className="p-8 flex justify-between items-center border-b border-brand-border sticky top-0 bg-brand-bg/80 backdrop-blur-2xl z-40 md:hidden">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="w-6 h-6 text-brand-primary" />
             </div>
             <span className="text-xl font-semibold tracking-tight text-brand-secondary">TrustPro</span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <div className="relative">
                <UserButton />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-brand-bg shadow-sm">
                    <ShieldCheck className="w-2.5 h-2.5" />
                </div>
            </div>
          </div>
        </header>

        <main className="p-8 md:p-16 max-w-7xl mx-auto w-full space-y-12 pb-32 md:pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-12">
               <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2 hidden md:block"
               >
                 <div className="flex items-center gap-2 text-brand-secondary/40 font-semibold tracking-widest text-[10px]">
                    <Globe className="w-3 h-3 text-brand-primary" /> Professional repository
                 </div>
                 <h1 className="text-6xl font-semibold tracking-tighter text-brand-secondary leading-[0.9]">{t('dashboard.title')}</h1>
                 <p className="text-brand-muted font-medium text-lg opacity-60">{t('dashboard.welcome')}</p>
               </motion.div>
            </div>
            
            <div className="lg:col-span-4 space-y-10">
               <ProfileCard />
               <ActionGrid />
            </div>

            <section className="lg:col-span-8 space-y-10">
              <div className="flex justify-between items-end border-b border-brand-border pb-6">
                <div className="space-y-1">
                    <h3 className="text-3xl font-semibold tracking-tight text-brand-secondary">Opportunities</h3>
                    <p className="text-brand-muted font-semibold text-[10px] tracking-widest">{t('dashboard.jobsNearYou')}</p>
                </div>
                <button 
                  onClick={() => navigate('/search')}
                  className="px-6 py-2 bg-white border border-brand-border text-[9px] text-brand-secondary font-semibold tracking-widest cursor-pointer hover:bg-brand-secondary hover:text-brand-primary transition-all rounded-full"
                >
                  {t('dashboard.viewAll')}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                {jobs?.slice(0, 4).map((job, i) => (
                  <motion.div 
                    key={job.jobId} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[2.5rem] bg-white border border-brand-border space-y-6 shadow-sm hover:shadow-2xl hover:border-brand-primary transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-bl-full pointer-events-none group-hover:bg-brand-primary/[0.15] transition-colors" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                            <h4 className="font-semibold text-xl text-brand-secondary group-hover:text-brand-primary transition-colors line-clamp-1 tracking-tight">{job.title}</h4>
                            <div className="flex items-center gap-2 text-brand-muted/60 font-medium text-xs">
                                <MapPin className="w-3.5 h-3.5" /> {job.location}
                            </div>
                        </div>
                         <div className="bg-brand-bg px-4 py-2 rounded-xl text-emerald-600 font-semibold text-sm shadow-sm border border-brand-border">
                            ₹{job.budget?.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-brand-bg border border-brand-border rounded-lg text-[9px] font-semibold tracking-widest text-brand-muted">{job.industry}</span>
                        <div className="flex items-center gap-1.5 ml-auto text-[9px] font-semibold text-brand-primary py-1 px-3 bg-brand-secondary border border-brand-secondary rounded-lg tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> TrustVerified
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/job/${job.jobId}`)}
                      className="w-full py-4 bg-brand-secondary text-brand-primary rounded-[1.5rem] font-semibold active:scale-95 transition-all text-xs cursor-pointer shadow-xl shadow-brand-secondary/10 hover:bg-neutral-800 tracking-widest group-hover:translate-y-[-2px]"
                    >
                      {t('dashboard.quickApply')}
                    </button>
                  </motion.div>
                ))}
                
                {(!jobs || jobs.length === 0) && (
                  <div className="col-span-full p-20 rounded-[3rem] bg-white border border-dashed border-brand-border text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto opacity-20">
                        <Search className="w-8 h-8 text-brand-secondary" />
                    </div>
                    <p className="text-brand-muted font-medium">{t('dashboard.noJobs')}</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>

        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
