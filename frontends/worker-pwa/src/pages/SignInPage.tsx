import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import apiClient from '../api/apiClient';
import { Mail, Lock, Loader2, Briefcase } from 'lucide-react';
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
        <div className="min-h-screen bg-brand-bg px-4 py-8 selection:bg-brand-primary selection:text-brand-secondary">
            <div className="absolute inset-0 cloud-grid opacity-[0.04] pointer-events-none" />

            <div className="relative max-w-md mx-auto">
                <Link to="/" className="inline-flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-brand-secondary rounded-2xl flex items-center justify-center shadow-sm">
                        <Briefcase className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                        <div className="text-2xl font-semibold tracking-tight text-brand-secondary">TrustHire</div>
                        <div className="text-[10px] font-semibold tracking-widest text-brand-primary mt-1">Worker sign in</div>
                    </div>
                </Link>

                <div className="bg-white border border-brand-border rounded-[2rem] shadow-sm p-6 sm:p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-brand-secondary">Sign in</h1>
                        <p className="text-sm text-brand-muted mt-2">Access your worker dashboard, applications, and profile.</p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-brand-secondary">Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-2xl border border-brand-border bg-brand-bg py-3.5 pl-11 pr-4 text-sm text-brand-secondary focus:outline-none focus:border-brand-primary"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-brand-secondary">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-brand-border bg-brand-bg py-3.5 pl-11 pr-4 text-sm text-brand-secondary focus:outline-none focus:border-brand-primary"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full rounded-2xl bg-brand-secondary px-4 py-3.5 text-sm font-semibold text-brand-primary transition-all hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-brand-border pt-6 text-sm text-brand-muted">
                        New here?{' '}
                        <Link to="/sign-up" className="font-semibold text-brand-secondary hover:text-brand-primary">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
