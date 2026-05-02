import React from 'react';
import { Link } from 'react-router-dom';

export const AuthHeader = () => {
    return (
        <header className="absolute top-0 left-0 w-full z-50 px-4 py-4 md:px-12 md:py-6 pointer-events-none">
            <div className="max-w-[1440px] mx-auto flex justify-between items-center pointer-events-auto px-6 py-4">
                <div className="flex items-center gap-2">
                    <Link to="/" className="text-2xl font-black text-primary font-headline tracking-tighter">TrustHire</Link>
                </div>
                <div className="flex items-center gap-6">
                    <Link className="flex items-center gap-2 text-primary/70 hover:text-primary transition-colors font-bold text-sm" to="/">
                        <span className="material-symbols-outlined text-[20px]">home</span>
                        Home
                    </Link>
                    <div className="hidden md:flex items-center gap-2 text-primary/70 font-bold text-sm cursor-pointer hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">help_outline</span>
                        Help
                    </div>
                </div>
            </div>
        </header>
    );
};
