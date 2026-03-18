import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import apiClient from '../api/apiClient';
import { Mail, Lock, Loader2, ArrowRight, Briefcase, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

export const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const isFormValid = email && password;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await apiClient.post('/api/auth/login', { email, password });
            login(response.data.token, response.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data || t('auth.signin.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-brand-bg selection:bg-brand-primary selection:text-brand-secondary overflow-hidden">
            {/* Left Column: Form Section */}
            <div className="flex flex-col justify-center px-8 lg:px-24 py-16 relative z-10">
                <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
                
                <div className="mb-20">
                     <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-14 h-14 bg-brand-secondary rounded-[1.5rem] flex items-center justify-center group-hover:scale-105 transition-all shadow-xl">
                            <Briefcase className="w-8 h-8 text-brand-primary" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-3xl font-semibold tracking-tight text-brand-secondary leading-none">TrustPro</span>
                            <span className="text-[10px] font-semibold text-brand-primary tracking-widest mt-1.5">Verified network</span>
                        </div>
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto lg:mx-0 relative text-left">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-2 text-brand-secondary/40 font-semibold tracking-widest text-[10px] mb-4">
                            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" /> Security protocol 4-1
                        </div>
                        <h1 className="text-6xl font-semibold text-brand-secondary tracking-tighter leading-[0.9] mb-6">
                            Secure <br />
                            <span className="text-brand-primary">Entry.</span>
                        </h1>
                        <p className="text-brand-muted font-medium text-lg leading-relaxed opacity-60">
                            Access your professional profile and manage your career advancement on India's Safest App.
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-5 bg-brand-accent/5 border-l-4 border-brand-accent text-brand-accent font-semibold text-xs rounded-r-2xl flex items-center gap-4 tracking-widest"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-semibold tracking-widest text-brand-secondary/40 ml-1">Identity: Digital mail</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-brand-secondary/20 group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 text-brand-secondary font-semibold focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-secondary/10 text-sm shadow-sm"
                                    placeholder="Enter verified email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <div className="flex justify-between items-center pr-1">
                                <label className="text-[10px] font-semibold tracking-widest text-brand-secondary/40 ml-1">Security: Password</label>
                                <a href="#" className="text-[10px] font-semibold tracking-widest text-brand-secondary/40 hover:text-brand-primary transition-colors">Forgot artifact?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-brand-secondary/20 group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 text-brand-secondary font-semibold focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-secondary/10 text-sm shadow-sm"
                                    placeholder="Enter secure password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full bg-brand-secondary text-brand-primary font-semibold py-6 rounded-[2rem] shadow-2xl hover:bg-neutral-800 active:scale-[0.99] flex items-center justify-center gap-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl tracking-widest mt-6"
                        >
                            {isLoading ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                <>Authorize Entry <ArrowRight className="w-6 h-6" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-16 pt-8 border-t border-brand-border/30 text-center lg:text-left">
                        <p className="text-brand-secondary/60 font-semibold text-[10px] tracking-widest leading-relaxed">
                            New to the platform?{' '}
                            <Link to="/sign-up" className="text-brand-secondary hover:text-brand-primary transition-colors ml-2 border-b-2 border-brand-primary px-1">
                                Create Profile
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Hero Section */}
            <div className="hidden lg:block relative bg-brand-secondary overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/images/auth_hero_worker.png" 
                        alt="Join the Professional Network" 
                        className="w-full h-full object-cover brightness-[0.5] grayscale-[0.3] scale-105"
                    />
                </div>
                
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-brand-secondary/0 via-brand-secondary/40 to-brand-secondary/90" />
                <div className="absolute inset-0 cloud-grid opacity-20" />
                
                {/* Premium Amber Glow */}
                <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] bg-brand-primary/10 blur-[150px] rounded-full" />

                <div className="relative h-full flex flex-col justify-end p-24 z-10 text-left">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                         <div className="space-y-6 max-w-lg">
                            <div className="w-24 h-1 bg-brand-primary rounded-full mb-8 shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                            <h3 className="text-7xl font-semibold text-white tracking-tighter leading-[0.9] mb-6">
                                ALWAYS <br />
                                <span className="text-brand-primary">OPERATIONAL.</span>
                            </h3>
                            <p className="text-xl text-white/50 font-medium leading-relaxed">
                                Sign in to connect with verified enterprise jobs and manage your professional reputation in the global marketplace.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
