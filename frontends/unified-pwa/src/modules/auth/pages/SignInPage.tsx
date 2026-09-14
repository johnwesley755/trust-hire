import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthContext';
import apiClient from '../../../api/apiClient';
import { AuthHeader } from '../components/AuthHeader';
import { AuthFooter } from '../components/AuthFooter';
import { motion } from 'framer-motion';

export const SignInPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryRole = searchParams.get('role')?.toUpperCase();
    const [activeRole, setActiveRole] = useState<'WORKER' | 'EMPLOYER'>(queryRole === 'EMPLOYER' ? 'EMPLOYER' : 'WORKER');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const handleRoleToggle = (role: 'WORKER' | 'EMPLOYER') => {
        setActiveRole(role);
        setSearchParams({ role });
        setError('');
    };

    // Worker or Employer Standard Login
    const handleWorkerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/api/auth/login', { email, password });
            const userData = response.data.user;
            login(response.data.token, userData);
            navigate(userData.role === 'WORKER' ? '/search' : '/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 text-slate-900 font-body min-h-screen flex flex-col selection:bg-brand-500 selection:text-[#002117] antialiased">
            <AuthHeader />
            
            <main className="w-full max-w-5xl mx-auto px-4 pt-24 pb-12 flex-1 flex items-center justify-center">
                <div className="w-full bg-white rounded-2xl border border-slate-900/10 shadow-xl overflow-hidden grid md:grid-cols-2">
                    
                    {/* Left Column: Form Content */}
                    <div className="p-6 md:p-10 flex flex-col justify-center">
                        
                        {/* Role Switcher Pill */}
                        <div className="flex bg-slate-50 p-1 rounded-xl mb-6 border border-slate-900/10">
                            <button
                                type="button"
                                onClick={() => handleRoleToggle('WORKER')}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                                    activeRole === 'WORKER' 
                                    ? 'bg-slate-900 text-brand-500 shadow-sm' 
                                    : 'text-slate-900/60 hover:text-slate-900'
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm">badge</span>
                                Skilled Worker
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleToggle('EMPLOYER')}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                                    activeRole === 'EMPLOYER' 
                                    ? 'bg-slate-900 text-brand-500 shadow-sm' 
                                    : 'text-slate-900/60 hover:text-slate-900'
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm">business</span>
                                Employer / Business
                            </button>
                        </div>

                        <div className="mb-6">
                            <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                {activeRole === 'WORKER' ? 'Worker Sign In' : 'Employer Portal Access'}
                            </h1>
                            <p className="text-slate-900/60 text-xs md:text-sm mt-1 font-medium">
                                {activeRole === 'WORKER' 
                                    ? 'Access verified jobs, daily payouts, and skill rewards.' 
                                    : 'Sign in with secure business OTP verification.'}
                            </p>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-base">error</span>
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {/* Form area for both roles */}
                        <div className="space-y-4">
                            {activeRole === 'WORKER' && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => signInWithGoogle()}
                                        className="w-full bg-white border-2 border-slate-900/15 hover:border-brand-500 text-slate-900 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all hover:bg-neutral-50 shadow-sm active:scale-98"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                        </svg>
                                        Continue with Google
                                    </button>
                                    <div className="flex items-center gap-3 my-2">
                                        <div className="flex-1 h-px bg-slate-900/10"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900/40">or with email</span>
                                        <div className="flex-1 h-px bg-slate-900/10"></div>
                                    </div>
                                </>
                            )}

                            <form onSubmit={handleWorkerSubmit} className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                                        {activeRole === 'WORKER' ? 'Email Address' : 'Business Email'}
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={activeRole === 'WORKER' ? 'worker@gmail.com' : 'hr@company.com'}
                                        required
                                        className="w-full bg-slate-50 border border-slate-900/10 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Password</label>
                                        <Link to="/forgot-password" className="text-[10px] font-bold text-slate-900/60 hover:text-brand-500">Forgot?</Link>
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-slate-50 border border-slate-900/10 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !email || !password}
                                    className="w-full mt-2 bg-brand-500 text-slate-900 py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : `Sign In as ${activeRole === 'WORKER' ? 'Worker' : 'Employer'}`}
                                </button>
                            </form>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-900/5 text-center">
                            <p className="text-xs text-slate-900/60 font-medium">
                                Don't have an account?{' '}
                                <Link to={`/sign-up?role=${activeRole}`} className="text-slate-900 font-bold underline hover:text-brand-500">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Visual Brand Card */}
                    <div className="hidden md:flex bg-slate-900 p-8 flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div>
                            <span className="inline-block bg-brand-500 text-[#002117] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider mb-4">
                                Enterprise Verification
                            </span>
                            <h2 className="font-headline text-2xl font-black text-white leading-tight">
                                {activeRole === 'WORKER' 
                                    ? 'Fast Work & Weekly Payouts'
                                    : 'Verified Workforce on Demand'}
                            </h2>
                            <p className="text-white/70 text-xs mt-2 leading-relaxed">
                                {activeRole === 'WORKER'
                                    ? 'Get verified once, receive instant direct job invites nearby, and withdraw earnings directly to your bank account.'
                                    : 'Hire pre-vetted, rated professionals across logistics, construction, and specialized trades in under 24 hours.'}
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mt-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-500 text-[#002117] flex items-center justify-center font-bold">
                                    <span className="material-symbols-outlined text-base">verified</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">
                                        {activeRole === 'WORKER' ? 'Smart Match AI' : 'Instant Business Verification'}
                                    </p>
                                    <p className="text-[10px] text-white/60">
                                        {activeRole === 'WORKER' ? 'Jobs recommended based on your preferences' : 'GST and registration verification in minutes'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-[10px] text-white/40 mt-4 font-mono">
                            TrustHire Protocol v2.4 • Supabase Verified
                        </div>
                    </div>
                </div>
            </main>

            <AuthFooter />
        </div>
    );
};
