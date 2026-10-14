import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';

export const AuthHeader = () => {
    return (
        <header className="absolute top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <img src="/logo.png" alt="TrustHyre Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">
                        Trust<span className="text-brand-500">Hyre</span>
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 mt-0.5">VERIFIED WORKFORCE</span>
                    </div>
                </Link>
                <div className="flex items-center gap-6">
                    <Link className="flex items-center gap-2 text-slate-600 hover:text-brand-500 transition-colors font-bold text-sm" to="/">
                        <span className="material-symbols-outlined text-[20px]">home</span>
                        Home
                    </Link>
                    <Link className="hidden md:flex items-center gap-2 text-slate-600 font-bold text-sm cursor-pointer hover:text-brand-500 transition-colors" to="/sign-in?role=worker">
                        <span className="material-symbols-outlined text-[20px]">badge</span>
                        Candidate Login
                    </Link>
                    <Link className="hidden md:flex items-center gap-2 text-slate-600 font-bold text-sm cursor-pointer hover:text-brand-500 transition-colors" to="/sign-in?role=employer">
                        <span className="material-symbols-outlined text-[20px]">business_center</span>
                        Employer Login
                    </Link>
                </div>
            </div>
        </header>
    );
};
