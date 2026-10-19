import { AppTopNavbar } from './AppTopNavbar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0A1931] flex flex-col font-sans">
      {/* Sleek Top Navbar */}
      <AppTopNavbar />
      
      {/* Full Width Main App Content */}
      <main className="flex-1 w-full relative overflow-x-clip">
        <Outlet />
      </main>
    </div>
  );
}
