import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import apiClient from '../api/apiClient';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
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
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center selection:bg-brand-primary selection:text-brand-secondary relative">
            {/* Background Decor */}
            <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            
            <div className="w-full max-w-md relative z-10 px-6 py-12">
                {/* Branding */}
                <div className="flex justify-center mb-12">
                     <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-white/10">
                            <ShieldCheck className="w-6 h-6 text-brand-primary" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-brand-secondary">TrustHire</span>
                    </Link>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-brand-border/30"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-brand-secondary tracking-tight mb-3">
                            Welcome Back
                        </h1>
                        <p className="text-brand-muted font-medium">
                            Sign in to your enterprise account
                        </p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 font-bold text-sm rounded-xl flex items-center gap-3"
                        >
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <span className="text-[10px]">!</span>
                            </div>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-muted ml-1">Work Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-brand-border/30 mr-4 pr-3">
                                    <Mail className="w-4 h-4 text-brand-muted/40 group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-brand-bg/30 border border-brand-border/50 rounded-xl py-4 pl-14 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold text-brand-muted">Password</label>
                                <Link to="/forgot-password" stroke-width="3" className="text-xs font-bold text-brand-primary hover:underline">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-brand-border/30 mr-4 pr-3">
                                    <Lock className="w-4 h-4 text-brand-muted/40 group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-brand-bg/30 border border-brand-border/50 rounded-xl py-4 pl-14 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full bg-brand-secondary text-brand-primary font-bold py-4.5 rounded-xl shadow-lg hover:bg-neutral-900 active:scale-[0.98] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-brand-border/30 text-center">
                        <p className="text-brand-muted font-medium text-sm">
                            Don't have an account?{' '}
                            <Link to="/sign-up" className="text-brand-secondary font-bold hover:text-brand-primary transition-colors ml-1">
                                Create one free
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Footer terms */}
                <p className="text-center mt-12 text-xs text-brand-muted/50 font-medium">
                    © 2026 TrustHire Enterprise. All-Verified Workforce.
                </p>
            </div>
        </div>
    );
};
