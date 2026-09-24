import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthContext';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Users, 
  Briefcase, 
  LogOut,
  ShieldAlert
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
    { label: 'KYC Verifications', path: '/admin/verifications', icon: FileCheck2 },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Job Moderation', path: '/admin/jobs', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-[#0A1931] font-sans flex flex-col select-none">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-8">
          {/* Official TrustHyre Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50/90 border border-blue-100 p-1 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <img 
                src="/logo.png" 
                alt="TrustHyre" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-xl font-black tracking-tight text-[#0A1931] font-['Outfit',sans-serif]">
                  Trust<span className="text-[#0066FF]">Hyre</span>
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0066FF] block -mt-1">
                Admin Console
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 ml-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#0066FF] text-white shadow-xs shadow-blue-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Right side user & logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-800">{user?.email || 'Admin Master'}</span>
            <span className="text-[10px] font-extrabold uppercase text-[#0066FF]">Super Administrator</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Sub-Navbar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2 flex overflow-x-auto gap-1 shadow-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#0066FF] text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Outlet />
      </main>
    </div>
  );
};

