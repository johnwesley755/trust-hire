import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, type AppNotification } from '../../../services/notification.service';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Info, AlertTriangle, ChevronLeft, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DashboardHeader } from '../components/DashboardHeader';

export default function NotificationsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading } = useQuery<AppNotification[]>({
        queryKey: ['employer-notifications'],
        queryFn: notificationService.getNotifications,
        refetchInterval: 30000
    });

    const markAsReadMutation = useMutation({
        mutationFn: notificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employer-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['employer-unreadCount'] });
        }
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: notificationService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employer-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['employer-unreadCount'] });
        }
    });

    const getIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'success':
            case 'new_application':
                return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <Bell className="w-5 h-5 text-[#1F3F34]" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F4EF]">
            <DashboardHeader />
            
            <div className="max-w-3xl mx-auto p-4 md:p-8 pt-24 md:pt-32">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#1F3F34]/5 hover:bg-[#FACD15] transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-black text-[#1F3F34] tracking-tight">Notifications</h1>
                    </div>
                    {notifications.some(n => !n.isRead) && (
                        <button 
                            onClick={() => markAllAsReadMutation.mutate()}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1F3F34] rounded-full text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#2d5849] transition-all shadow-sm"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                        </button>
                    )}
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[#1F3F34] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40">Fetching alerts</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-[#1F3F34]/5 shadow-sm">
                        <div className="w-24 h-24 bg-[#F5F4EF] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell className="w-12 h-12 text-[#1F3F34]/10" />
                        </div>
                        <h3 className="text-xl font-black text-[#1F3F34] mb-2">Clear Skies</h3>
                        <p className="text-sm font-medium text-[#414845]/60">You're all caught up. New candidate alerts will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {notifications.map((notification: AppNotification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => !notification.isRead && markAsReadMutation.mutate(notification.id)}
                                    className={`p-6 rounded-3xl flex gap-5 transition-all cursor-pointer border ${notification.isRead ? 'bg-white/50 border-transparent' : 'bg-white border-[#FACD15] shadow-lg shadow-[#FACD15]/5'}`}
                                >
                                    <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${notification.isRead ? 'bg-[#EFEEE9]' : 'bg-[#FACD15]/10'}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <h4 className={`text-lg font-black leading-tight ${notification.isRead ? 'text-[#1F3F34]/40' : 'text-[#1F3F34]'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-[10px] font-bold text-[#1F3F34]/30 uppercase tracking-widest whitespace-nowrap pt-1">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className={`text-sm font-medium leading-relaxed ${notification.isRead ? 'text-[#1F3F34]/30' : 'text-[#1F3F34]/70'}`}>
                                            {notification.message}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
