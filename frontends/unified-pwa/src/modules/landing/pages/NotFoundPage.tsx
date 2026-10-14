import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Users, ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import trustHyreLogo from '../../../assets/TrustHyre Skills and Opportunities Logo.png';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A1931] flex flex-col justify-between font-sans selection:bg-[#0f2f63] selection:text-white">
      {/* Top Header */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center group py-1" aria-label="TrustHyre Home">
            <img 
              src={trustHyreLogo} 
              alt="TrustHyre" 
              className="h-10 sm:h-12 w-auto object-contain block select-none mix-blend-multiply group-hover:opacity-90 transition-opacity" 
            />
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0f2f63] transition-colors cursor-pointer py-1.5 px-3 rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg w-full text-center space-y-6"
        >
          {/* Badge & Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 text-[#0f2f63] shadow-xs">
            <ShieldAlert className="w-10 h-10 stroke-[1.75]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Error 404
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A1931] tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find the page you&apos;re looking for. It may have been moved, deleted, or never existed.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0f2f63] hover:bg-[#2563c9] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/search"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-[#0A1931] border border-slate-200 text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#0066FF]" />
              <span>Find Jobs</span>
            </Link>
            <Link
              to="/find-workers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-[#0A1931] border border-slate-200 text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Hire Workers</span>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} TrustHyre Technologies. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-[#0066FF] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[#0066FF] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;
