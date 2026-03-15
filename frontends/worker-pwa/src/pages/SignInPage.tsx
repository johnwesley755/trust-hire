import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import apiClient from '../api/apiClient';
import { Mail, Lock, Loader2, ArrowRight, Briefcase } from 'lucide-react';
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
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-brand-bg font-sans selection:bg-brand-primary selection:text-brand-secondary overflow-hidden">
            {/* Left Column: Form Section */}
            <div className="flex flex-col justify-center px-8 lg:px-24 py-16 relative z-10">
                <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
                
                <div className="mb-20">
                     <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-14 h-14 bg-brand-secondary rounded-[1.5rem] flex items-center justify-center group-hover:bg-brand-primary group-hover:text-brand-secondary transition-all shadow-xl">
                            <Briefcase className="w-8 h-8 text-brand-primary transition-colors" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold tracking-tight text-neutral-900 uppercase leading-none">TrustPro</span>
                            <span className="text-[10px] font-medium text-brand-primary uppercase tracking-[0.3em] mt-1.5">Professional Network</span>
                        </div>
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto lg:mx-0 relative text-left">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-6xl font-bold text-neutral-900 tracking-tight leading-[1.1] mb-6">
                            Secure <br />
                            <span className="text-brand-primary font-bold italic">Entry.</span>
                        </h1>
                        <p className="text-brand-muted font-medium text-lg leading-relaxed">
                            Access your professional profile and manage your career advancement.
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-5 bg-brand-accent/5 border-l-4 border-brand-accent text-brand-accent font-bold text-xs rounded-r-2xl flex items-center gap-4 uppercase tracking-widest"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 text-brand-secondary font-medium focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center pr-1">
                                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Password</label>
                                <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-brand-muted hover:text-brand-primary transition-colors">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 text-brand-secondary font-medium focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full bg-brand-secondary text-brand-primary font-semibold py-6 rounded-4xl shadow-2xl hover:bg-neutral-800 active:scale-[0.99] flex items-center justify-center gap-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl uppercase tracking-widest mt-6"
                        >
                            {isLoading ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-6 h-6" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-16 pt-8 border-t border-brand-border/30 text-center lg:text-left">
                        <p className="text-brand-muted font-bold text-xs uppercase tracking-widest leading-relaxed">
                            New to the platform?{' '}
                            <Link to="/sign-up" className="text-brand-secondary hover:text-brand-primary transition-colors ml-2 border-b-2 border-brand-primary">
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
                        className="w-full h-full object-cover brightness-[0.4] grayscale-[0.2] scale-105"
                    />
                </div>
                
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-brand-secondary/0 via-brand-secondary/20 to-brand-secondary/90" />
                <div className="absolute inset-0 cloud-grid opacity-30" />
                
                <div className="relative h-full flex flex-col justify-end p-24 z-10 text-left">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                         <div className="space-y-6 max-w-lg">
                            <div className="w-24 h-1 bg-brand-primary rounded-full mb-8" />
                            <h3 className="text-7xl font-bold text-white tracking-tight leading-[1] mb-6 italic">
                                Always <br />
                                <span className="text-brand-primary">Working.</span>
                            </h3>
                            <p className="text-xl text-white/50 font-medium leading-relaxed">
                                Sign in to connect with verified enterprise jobs and manage your professional reputation.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
