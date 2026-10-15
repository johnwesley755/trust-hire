import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthContext';
import trustHyreLogo from '../../../assets/TrustHyre Skills and Opportunities Logo.png';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Users, 
  Briefcase, 
  LogOut,
  Building2,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Hiring Companies', path: '/admin/leads', icon: Building2 },
    { label: 'KYC Verifications', path: '/admin/verifications', icon: FileCheck2 },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Job Moderation', path: '/admin/jobs', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#0a0a0a] font-['Onest',system-ui,sans-serif] selection:bg-[#2563c9] selection:text-white flex flex-col">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e6e8ec] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between gap-4">
          
          {/* Left: Official Logo + Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/admin/dashboard" className="flex items-center group py-1 shrink-0" aria-label="TrustHyre Admin Dashboard">
              <img 
                src={trustHyreLogo} 
                alt="TrustHyre" 
                className="h-10 sm:h-12 w-auto object-contain block select-none mix-blend-multiply group-hover:opacity-90 transition-opacity" 
              />
            </Link>

            {/* Desktop Segmented Pill Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-[#f4f4f4] border border-[#e6e8ec]">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0f2f63] text-white shadow-xs'
                          : 'text-[#717784] hover:text-[#0a0a0a] hover:bg-white/60'
                      }`
                    }
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right: Admin Badge & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4f4f4] border border-[#e6e8ec]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-[#0a0a0a] max-w-[140px] truncate">{user?.email || 'Admin Console'}</span>
              <span className="text-[10px] font-bold uppercase text-[#0f2f63] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Super Admin</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f4f4f4] hover:bg-rose-50 text-[#717784] hover:text-rose-600 border border-[#e6e8ec] hover:border-rose-200 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer shadow-xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Sub-Navbar (Pill Strip) */}
      <div className="lg:hidden bg-white border-b border-[#e6e8ec] px-3 py-2 flex overflow-x-auto gap-1.5 shadow-2xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0f2f63] text-white shadow-xs'
                    : 'text-[#717784] hover:text-[#0a0a0a] bg-[#f4f4f4]'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Main Workbench Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#e6e8ec] bg-white py-4 px-6 text-center text-xs text-[#717784]">
        TrustHyre Operations Console • Authenticated Administrator Environment
      </footer>
    </div>
  );
};
