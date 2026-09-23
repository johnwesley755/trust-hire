import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '../providers/AuthContext';
import { UserAvatar } from '../components/common/UserAvatar';
import { NotificationCenter } from '../modules/dashboard/features/notifications/NotificationCenter';
import { 
  Upload, 
  PlusCircle, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Briefcase,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AppTopNavbar = () => {
  const { user } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isEmployer = user?.role === 'EMPLOYER';

  // Navigation Links
  const workerNavLinks = [
    { name: 'Find Jobs', path: '/search' },
    { name: 'Saved Jobs', path: '/saved-jobs' },
    { name: 'Applied Jobs', path: '/applied-jobs' },
    { name: 'Activity Tracker', path: '/tracker' },
    { name: 'Profile', path: '/profile' },
  ];

  const employerNavLinks = [
    { name: 'Find Workers', path: '/find-workers' },
    { name: 'Saved Profiles', path: '/saved-profiles' },
    { name: 'Post a Job', path: '/post-job' },
    { name: 'My Active Jobs', path: '/jobs' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/profile' },
  ];

  const navLinks = isEmployer ? employerNavLinks : workerNavLinks;

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim() 
    : (user?.email?.split('@')[0] || 'My Account');

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs text-[#0A1931] select-none font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Left: Prominent TrustHyre Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50/90 border border-blue-100 p-1 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <img 
                src="/logo.png" 
                alt="TrustHyre" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex items-baseline">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0A1931] font-['Outfit',sans-serif]">
                Trust<span className="text-[#0066FF]">Hyre</span>
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path === '/search' && location.pathname === '/');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all rounded-lg ${
                    isActive 
                      ? 'text-[#0A1931] font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#0066FF] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: CTA + Notifications + Profile Menu */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          
          {/* Quick CTA Action Button */}
          {isEmployer ? (
            <Link
              to="/post-job"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold shadow-md shadow-[#0066FF]/25 transition-all cursor-pointer font-['Outfit',sans-serif]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post a Job</span>
            </Link>
          ) : (
            <Link
              to="/profile"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] border border-blue-200 text-xs font-bold transition-all cursor-pointer font-['Outfit',sans-serif]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Resume</span>
            </Link>
          )}

          {/* Notification Center */}
          <div className="relative">
            <NotificationCenter />
          </div>

          {/* User Profile Dropdown Pill */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
            >
              <UserAvatar
                src={user?.profileImageUrl}
                name={displayName}
                size="sm"
              />
              <span className="hidden lg:block text-xs font-bold text-slate-800 max-w-[120px] truncate font-['Outfit',sans-serif]">
                {displayName}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Modal */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 text-[#0A1931] z-50 font-sans"
                >
                  {/* User Profile Card Header */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar
                        src={user?.profileImageUrl}
                        name={displayName}
                        size="md"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate font-['Outfit',sans-serif]">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium truncate">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-[#0066FF] text-[9px] font-extrabold rounded-md uppercase tracking-wider">
                          {isEmployer ? 'Verified Employer' : 'Specialist Worker'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer text-left"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate(isEmployer ? '/saved-profiles' : '/saved-jobs');
                      }}
                      className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer text-left"
                    >
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      <span>{isEmployer ? 'Saved Profiles' : 'Saved Jobs'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer text-left"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Account Settings</span>
                    </button>
                  </div>

                  {/* Divider & Sign Out */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-[#0066FF] rounded-xl bg-slate-100 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 shadow-lg"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-[#0066FF]' 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {isEmployer ? (
                <Link
                  to="/post-job"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 bg-[#0066FF] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post a Job</span>
                </Link>
              ) : (
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 bg-blue-50 text-[#0066FF] border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Resume</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
