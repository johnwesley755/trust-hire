import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import { authService } from '../api/auth.service';
import { Mail, Lock, Loader2, User, Briefcase, ShieldCheck } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { AdvancedFileUpload } from '../components/AdvancedFileUpload';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        } | string;
    };
}

export const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        profile_image_url: '',
        role: 'WORKER'
    });
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
            await authService.sendOtp(formData.email);
            setOtpSent(true);
        } catch (err: unknown) {
            const apiError = err as ApiError;
            setError(apiError.response?.data && typeof apiError.response.data === 'object' ? apiError.response.data.message || 'Failed to send OTP' : 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await authService.register({
                ...formData,
                otp
            });
            login(data.token, data.user);
            navigate('/onboarding');
        } catch (err: unknown) {
            const apiError = err as ApiError;
            setError(apiError.response?.data && typeof apiError.response.data === 'object' ? apiError.response.data.message || 'Registration failed' : 'Registration failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phoneNumber && formData.password;

    if (otpSent) {
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
                            <div className="text-[10px] font-semibold tracking-widest text-brand-primary mt-1">Verify account</div>
                        </div>
                    </Link>

                    <div className="bg-white border border-brand-border rounded-[2rem] shadow-sm p-6 sm:p-8">
                        <div className="mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-brand-secondary text-brand-primary flex items-center justify-center mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight text-brand-secondary">Enter OTP</h1>
                            <p className="text-sm text-brand-muted mt-2">We sent a verification code to {formData.email}.</p>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleVerifyAndRegister} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-brand-secondary">OTP code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full rounded-2xl border border-brand-border bg-brand-bg py-4 px-4 text-center text-2xl tracking-[0.35em] text-brand-secondary focus:outline-none focus:border-brand-primary"
                                    placeholder="123456"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-2xl bg-brand-secondary px-4 py-3.5 text-sm font-semibold text-brand-primary transition-all hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Verify and continue'}
                            </button>
                        </form>

                        <button
                            onClick={() => setOtpSent(false)}
                            className="mt-6 text-sm font-medium text-brand-muted hover:text-brand-secondary"
                        >
                            Back to sign up
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg px-4 py-8 selection:bg-brand-primary selection:text-brand-secondary">
            <div className="absolute inset-0 cloud-grid opacity-[0.04] pointer-events-none" />

            <div className="relative max-w-lg mx-auto">
                <Link to="/" className="inline-flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-brand-secondary rounded-2xl flex items-center justify-center shadow-sm">
                        <Briefcase className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                        <div className="text-2xl font-semibold tracking-tight text-brand-secondary">TrustHire</div>
                        <div className="text-[10px] font-semibold tracking-widest text-brand-primary mt-1">Worker sign up</div>
                    </div>
                </Link>

                <div className="bg-white border border-brand-border rounded-[2rem] shadow-sm p-6 sm:p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-brand-secondary">Create your account</h1>
                        <p className="text-sm text-brand-muted mt-2">Start with basic details. You can complete the full worker profile after sign up.</p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-brand-secondary">First name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full rounded-2xl border border-brand-border bg-brand-bg py-3.5 pl-11 pr-4 text-sm text-brand-secondary focus:outline-none focus:border-brand-primary"
                                        placeholder="First name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-brand-secondary">Last name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full rounded-2xl border border-brand-border bg-brand-bg py-3.5 pl-11 pr-4 text-sm text-brand-secondary focus:outline-none focus:border-brand-primary"
                                        placeholder="Last name"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-brand-secondary">Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full rounded-2xl border border-brand-border bg-brand-bg py-3.5 pl-11 pr-4 text-sm text-brand-secondary focus:outline-none focus:border-brand-primary"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-brand-secondary">Phone number</label>
                            <div className="phone-input-container">
                                <PhoneInput
                                    country={'in'}
                                    value={formData.phoneNumber}
                                    onChange={(value: string, data: { dialCode?: string }) => {
                                        const digits = value.replace(/\D/g, '');
                                        const dialCode = data.dialCode || '';
                                        const subscriber = digits.slice(dialCode.length);
                                        if (subscriber.length <= 10) {
                                            setFormData({ ...formData, phoneNumber: value });
                                        }
                                    }}
                                    inputProps={{ name: 'phone', required: true }}
                                    containerClass="!w-full"
                                    inputClass="!w-full !h-[3.5rem] !bg-[#f8f7f2] !border-brand-border !rounded-2xl !pl-14 !pr-4 !text-brand-secondary !text-sm"
                                    buttonClass="!bg-transparent !border-none !rounded-l-2xl !pl-4"
                                    dropdownClass="!rounded-2xl !shadow-xl !border-brand-border !bg-white"
                                    searchClass="!rounded-lg !bg-brand-bg !border-brand-border"
                                    enableSearch={true}
                                    disableDropdown={false}
                                    countryCodeEditable={false}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-brand-secondary">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full rounded-2xl border border-brand-border bg-brand-bg py-3.5 pl-11 pr-4 text-sm text-brand-secondary focus:outline-none focus:border-brand-primary"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-semibold text-brand-secondary">Profile photo</label>
                            <AdvancedFileUpload
                                onUploadSuccess={(urls) => setFormData({ ...formData, profile_image_url: urls[0] || '' })}
                                maxFiles={1}
                                label="Profile Photo"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full rounded-2xl bg-brand-secondary px-4 py-3.5 text-sm font-semibold text-brand-primary transition-all hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Send OTP'}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-brand-border pt-6 text-sm text-brand-muted">
                        Already have an account?{' '}
                        <Link to="/sign-in" className="font-semibold text-brand-secondary hover:text-brand-primary">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
