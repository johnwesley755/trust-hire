import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthContext';
import apiClient from '../../../api/apiClient';
import { AuthVisualHero } from '../components/AuthVisualHero';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  User, 
  ChevronRight, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Zap 
} from 'lucide-react';

export const SignInPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryRole = searchParams.get('role')?.toUpperCase();
    const [activeRole, setActiveRole] = useState<'WORKER' | 'EMPLOYER'>(queryRole === 'EMPLOYER' ? 'EMPLOYER' : 'WORKER');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { user, isSignedIn, login, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    // Auto redirect when user becomes signed in
    React.useEffect(() => {
        if (isSignedIn && user) {
            const target = user.role === 'EMPLOYER' ? '/dashboard' : '/search';
            navigate(target, { replace: true });
        }
    }, [isSignedIn, user, navigate]);

    // Keep activeRole synced if query param changes
    React.useEffect(() => {
        if (queryRole === 'EMPLOYER' && activeRole !== 'EMPLOYER') {
            setActiveRole('EMPLOYER');
        } else if (queryRole === 'WORKER' && activeRole !== 'WORKER') {
            setActiveRole('WORKER');
        }
    }, [queryRole]);

    const handleRoleToggle = (newRole: 'WORKER' | 'EMPLOYER') => {
        setActiveRole(newRole);
        setSearchParams({ role: newRole.toLowerCase() });
        setError('');
    };

    const handleStandardSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/api/auth/login', { email, password, role: activeRole });
            const userData = response.data.user;
            login(response.data.token, userData);
            navigate(userData.role === 'WORKER' ? '/search' : '/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password. Please verify your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoQuickFill = (roleToFill: 'WORKER' | 'EMPLOYER') => {
        if (roleToFill === 'WORKER') {
            setEmail('worker@trusthyre.com');
            setPassword('password123');
        } else {
            setEmail('employer@trusthyre.com');
            setPassword('password123');
        }
    };

    const isCandidate = activeRole === 'WORKER';

    return (
        <div className="min-h-screen bg-[#F0F2F6] flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans">
            
            {/* Main Auth Card Container */}
            <div className="w-full max-w-5xl bg-white rounded-3xl md:rounded-[32px] shadow-2xl shadow-slate-300/40 border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] transition-all">
                
                {/* Left Side: Scenic Brand Visual Hero */}
                <div className="md:col-span-5 lg:col-span-5 hidden md:block">
                    <AuthVisualHero role={activeRole} />
                </div>

                {/* Right Side: Clean Modern Form */}
                <div className="md:col-span-7 lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative bg-white">
                    
                    {/* Top Right Portal Switcher Affordance */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 mb-6">
                        {/* Mobile Brand Logo */}
                        <div className="md:hidden">
                            <Link to="/" className="flex items-center gap-2">
                                <img src="/logo.png" alt="TrustHyre Logo" className="w-8 h-8 object-contain" />
                                <span className="text-xl font-black text-[#0A1931]">
                                    Trust<span className="text-[#0066FF]">Hyre</span>
                                </span>
                            </Link>
                        </div>

                        {/* Switcher Pill Button */}
                        <button
                            type="button"
                            onClick={() => handleRoleToggle(isCandidate ? 'EMPLOYER' : 'WORKER')}
                            className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-all text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200/60"
                        >
                            {isCandidate ? (
                                <Building2 className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#0066FF] transition-colors" />
                            ) : (
                                <User className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#0066FF] transition-colors" />
                            )}
                            <span className="font-['Outfit',sans-serif]">
                                {isCandidate ? 'For Companies' : 'For Job Seekers'}
                            </span>
                            <span className="w-5 h-5 rounded-full bg-linear-to-r from-[#0066FF] to-[#38BDF8] text-white flex items-center justify-center text-[10px] group-hover:translate-x-0.5 transition-transform shadow-2xs">
                                <ChevronRight className="w-3 h-3" />
                            </span>
                        </button>
                    </div>

                    {/* Centered Form Area */}
                    <div className="max-w-md w-full mx-auto my-auto py-2">
                        
                        {/* Title & Subtitle */}
                        <div className="mb-6">
                            <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
                                {isCandidate ? 'Candidate Sign In' : 'Employer Sign In'}
                            </h1>
                            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                {isCandidate 
                                    ? 'Access verified jobs, real-time match alerts, and direct payouts.' 
                                    : 'Hire pre-screened professionals and manage hiring pipeline.'}
                            </p>
                        </div>

                        {/* Error Alert Toast */}
                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2.5 shadow-2xs"
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Sign In Form */}
                        <form onSubmit={handleStandardSubmit} className="space-y-4">
                            
                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                                    {isCandidate ? 'Username or email' : 'Business email'}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={isCandidate ? 'Enter your username or email' : 'Enter your company email'}
                                    required
                                    className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0066FF] rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none focus:ring-3 focus:ring-[#0066FF]/15"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                                        Password
                                    </label>
                                    <Link 
                                        to="/forgot-password" 
                                        className="text-xs font-semibold text-slate-500 hover:text-[#0066FF] transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0066FF] rounded-xl px-4 py-3 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none focus:ring-3 focus:ring-[#0066FF]/15"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Primary Sign In Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !email || !password}
                                className="w-full mt-2 bg-[#0066FF] hover:bg-[#0052CC] active:scale-[0.99] disabled:opacity-50 text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg hover:shadow-[#0066FF]/35 transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>
                        </form>

                        {/* Sign Up Redirect Link */}
                        <div className="mt-5 text-center">
                            <p className="text-xs sm:text-sm text-slate-600 font-medium">
                                Don't have an account?{' '}
                                <Link 
                                    to={`/sign-up?role=${activeRole.toLowerCase()}`} 
                                    className="font-bold text-[#0A1931] hover:text-[#0066FF] transition-colors"
                                >
                                    Sign up.
                                </Link>
                            </p>
                        </div>

                        {/* OR Divider */}
                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-slate-200"></div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">OR</span>
                            <div className="flex-1 h-px bg-slate-200"></div>
                        </div>

                        {/* Social & Quick Demo Sign In */}
                        <div className="space-y-2.5">
                            {/* Google Sign In */}
                            <button
                                type="button"
                                onClick={() => signInWithGoogle()}
                                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-2xs font-['Outfit',sans-serif]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                <span>Sign in with Google</span>
                            </button>

                            {/* Demo 1-Click Fast Access Button */}
                            <button
                                type="button"
                                onClick={() => handleDemoQuickFill(activeRole)}
                                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span>Fill Demo {isCandidate ? 'Candidate' : 'Employer'} Credentials</span>
                            </button>
                        </div>
                    </div>

                    {/* Bottom Footer Note */}
                    <div className="pt-4 text-center text-[11px] text-slate-400 font-medium">
                        By signing in, you agree to our{' '}
                        <Link to="/terms" className="underline hover:text-slate-600">Terms of Service</Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
                    </div>
                </div>

            </div>

        </div>
    );
};
