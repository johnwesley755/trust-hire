import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser } from '../../store/slices/authSlice';
import { loginSchema, LoginInput } from '../../validations/zodSchema';

export const SignInPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading: isLoading, error } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: LoginInput) => {
        const resultAction = await dispatch(loginUser(data));
        if (loginUser.fulfilled.match(resultAction)) {
            const userData = resultAction.payload.user;
            if (userData.role !== 'WORKER') {
                // We'll handle this error specifically if needed, but for now just check role
                alert('This account is not registered as a Worker.');
                return;
            }
            navigate('/dashboard');
        }
    };

    return (
        <div className="bg-[#F5F4EF] text-[#1F3F34] font-body min-h-screen flex items-center justify-center p-0 md:p-6 selection:bg-primary-fixed selection:text-on-primary-fixed">
            {/* Main Auth Container */}
            <main className="w-full max-w-[1280px] min-h-screen md:min-h-[800px] bg-surface-container-lowest md:rounded-lg overflow-hidden flex flex-col md:flex-row shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)]">
                {/* Left Side: Login Form */}
                <section className="w-full md:w-1/2 p-8 md:p-16 md:pt-16 flex flex-col justify-start relative">
                    {/* Brand Anchor */}
                    <div className="mb-8 md:mb-10">
                        <Link to="/" className="text-2xl font-headline font-extrabold tracking-tight text-[#1F3F34]">TrustHire</Link>
                    </div>
                    
                    <div className="max-w-md w-full mx-auto">
                        <header className="mb-10">
                            <h1 className="font-headline text-[2.5rem] font-extrabold leading-[1.1] tracking-tight mb-4 text-[#1F3F34]">Welcome back to the Hearth.</h1>
                            <p className="text-on-surface-variant text-lg leading-relaxed">Secure access to India's most trusted hyperlocal workforce.</p>
                        </header>

                        {error && (
                            <div className="mb-6 p-4 bg-error-container border border-error/10 text-error font-bold text-sm rounded-lg flex items-center gap-3">
                                <span className="material-symbols-outlined">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Input Group: Identifier */}
                            <div className="space-y-2">
                                <label className="font-label text-xs font-bold uppercase tracking-wider text-[#1F3F34]" htmlFor="email">Email</label>
                                <div className="relative">
                                    <input 
                                        className={`w-full bg-surface-container-high border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg px-5 py-4 focus:ring-2 focus:ring-[#FACD15] transition-all outline-none text-[#1F3F34] placeholder-[#1F3F34]/30`} 
                                        id="email" 
                                        {...register('email')}
                                        placeholder="name@work.com" 
                                        type="email"
                                    />
                                    {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.email.message}</p>}
                                </div>
                            </div>
                            
                            {/* Input Group: Password */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="font-label text-xs font-bold uppercase tracking-wider text-[#1F3F34]" htmlFor="password">Password</label>
                                    <Link className="text-xs font-bold text-secondary hover:underline transition-all" to="/forgot-password">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <input 
                                        className={`w-full bg-surface-container-high border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#FACD15] transition-all outline-none text-[#1F3F34] placeholder-[#1F3F34]/30`} 
                                        id="password" 
                                        {...register('password')}
                                        placeholder="••••••••" 
                                        type="password"
                                    />
                                    {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.password.message}</p>}
                                </div>
                            </div>
 
                            {/* Primary CTA */}
                            <button 
                                disabled={isLoading || !isValid}
                                className="w-full bg-[#FACD15] text-[#002117] font-headline font-extrabold py-5 rounded-[12px] uppercase tracking-widest bento-inner-shadow hover:brightness-105 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2" 
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
                            <p className="text-on-surface-variant">
                                New to TrustHire? 
                                <Link className="text-secondary font-bold hover:underline ml-1" to="/sign-up">Create an account</Link>
                            </p>
                        </footer>
                    </div>
                </section>

                {/* Right Side: Human Visuals */}
                <section className="hidden md:flex w-1/2 bg-surface-container p-12 relative overflow-hidden flex-col items-center justify-center">
                    {/* Decorative Blobs */}
                    <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#FACD15] opacity-10 organic-blob"></div>
                    <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-secondary opacity-5 organic-blob"></div>
                    
                    <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
                        {/* Main Visual */}
                        <div className="w-full aspect-square organic-blob overflow-hidden shadow-xl mb-12">
                            <img 
                                className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]" 
                                alt="Close up of a warm handshake between two people in a professional environment" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRBTB9XZuF5RMCxj66XY7YnHIHusS3-rayxo1OGqLl6xH4YdqWOYcN-gNkNS4SBK9RQARPxIgYH2Sy5P8HdFUOoJwB_V3YKa-PmaBCvU84QUMCrrAkQ9CRaoiHOQ0E47cBrtaSUPyeyaUEGP_X6CUkWGPTIAQ4yUfh7b8Vm3t_vs0x2xbLehy2X4xecrrVjvji0ZqnkrJqhkPGx8a6kUExbhoysVpYgKq3jMCvrJ7n4yVA7TbUhxGFWlz6ItZWOfemKxop2dq9gik" 
                            />
                        </div>

                        {/* Trust Card */}
                        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_-10px_rgba(31,63,52,0.12)] max-w-sm transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                </div>
                                <h3 className="font-headline font-extrabold text-[#1F3F34] text-xl leading-tight">Human First.</h3>
                            </div>
                            <p className="text-on-surface-variant font-body leading-relaxed">
                                Building trust through 100% human-verified worker profiles. No bots, no fake credentials—just honest connections.
                            </p>
                        </div>

                        {/* Subtle Brand Flourish */}
                        <div className="mt-16 flex items-center gap-6 opacity-40">
                            <div className="flex -space-x-3">
                                <img className="w-10 h-10 rounded-full border-4 border-surface-container-lowest object-cover" alt="Portrait of a verified male worker" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkCAcNi-vaI8BWzcxs57QOaWZL-wj6u2d6lWAhBUCvz1O_yNXcmZizBwrIbYgln6a2p4i76qKpQRirWL5cQLVklozro4GJLtjhFkWvrqx99cVmp9p8KJZUeBGOXvK9Y4mh-EI2Qgxw5yJVGcUG285aTGNRgOYCyQD3Qx38Wj6mUeLibkCHOC9RvisN463dk3HmWyiTR3Ff0m534Xlg8V1JOK1hOOykECDfJA6UZFdeNyTm6dE9OXkaNWkZXX3SQsK6V6I_3Hl1_9o"/>
                                <img className="w-10 h-10 rounded-full border-4 border-surface-container-lowest object-cover" alt="Portrait of a verified female professional" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8Jbaxbg5doUrwy2jhFNgCcLqORy8vsEPZOaBpG5d6aPQthuCoXwQNp_vqqmlfWRvbFaRPWXZq8vrCRwNSP9Jy1-9J-pqoIT5x9pluyVoDBhP6UGyBbJ8jzaTqmJYiurNuzoQ9uBGY0I3Xf0avlEcGaE9vPOMUFy45cDgkTfIYRlERgswC6F2vqlBDxxI-FVffY_7LAcN2CRVzN9yew_lZswJVX4-6QIDZKMaOmpce_CeYVdBdyzHrYY4kbLX-5hPDlmd-eJBRdUg"/>
                                <img className="w-10 h-10 rounded-full border-4 border-surface-container-lowest object-cover" alt="Portrait of a smiling service provider" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYrScHEypblROj54k-O4UHF-1bhzzJO8YjyTVsQQ3xj27DGorxm_A1r8b41DM_jr1yOwlaygGiZDkkpiAnzKa4Rx1F3AWEZFftHjOobzRk7CoWKtPFi3x-OVDcPAnKuOZoG2QyTR_Y_RqRth5vewJdsN4KKh3j3CsxwY5dUp_J-cP1khWZtEqTyLBKNZq1MSY6Cblm4UOK3FZlpqWpvKyZdtHUF5iTQpZ0XedrZ3kd-bH_io-39lTyZy5calYodtHpbE1k3y5JcWs"/>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#1F3F34]">Join 50,000+ Verified Users</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Sticky Footer */}
            <footer className="fixed bottom-0 left-0 w-full py-4 px-8 flex flex-col items-center md:flex-row md:justify-between bg-[#F5F4EF]/90 backdrop-blur-md border-t border-[#1F3F34]/5 z-50">
                <div className="text-[#1F3F34]/40 font-headline text-sm leading-relaxed pointer-events-auto">
                    © 2024 TrustHire. Built for the Human Hearth.
                </div>
                <div className="hidden md:flex gap-6 pointer-events-auto">
                    <Link className="text-[#1F3F34]/60 text-sm font-medium hover:underline decoration-[#FACD15] decoration-2 transition-all" to="/privacy">Privacy</Link>
                    <Link className="text-[#1F3F34]/60 text-sm font-medium hover:underline decoration-[#FACD15] decoration-2 transition-all" to="/terms">Terms</Link>
                    <Link className="text-[#1F3F34]/60 text-sm font-medium hover:underline decoration-[#FACD15] decoration-2 transition-all" to="/support">Support</Link>
                </div>
            </footer>

            <style>{`
                .organic-blob {
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                }
                .bento-inner-shadow {
                    box-shadow: inset 0 -2px 0 0 rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};
