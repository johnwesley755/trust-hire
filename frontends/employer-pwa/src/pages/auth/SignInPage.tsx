import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser } from '../../store/slices/authSlice';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading: isLoading, error } = useAppSelector((state) => state.auth);
    
    const isFormValid = email && password;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email, password })).unwrap().then((data: any) => {
            if (data.user.role !== 'EMPLOYER' && data.user.role !== 'ADMIN') {
                // This logic might be better in the slice or a post-login check
                // For now, keeping it here for simplicity
                alert('This account is not registered as an Employer. Please use the Worker portal.');
                return;
            }
            navigate('/dashboard');
        });
    };

    return (
        <div className="bg-[#F5F4EF] text-[#1F3F34] font-body min-h-screen flex items-center justify-center p-0 md:p-6 selection:bg-[#FACD15] selection:text-[#1F3F34]">
            {/* Main Auth Container */}
            <main className="w-full max-w-[1280px] min-h-screen md:min-h-[800px] bg-white md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)]">
                {/* Left Side: Login Form */}
                <section className="w-full md:w-1/2 p-8 md:p-16 md:pt-16 flex flex-col justify-start relative">
                    {/* Brand Anchor */}
                    <div className="mb-8 md:mb-10 text-left">
                        <Link to="/" className="text-2xl font-black tracking-tight text-[#1F3F34] uppercase bricolage">TrustHire</Link>
                    </div>
                    
                    <div className="max-w-md w-full mx-auto text-left">
                        <header className="mb-10">
                            <h1 className="text-[2.5rem] font-black leading-[1.1] tracking-tight mb-4 text-[#1F3F34] uppercase bricolage">Welcome back to the Hearth.</h1>
                            <p className="text-[#1F3F34]/60 text-lg leading-relaxed font-medium">Secure access to India's most trusted workforce.</p>
                        </header>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 font-bold text-sm rounded-xl flex items-center gap-3">
                                <span className="material-symbols-outlined">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Input Group: Identifier */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-[#1F3F34]" htmlFor="identifier">Work Email</label>
                                <div className="relative">
                                    <input 
                                        className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl px-5 py-4 transition-all outline-none text-[#1F3F34] placeholder-[#1F3F34]/30 font-bold" 
                                        id="identifier" 
                                        name="identifier" 
                                        placeholder="name@work.com" 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            
                            {/* Input Group: Password */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[#1F3F34]" htmlFor="password">Password</label>
                                    <Link className="text-xs font-bold text-[#FACD15] hover:underline transition-all" to="/forgot-password">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <input 
                                        className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl px-5 py-4 transition-all outline-none text-[#1F3F34] placeholder-[#1F3F34]/30 font-bold" 
                                        id="password" 
                                        name="password" 
                                        placeholder="••••••••" 
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Primary CTA */}
                            <button 
                                disabled={isLoading || !isFormValid}
                                className="w-full bg-[#FACD15] text-[#1F3F34] font-black py-5 rounded-2xl uppercase tracking-widest shadow-xl shadow-[#FACD15]/10 hover:brightness-105 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2" 
                                type="submit"
                            >
                                {isLoading ? (
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                ) : (
                                    <span>Login</span>
                                )}
                            </button>
                        </form>

                        <footer className="mt-12 text-center">
                            <p className="text-[#1F3F34]/60 font-medium">
                                New to TrustHire? 
                                <Link className="text-[#1F3F34] font-black hover:underline ml-1 uppercase tracking-tight" to="/sign-up">Create an account</Link>
                            </p>
                        </footer>
                    </div>
                </section>

                {/* Right Side: Visuals */}
                <section className="hidden md:flex w-1/2 bg-[#F5F4EF] p-12 relative overflow-hidden flex-col items-center justify-center">
                    {/* Decorative Blobs */}
                    <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#FACD15] opacity-10 organic-blob"></div>
                    <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-[#1F3F34] opacity-5 organic-blob"></div>
                    
                    <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
                        {/* Main Visual */}
                        <div className="w-full aspect-square organic-blob overflow-hidden shadow-2xl mb-12 bg-[#1F3F34]">
                            <img 
                                className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]" 
                                alt="Professional environment" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRBTB9XZuF5RMCxj66XY7YnHIHusS3-rayxo1OGqLl6xH4YdqWOYcN-gNkNS4SBK9RQARPxIgYH2Sy5P8HdFUOoJwB_V3YKa-PmaBCvU84QUMCrrAkQ9CRaoiHOQ0E47cBrtaSUPyeyaUEGP_X6CUkWGPTIAQ4yUfh7b8Vm3t_vs0x2xbLehy2X4xecrrVjvji0ZqnkrJqhkPGx8a6kUExbhoysVpYgKq3jMCvrJ7n4yVA7TbUhxGFWlz6ItZWOfemKxop2dq9gik" 
                            />
                        </div>

                        {/* Trust Card */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-[#1F3F34]/5 max-w-sm transform -rotate-2 hover:rotate-0 transition-transform duration-500 text-left">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 rounded-full bg-[#FACD15]/10 flex items-center justify-center text-[#FACD15]">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                </div>
                                <h3 className="font-black text-[#1F3F34] text-xl leading-tight uppercase bricolage">Human First.</h3>
                            </div>
                            <p className="text-[#1F3F34]/60 font-medium leading-relaxed">
                                Building trust through 100% human-verified worker profiles. Honest connections, guaranteed.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <style>{`
                .organic-blob {
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                }
            `}</style>
        </div>
    );
}
