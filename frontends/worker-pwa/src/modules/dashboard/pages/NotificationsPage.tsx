import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, type AppNotification } from '../../../services/notification.service';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Info, AlertTriangle, ChevronLeft, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading } = useQuery<AppNotification[]>({
        queryKey: ['notifications'],
        queryFn: notificationService.getNotifications,
        refetchInterval: 30000 
    });

    const markAsReadMutation = useMutation({
        mutationFn: notificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        }
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: notificationService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        }
    });

    const getIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'success':
            case 'application_accepted':
                return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'info':
            case 'application_update':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <Bell className="w-5 h-5 text-[#1F3F34]" />;
        }
    };

    const handleMarkAllRead = () => {
        markAllAsReadMutation.mutate();
    };

    return (
        <div className="min-h-screen bg-[#F5F4EF] p-4 md:p-8 lg:p-12">
            <div className="max-w-3xl mx-auto">
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
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1F3F34] border border-[#1F3F34]/5 hover:bg-[#1F3F34] hover:text-white transition-all shadow-sm"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                        </button>
                    )}
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-[#1F3F34] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-bold text-[#1F3F34]/40 uppercase tracking-widest">Loading alerts...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2rem] p-12 text-center border border-[#1F3F34]/5 shadow-sm"
                    >
                        <div className="w-20 h-20 bg-[#F5F4EF] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell className="w-10 h-10 text-[#1F3F34]/20" />
                        </div>
                        <h3 className="text-xl font-black text-[#1F3F34] mb-2">No notifications yet</h3>
                        <p className="text-[#414845] font-medium opacity-60 max-w-xs mx-auto">We'll alert you when there are updates on your applications or profile.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {notifications.map((notification: AppNotification) => (
                                <motion.div
                                    key={notification.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => !notification.isRead && markAsReadMutation.mutate(notification.id)}
                                    className={`relative group bg-white p-5 rounded-2xl flex gap-4 border transition-all cursor-pointer shadow-sm hover:shadow-md ${notification.isRead ? 'border-transparent' : 'border-[#FACD15] shadow-[#FACD15]/5'}`}
                                >
                                    <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${notification.isRead ? 'bg-[#F5F4EF]' : 'bg-[#FACD15]/10'}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h4 className={`font-extrabold truncate ${notification.isRead ? 'text-[#1F3F34]/60' : 'text-[#1F3F34]'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-[10px] font-bold text-[#414845]/40 whitespace-nowrap">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className={`text-sm font-medium leading-relaxed ${notification.isRead ? 'text-[#414845]/40' : 'text-[#414845]'}`}>
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-[#FACD15] rounded-full" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
