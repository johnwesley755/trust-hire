import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthContext';
import apiClient from '../../../api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, Zap } from 'lucide-react';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, user, isSignedIn } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isSignedIn && user?.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isSignedIn, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
        role: 'ADMIN'
      });

      const userData = response.data.user;
      if (userData.role !== 'ADMIN') {
        setError('Access denied: This account does not possess administrator privileges.');
        return;
      }

      login(response.data.token, userData);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Invalid administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@trusthyre.com');
    setPassword('admin12345');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex items-center justify-center p-4 sm:p-6 font-sans text-slate-900 select-none">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Glow / Accent effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-6 relative">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50/90 border border-blue-100 p-1.5 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <img 
                src="/logo.png" 
                alt="TrustHyre" 
                className="w-full h-full object-contain" 
              />
            </div>
          </Link>
          
          <div className="flex items-center justify-center">
            <span className="text-2xl font-black tracking-tight text-[#0A1931] font-['Outfit',sans-serif]">
              Trust<span className="text-[#0066FF]">Hyre</span>
            </span>
          </div>
          <h1 className="text-base font-bold text-slate-700 mt-1">Administrator Command Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">Secure authentication portal for platform administrators</p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@trusthyre.com"
                required
                className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#0066FF] focus:bg-white rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none focus:ring-2 focus:ring-blue-100"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Master Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#0066FF] focus:bg-white rounded-xl px-4 py-3 pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none focus:ring-2 focus:ring-blue-100"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full mt-2 bg-[#0066FF] hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Admin...</span>
              </>
            ) : (
              <span>Sign In to Admin Console</span>
            )}
          </button>
        </form>

        {/* Demo Fill */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Fill Demo Admin Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
};

