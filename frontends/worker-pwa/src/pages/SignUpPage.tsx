import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import apiClient from '../api/apiClient';
import { Mail, Lock, Loader2, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        role: 'WORKER'
    });
    const { t } = useLanguage();
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await apiClient.post('/api/auth/send-otp', { email: formData.email });
            setOtpSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await apiClient.post('/api/auth/register', {
                ...formData,
                otp
            });
            login(response.data.token, response.data.user);
            navigate('/onboarding');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phoneNumber && formData.password;

    if (otpSent) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-2xl mb-4">
                            <ShieldCheck className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('auth.signup.verifyCode')}</h1>
                        <p className="text-slate-500 text-sm">Sent to <span className="font-bold text-slate-900">{formData.email}</span></p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Authentication Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 text-center text-3xl font-bold tracking-[0.5em] text-slate-900 focus:border-emerald-500 transition-all outline-none placeholder:text-slate-200"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || otp.length < 6}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.signup.createAccount')}
                        </button>

                        <button 
                            type="button" 
                            onClick={() => handleSendOtp()}
                            disabled={isLoading}
                            className="w-full text-slate-500 text-sm font-medium hover:text-emerald-600 transition-colors"
                        >
                            {t('auth.signup.resend')}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 text-left">
                <div className="text-left mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">{t('auth.signup.title')}</h1>
                    <p className="text-slate-500 font-medium">{t('auth.signup.subtitle')}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">{t('auth.signup.firstName')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 font-bold focus:border-emerald-500 transition-all outline-none"
                                    placeholder="John"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">{t('auth.signup.lastName')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 font-bold focus:border-emerald-500 transition-all outline-none"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">{t('auth.signin.email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 font-bold focus:border-emerald-500 transition-all outline-none"
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">{t('auth.signup.phoneNumber')}</label>
                            <div className="phone-input-container">
                                <PhoneInput
                                    country={'in'}
                                    value={formData.phoneNumber}
                                    onChange={(value: string, data: { dialCode?: string }) => {
                                        const digits = value.replace(/\D/g, '');
                                        const dialCode = data.dialCode || '';
                                        const subscriber = digits.slice(dialCode.length);
                                        if (subscriber.length <= 10) {
                                            setFormData({...formData, phoneNumber: value});
                                        }
                                    }}
                                    inputProps={{ name: 'phone', required: true }}
                                    containerClass="!w-full"
                                    inputClass="!w-full !h-12 !bg-slate-50 !border-slate-200 !rounded-xl !pl-14 !pr-4 !text-slate-900 !font-bold !text-base focus:!border-emerald-500 !transition-all"
                                    buttonClass="!bg-transparent !border-none !rounded-l-xl !pl-4"
                                    dropdownClass="!rounded-xl !shadow-2xl !border-slate-200 !bg-white"
                                    enableSearch={true}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">{t('auth.signin.password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 font-bold focus:border-emerald-500 transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {t('auth.signup.getOtp')} <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    
                    <style>{`
                        .phone-input-container .react-tel-input .form-control { font-family: inherit; }
                    `}</style>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center text-slate-600">
                    {t('auth.signup.haveAccount')}{' '}
                    <Link to="/sign-in" className="text-emerald-600 font-bold hover:text-emerald-700 ml-1 transition-colors">
                        {t('auth.signin.button')}
                    </Link>
                </div>
            </div>
        </div>
    );
};
