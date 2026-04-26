import { useState } from 'react';
import { DashboardSidebar } from '../../modules/dashboard/features/DashboardSidebar';
import { DashboardHeader } from '../../modules/dashboard/components/DashboardHeader';
import { Outlet, useLocation } from 'react-router-dom';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const isJobDetailPage = location.pathname.startsWith('/jobs/');
  const isAppliedJobsPage = location.pathname === '/applied-jobs';
  const hideHeaderOnMobile = isProfilePage || isJobDetailPage || isAppliedJobsPage;

  return (
    <div className="min-h-screen w-full bg-[#faf9f4] text-[#1b1c19] flex selection:bg-[#FACD15] selection:text-[#1F3F34] antialiased">
      {/* Background Cloud Grid Overlay */}
      <div className="fixed inset-0 cloud-grid opacity-[0.03] pointer-events-none z-0" />
      
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden z-10">
        <DashboardHeader 
          onMenuClick={() => setIsSidebarOpen(true)} 
          className={hideHeaderOnMobile ? 'hidden lg:flex' : 'flex'}
        />
        <main className="flex-1 transition-all duration-300">
          <Outlet context={{ setIsSidebarOpen }} />
        </main>
      </div>

      <style>{`
        .cloud-grid {
          background-image: 
            linear-gradient(rgba(31, 63, 52, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 63, 52, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glass-header {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .bento-card {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .bento-card:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
}
