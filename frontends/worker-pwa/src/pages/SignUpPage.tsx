import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import apiClient from '../api/apiClient';
import { Mail, Lock, Loader2, ArrowRight, User, Phone, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        otp: ''
    });
    const { t } = useLanguage();
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!formData.email) {
            setError('Please enter your email first.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await apiClient.post('/api/auth/send-otp', { email: formData.email });
            setOtpSent(true);
        } catch (err) {
            console.error(err);
            setError('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpSent) {
            handleSendOtp();
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const response = await apiClient.post('/api/auth/register', {
                ...formData,
                role: 'WORKER'
            });
            login(response.data.token, response.data.user);
            navigate('/onboarding');
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data || 'Registration failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('auth.signup.title')}</h1>
                    <p className="text-slate-500">{t('auth.signup.subtitle')}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.signup.firstName')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:border-emerald-500 transition-all outline-none"
                                    placeholder="John"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.signup.lastName')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:border-emerald-500 transition-all outline-none"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.signin.email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:border-emerald-500 transition-all outline-none"
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.signup.phoneNumber')}</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:border-emerald-500 transition-all outline-none"
                                placeholder="+1 234 567 890"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.signin.password')}</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:border-emerald-500 transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {otpSent && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.signup.verifyCode')}</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({...formData, otp: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:border-emerald-500 transition-all font-mono tracking-widest outline-none"
                                    placeholder="123456"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : !otpSent ? (
                            <>
                                {t('auth.signup.getOtp')} <ArrowRight className="w-5 h-5" />
                            </>
                        ) : (
                            <>
                                {t('auth.signup.createAccount')} <ShieldCheck className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    
                    {otpSent && (
                        <button 
                            type="button" 
                            onClick={handleSendOtp}
                            className="w-full text-slate-500 text-sm hover:text-emerald-600 transition-colors mt-2"
                        >
                            {t('auth.signup.resend')}
                        </button>
                    )}
                </form>

                <div className="mt-8 text-center text-slate-600">
                    {t('auth.signup.haveAccount')}{' '}
                    <Link to="/sign-in" className="text-emerald-600 font-bold hover:underline underline-offset-4">
                        {t('auth.signin.button')}
                    </Link>
                </div>
            </div>
        </div>
    );
};
