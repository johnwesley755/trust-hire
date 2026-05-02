import { useState } from 'react';
import { DashboardSidebar, MobileNav } from '../modules/dashboard/features/DashboardSidebar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#F5F4EF] text-[#1F3F34] flex selection:bg-[#FACD15] selection:text-[#1F3F34]">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden pt-16 md:pt-0">
        <MobileNav onMenuClick={() => setIsSidebarOpen(true)} />
        <Outlet />
      </div>
    </div>
  );
}
