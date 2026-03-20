import { DashboardSidebar } from '../../modules/dashboard/features/DashboardSidebar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-brand-bg text-brand-secondary flex selection:bg-brand-primary selection:text-brand-secondary">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden pt-20 md:pt-0">
        <Outlet />
      </div>
    </div>
  );
}
