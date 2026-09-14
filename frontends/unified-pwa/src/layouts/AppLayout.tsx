import { useState } from 'react';
import { DashboardSidebar, MobileNav } from '../modules/dashboard/features/DashboardSidebar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0A1931] flex selection:bg-[#FACD15] selection:text-[#0A1931]">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden pt-14 md:pt-0">
        <MobileNav onMenuClick={() => setIsSidebarOpen(true)} />
        <Outlet context={{ setIsSidebarOpen, isSidebarOpen }} />
      </div>
    </div>
  );
}
