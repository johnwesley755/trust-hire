import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import apiClient from '../api/apiClient';
import { Mail, Lock, Loader2, ArrowRight, Building2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const isFormValid = email && password;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/api/auth/login', {
                email,
                password
            });
            login(response.data.token, response.data.user);
            navigate('/dashboard');
        } catch (err: unknown) {
            const apiError = err as { response?: { data?: { message?: string } } };
            setError(apiError.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-brand-bg selection:bg-brand-primary selection:text-brand-secondary">
            {/* Left Column: Form Section */}
            <div className="flex flex-col justify-start px-8 lg:px-20 py-12 relative overflow-y-auto max-h-screen custom-scrollbar">
                <div className="mb-12">
                     <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-brand-secondary rounded-2xl flex items-center justify-center group-hover:bg-brand-primary/10 transition-all shadow-sm">
                            <Building2 className="w-7 h-7 text-brand-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold tracking-tight text-brand-secondary uppercase leading-none">TrustHire</span>
                            <span className="text-[10px] font-medium text-brand-muted uppercase tracking-[0.2em] mt-1.5">Business Solutions</span>
                        </div>
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto lg:mx-0 mt-12 lg:mt-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 text-left"
                    >
                        <h1 className="text-6xl font-bold text-brand-secondary tracking-tight leading-[1.1] mb-6">
                            Welcome <br />
                            <span className="text-brand-primary">back.</span>
                        </h1>
                        <p className="text-brand-muted font-medium text-xl max-w-sm leading-relaxed">
                            Sign in to manage your company operations and hiring.
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4 bg-brand-accent/5 border border-brand-accent/20 text-brand-accent font-bold text-sm rounded-2xl flex items-center gap-3"
                        >
                            <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0">
                                <span className="text-[10px]">!</span>
                            </div>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Work Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-brand-surface border border-brand-border rounded-xl py-4.5 pl-12 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all placeholder:text-brand-muted/20"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-brand-surface border border-brand-border rounded-xl py-4.5 pl-12 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all placeholder:text-brand-muted/20"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 text-sm font-bold text-brand-muted cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer appearance-none w-5 h-5 rounded-lg border-2 border-brand-border checked:bg-brand-primary checked:border-brand-primary transition-all cursor-pointer" />
                                    <ShieldCheck className="absolute w-3 h-3 text-brand-secondary left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                                <span className="group-hover:text-brand-secondary transition-colors">Remember me</span>
                            </label>
                            <Link to="/forgot-password" stroke-width="3" className="text-sm font-bold text-brand-secondary border-b border-brand-primary/20 hover:border-brand-primary transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full bg-brand-secondary text-brand-primary font-semibold py-5 rounded-2xl shadow-lg hover:bg-neutral-800 active:scale-[0.99] flex items-center justify-center gap-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl uppercase tracking-widest"
                        >
                            {isLoading ? (
                                <Loader2 className="w-7 h-7 animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-7 h-7" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-brand-border/50 text-center lg:text-left">
                        <p className="text-brand-muted font-medium text-sm">
                            New to TrustHire?{' '}
                            <Link to="/sign-up" className="text-brand-secondary hover:text-brand-primary transition-colors ml-1 border-b border-brand-primary/20 hover:border-brand-primary">
                                Register company
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Hero Section */}
            <div className="hidden lg:block relative bg-brand-secondary overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/images/auth_hero.png" 
                        alt="Join the Network" 
                        className="w-full h-full object-cover brightness-[0.5] grayscale-30"
                    />
                </div>
                
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-brand-secondary/20 via-brand-secondary/40 to-brand-secondary/80" />
                <div className="absolute inset-0 cloud-grid opacity-20" />

                <div className="relative h-full flex flex-col justify-center p-20 z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div className="space-y-4 max-w-lg text-left">
                            <h3 className="text-6xl font-bold text-white tracking-tight leading-[1.1]">
                                Build your <br />
                                <span className="text-brand-primary">Workforce.</span>
                            </h3>
                            <p className="text-xl text-white/70 font-medium leading-relaxed">
                                Access your management dashboard and hire professionals with ease and security.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-10">
                            <div className="glass-card p-8 rounded-3xl border-white/5 bg-white/5 text-left">
                                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <ShieldCheck className="w-6 h-6 text-brand-primary" />
                                </div>
                                <div className="text-[10px] font-medium text-white/40 uppercase tracking-widest mb-1">Infrastructure</div>
                                <div className="text-xl font-semibold text-white">Trust-Verified</div>
                            </div>
                            <div className="glass-card p-8 rounded-3xl border-white/5 bg-white/5 text-left">
                                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <ArrowRight className="w-6 h-6 text-brand-primary" />
                                </div>
                                <div className="text-[10px] font-medium text-white/40 uppercase tracking-widest mb-1">Performance</div>
                                <div className="text-xl font-semibold text-white">Real-time Data</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
