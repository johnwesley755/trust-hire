import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchLevelProgress } from '../../store/slices/profileSlice';
import { ShieldCheck, ArrowUpRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LevelProgressCard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { levelProgress: progress, loading: isLoading } = useAppSelector((state) => state.profile);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchLevelProgress(user.id));
        }
    }, [dispatch, user?.id]);

    if (isLoading) return (
        <div className="h-48 w-full bg-[#F5F4EF] rounded-[2rem] animate-pulse flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-[#1F3F34]/10" />
        </div>
    );

    if (!progress) return null;

    const getLevelBadge = (level: number) => {
        switch (level) {
            case 1: return '🌱';
            case 2: return '⚡';
            case 3: return '🌟';
            case 4: return '👑';
            default: return '🌱';
        }
    };

    return (
        <Link to="/level" className="block group">
            <section className="bg-[#1F3F34] rounded-[2.5rem] p-8 lg:p-10 text-[#FACD15] relative overflow-hidden shadow-2xl shadow-[#1F3F34]/20 hover:scale-[1.02] transition-all duration-500">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FACD15] opacity-[0.05] rounded-bl-full pointer-events-none" />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#FACD15]/40 font-black tracking-[0.2em] text-[9px] uppercase">
                            <Trophy className="w-3 h-3" /> Status
                        </div>
                        <h3 className="text-4xl font-black tracking-tighter italic uppercase leading-none bricolage">
                            Rank L{progress.currentLevel} {getLevelBadge(progress.currentLevel)}
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-[#FACD15] text-[#1F3F34] rounded-2xl flex items-center justify-center shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <ArrowUpRight className="w-6 h-6" />
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold opacity-60">Level Progress</span>
                        <span className="text-2xl font-black tracking-tighter">{Math.round(progress.progress)}%</span>
                    </div>
                    
                    <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-[#FACD15] shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                        />
                    </div>

                    <div className="flex justify-between text-[10px] font-black tracking-widest uppercase opacity-40">
                        <span>L{progress.currentLevel}</span>
                        <span>{progress.nextLevel === progress.currentLevel ? 'MAX RANK' : `L${progress.nextLevel}`}</span>
                    </div>
                </div>
            </section>
            <style>{`
                .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
            `}</style>
        </Link>
    );
};
