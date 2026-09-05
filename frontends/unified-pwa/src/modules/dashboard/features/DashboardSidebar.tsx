import React from 'react';
import { useAuth, useUser } from '../../../providers/AuthContext';
import logo from '../../../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationCenter } from '../features/notifications/NotificationCenter';
import { UserAvatar } from '../../../components/common/UserAvatar';

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isEmployer = user?.role === 'EMPLOYER';

  const employerMenuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Search Workers', icon: 'person_search', path: '/find-workers' },
    { name: 'Post a Job', icon: 'add_circle', path: '/post-job' },
    { name: 'My Active Jobs', icon: 'work', path: '/jobs' },
    { name: 'Applications', icon: 'description', path: '/applications' },
    { name: 'Profile', icon: 'person', path: '/profile' },
  ];

  const workerMenuItems = [
    { name: 'Activity Tracker', icon: 'monitoring', path: '/tracker' },
    { name: 'Find Jobs', icon: 'search', path: '/search' },
    { name: 'Applied Jobs', icon: 'work_history', path: '/applied-jobs' },
    { name: 'Skill Tests', icon: 'psychology', path: '/tests' },
    { name: 'Career Level', icon: 'stars', path: '/level' },
    { name: 'Profile', icon: 'person', path: '/profile' },
  ];

  const menuItems = isEmployer ? employerMenuItems : workerMenuItems;

  const secondaryItems = isEmployer
    ? [
        { name: 'Settings', icon: 'settings', path: '/settings' },
        { name: 'Help & Support', icon: 'help', path: '/help' },
      ]
    : [
        { name: 'Verify Identity', icon: 'verified_user', path: '/verify-identity' },
        { name: 'Settings', icon: 'settings', path: '/settings' },
        { name: 'Help & Support', icon: 'help', path: '/help' },
      ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-60 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 md:w-72 bg-[#132c23] p-6 gap-2 shrink-0 z-70 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:flex flex-col`}
      >
        {/* Logo Section */}
        <div
          className="mb-8 px-2 flex justify-between items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-300">
              <img src={logo} alt="TrustHire" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">TrustHire</h1>
              <p className="text-[10px] font-bold text-[#FACD15] uppercase tracking-wider">
                {isEmployer ? 'Employer Portal' : 'Worker Portal'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-white/50 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Profile Card in Sidebar */}
        <div className="mb-6 px-3 py-3 bg-white/5 rounded-2xl flex items-center gap-3 border border-white/5">
          <UserAvatar
            src={user?.profileImageUrl}
            name={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
            size="md"
          />
          <div className="flex flex-col truncate flex-1 min-w-0">
            <span className="text-xs font-black text-white truncate">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
            </span>
            <span className="text-[9px] text-[#FACD15] font-bold uppercase tracking-wider">
              {isEmployer ? 'Verified Employer' : 'Specialist Worker'}
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1 no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all group ${
                  isActive
                    ? 'bg-[#FACD15] text-[#1F3F34] font-black shadow-lg shadow-[#FACD15]/20'
                    : 'text-white/70 hover:bg-white/5 hover:text-white font-bold'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0", fontSize: '20px' }}
                >
                  {item.icon}
                </span>
                <span className="text-sm tracking-tight">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Secondary & Actions */}
        <div className="mt-auto flex flex-col gap-1 pt-6 border-t border-white/10">
          {secondaryItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigate(item.path)}
              className="flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white transition-all text-left text-xs font-bold"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </button>
          ))}

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 text-red-300/70 hover:text-red-300 transition-all text-left text-xs font-bold mt-1"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              logout
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export const MobileNav = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const navigate = useNavigate();

  return (
    <header className="md:hidden fixed top-0 w-full z-40 bg-[#F5F4EF]/90 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.05)] border-b border-[#EFEEE9]">
      <div className="flex justify-between items-center px-6 py-4 w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="active:scale-95 duration-200 transition-transform w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5"
          >
            <span className="material-symbols-outlined text-[#1F3F34] text-2xl">menu</span>
          </button>
          <h1
            className="text-xl font-black tracking-tight text-[#1F3F34] cursor-pointer"
            onClick={() => navigate('/')}
          >
            TrustHire
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <NotificationCenter />
        </div>
      </div>
    </header>
  );
};
