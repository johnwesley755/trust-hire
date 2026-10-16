import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, type AppNotification } from '../../../../services/notification.service';
import { Bell, BellOff, CheckCircle2, Info, AlertTriangle, Clock, RefreshCw, Trash2, CheckCheck, Briefcase, Award, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fcmService } from '../../../../services/fcm.service';

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    // Synchronized notification query with 30s background heartbeat polling fallback
    const { data: notifications = [], refetch, isRefetching } = useQuery<AppNotification[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const data = await notificationService.getNotifications();
            return data;
        },
        staleTime: 15 * 1000,
        refetchInterval: 30 * 1000,
        refetchOnWindowFocus: true
    });

    const unreadCount = notifications.filter(n => !n.isRead && !(n as any).is_read).length;

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const deleteMutation = useMutation({
        mutationFn: (id: string) => notificationService.deleteNotification(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<AppNotification[]>(['notifications'], (old = []) => old.filter(n => n.id !== id));
            queryClient.setQueryData<number>(['unreadCount'], (c = 0) => Math.max(0, (c || 0) - 1));
        }
    });

    const deleteAllMutation = useMutation({
        mutationFn: () => notificationService.deleteAllNotifications(),
        onSuccess: () => {
            queryClient.setQueryData<AppNotification[]>(['notifications'], []);
            queryClient.setQueryData<number>(['unreadCount'], 0);
            setIsOpen(false);
        }
    });

    const markAllReadMutation = useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.setQueryData<AppNotification[]>(['notifications'], (old = []) =>
                old.map(n => ({ ...n, isRead: true, is_read: true }))
            );
            queryClient.setQueryData<number>(['unreadCount'], 0);
        }
    });

    const markReadMutation = useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<AppNotification[]>(['notifications'], (old = []) =>
                old.map(n => n.id === id ? { ...n, isRead: true, is_read: true } : n)
            );
            queryClient.setQueryData<number>(['unreadCount'], (c = 0) => Math.max(0, (c || 0) - 1));
        }
    });

    const handleNotificationClick = (n: AppNotification) => {
        setIsOpen(false);
        markReadMutation.mutate(n.id);

        // If target deep-link is provided, navigate directly to it
        if (n.link) {
            navigate(n.link);
            return;
        }

        const t = n.type?.toUpperCase();
        if (t === 'APPLICATION_SUBMITTED' || t === 'APPLICATION_UPDATE' || t === 'APPLICATION_ACCEPTED' || t === 'APPLICATION_SHORTLISTED') {
            navigate('/applied-jobs');
        } else if (t === 'NEW_APPLICATION') {
            navigate('/dashboard/employer/jobs');
        } else if (t === 'NEW_JOB' || t === 'JOB_MATCH' || t === 'JOB_MATCH_ALERT' || t === 'APPLICATION_REJECTED') {
            navigate('/search');
        } else if (t === 'WELCOME' || t === 'KYC_VERIFIED' || t === 'KYC_REJECTED' || t === 'SKILL_BADGE_EARNED') {
            navigate('/profile');
        } else if (t === 'SECURITY_ALERT') {
            navigate('/settings');
        }
    };

    const getIcon = (type?: string) => {
        const t = type?.toUpperCase();
        if (t === 'SUCCESS' || t === 'APPLICATION_ACCEPTED' || t === 'APPLICATION_SUBMITTED' || t === 'NEW_APPLICATION') {
            return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
        }
        if (t === 'JOB_MATCH_ALERT' || t === 'JOB_POSTED' || t === 'NEW_JOB') {
            return <Briefcase className="w-4 h-4 text-blue-600" />;
        }
        if (t === 'SKILL_BADGE_EARNED') {
            return <Award className="w-4 h-4 text-amber-500" />;
        }
        if (t === 'KYC_VERIFIED') {
            return <ShieldCheck className="w-4 h-4 text-blue-600" />;
        }
        if (t === 'WARNING' || t === 'KYC_REJECTED') {
            return <AlertTriangle className="w-4 h-4 text-amber-500" />;
        }
        if (t === 'INFO' || t === 'APPLICATION_UPDATE' || t === 'WELCOME') {
            return <Info className="w-4 h-4 text-[#0f2f63]" />;
        }
        return <Bell className="w-4 h-4 text-[#0f2f63]" />;
    };

    return (
        <div className="relative font-sans" ref={containerRef}>
            {/* Bell Trigger Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all relative cursor-pointer border ${
                    isOpen 
                        ? 'bg-[#0f2f63]/10 text-[#0f2f63] border-[#0f2f63]/30' 
                        : 'bg-[#f4f4f4] hover:bg-[#e6e8ec] text-[#0a0a0a] border-[#e6e8ec]'
                }`}
                title="Notifications"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#ba1a1a] text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white shadow-xs animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Popover Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 mt-2.5 w-[calc(100vw-2rem)] sm:w-88 md:w-96 bg-white border border-[#e6e8ec] rounded-2xl shadow-2xl z-50 overflow-hidden text-[#0a0a0a]"
                    >
                        {/* Header */}
                        <div className="px-4 py-3.5 border-b border-[#e6e8ec] flex justify-between items-center bg-[#fbfbfb]">
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-[#0a0a0a]">
                                    Notifications
                                </h4>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#0f2f63]/10 text-[#0f2f63] text-[10px] font-bold">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={() => markAllReadMutation.mutate()}
                                        className="text-[11px] font-semibold text-[#0f2f63] hover:underline flex items-center gap-1 px-1.5 py-1 rounded cursor-pointer"
                                        title="Mark all as read"
                                    >
                                        <CheckCheck className="w-3 h-3" />
                                        <span>Read all</span>
                                    </button>
                                )}
                                <button 
                                    onClick={() => refetch()}
                                    className="p-1 hover:bg-[#f4f4f4] rounded-lg transition-colors cursor-pointer text-[#717784]"
                                    title="Refresh"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
                                </button>
                                {notifications.length > 0 && (
                                    <button 
                                        onClick={() => deleteAllMutation.mutate()}
                                        className="p-1 hover:bg-rose-50 text-[#717784] hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                        title="Clear All"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Push Permission Prompt if not yet granted */}
                        {fcmService.isPushSupported() && Notification.permission !== 'granted' && (
                            <div className="px-4 py-2 bg-[#0f2f63]/5 border-b border-[#0f2f63]/10 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Bell className="w-3.5 h-3.5 text-[#0f2f63] shrink-0" />
                                    <span className="text-[11px] text-[#0f2f63] font-medium truncate">
                                        Push notifications are disabled
                                    </span>
                                </div>
                                <button
                                    onClick={async () => {
                                        await fcmService.requestPushPermissionAndRegister();
                                    }}
                                    className="px-2.5 py-1 bg-[#0f2f63] text-white text-[10px] font-bold rounded-lg hover:bg-[#1a4487] transition-all cursor-pointer shrink-0"
                                >
                                    Enable
                                </button>
                            </div>
                        )}
                        
                        {/* Notification List Body */}
                        <div className="max-h-84 overflow-y-auto divide-y divide-[#e6e8ec]">
                            {notifications.length > 0 ? (
                                notifications.map((n) => {
                                    const isRead = Boolean(n.isRead || (n as any).is_read);
                                    const createdAt = n.createdAt || (n as any).created_at;
                                    return (
                                        <div 
                                            key={n.id} 
                                            onClick={() => handleNotificationClick(n)}
                                            className={`p-3.5 transition-all hover:bg-[#f4f4f4] cursor-pointer flex gap-3 items-start group ${
                                                isRead ? 'opacity-60 bg-white' : 'bg-[#e6eefc]/30'
                                            }`}
                                        >
                                            <div className="mt-0.5 w-8 h-8 shrink-0 rounded-xl bg-white border border-[#e6e8ec] flex items-center justify-center shadow-2xs">
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className="text-xs font-bold text-[#0a0a0a] leading-snug truncate">
                                                        {n.title}
                                                    </p>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteMutation.mutate(n.id);
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-600 text-[#717784] transition-opacity"
                                                        title="Dismiss"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-[#717784] font-medium line-clamp-2 mt-0.5">{n.message}</p>
                                                <div className="flex items-center gap-1 mt-1 text-[10px] text-[#717784]">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    <span>
                                                        {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'just now'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-10 text-center space-y-2">
                                    <div className="w-10 h-10 bg-[#f4f4f4] rounded-full flex items-center justify-center mx-auto text-[#717784]">
                                        <BellOff className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs font-semibold text-[#0a0a0a]">All caught up!</p>
                                    <p className="text-[11px] text-[#717784]">No new shift or application alerts.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
