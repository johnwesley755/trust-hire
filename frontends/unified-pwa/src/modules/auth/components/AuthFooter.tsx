import React from 'react';
import { Link } from 'react-router-dom';

export const AuthFooter = () => {
    return (
        <footer className="w-full py-8 px-6 md:px-12 bg-surface border-t border-primary/5 mt-auto">
            <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col items-center md:items-start gap-1">
                    <div className="text-brand-forest font-black text-xl font-headline">TrustHyre</div>
                    <p className="text-brand-forest/40 text-[10px] font-bold uppercase">
                        © {new Date().getFullYear()} TrustHyre. Human-centric recruitment.
                    </p>
                </div>
                <nav className="flex gap-8 text-[11px] font-bold uppercase text-brand-forest/60">
                    <Link className="hover:text-brand-amber transition-all underline decoration-transparent hover:decoration-brand-amber decoration-2 underline-offset-4" to="/privacy">Privacy Policy</Link>
                    <Link className="hover:text-brand-amber transition-all underline decoration-transparent hover:decoration-brand-amber decoration-2 underline-offset-4" to="/terms">Terms of Service</Link>
                    <Link className="hover:text-brand-amber transition-all underline decoration-transparent hover:decoration-brand-amber decoration-2 underline-offset-4" to="/support">Help Center</Link>
                </nav>
            </div>
        </footer>
    );
};
