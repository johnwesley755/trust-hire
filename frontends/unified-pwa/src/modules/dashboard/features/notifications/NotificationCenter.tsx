import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, type AppNotification } from '../../../../services/notification.service';
import { Bell, BellOff, CheckCircle2, Info, AlertTriangle, Clock, RefreshCw, Trash2, X } from 'lucide-react';
import { useSocket } from '../../../../providers/SocketProvider';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { subscribe, connected } = useSocket();
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: notifications = [], isLoading, refetch, isRefetching } = useQuery<AppNotification[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const data = await notificationService.getNotifications();
            return data;
        },
        staleTime: 60 * 1000
    });

    const unreadCount = notifications.filter(n => !n.isRead && !(n as any).is_read).length;

    useEffect(() => {
        if (!connected) return;
        const unsubscribe = subscribe('/user/queue/notifications', (newNotification: any) => {
            queryClient.setQueryData<AppNotification[]>(['notifications'], (old = []) => [newNotification, ...old]);
        });
        return () => unsubscribe();
    }, [subscribe, queryClient, connected]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const handleNotificationClick = (n: AppNotification) => {
        setIsOpen(false);

        const t = n.type?.toUpperCase();
        if (t === 'NEW_APPLICATION' || t === 'JOB_CREATED') {
            navigate('/jobs');
        } else if (t === 'WELCOME') {
            navigate('/profile');
        }

        setTimeout(() => {
            deleteMutation.mutate(n.id);
        }, 500);
    };

    const getIcon = (type?: string) => {
        const t = type?.toUpperCase();
        if (t === 'JOB_CREATED' || t === 'SUCCESS' || t === 'ACCEPTED') {
            return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
        }
        if (t === 'NEW_APPLICATION' || t === 'OFFER_SENT') {
            return <Bell className="w-4 h-4 text-[#0066FF]" />;
        }
        if (t === 'ALERT' || t === 'WARNING') {
            return <AlertTriangle className="w-4 h-4 text-amber-600" />;
        }
        return <Info className="w-4 h-4 text-indigo-600" />;
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Bell Trigger Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all relative group cursor-pointer ${
                    isOpen 
                        ? 'bg-blue-50 text-[#0066FF] border border-blue-200' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
                title="Notifications"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-2xs animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Popover Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-88 md:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans text-[#0A1931]"
                    >
                        {/* Header */}
                        <div className="px-4 py-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-['Outfit',sans-serif]">
                                    Notifications
                                </h4>
                                {unreadCount > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-[#0066FF] text-[10px] font-bold">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button 
                                    onClick={() => refetch()}
                                    className="p-1 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer text-slate-500"
                                    title="Refresh"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
                                </button>
                                {notifications.length > 0 && (
                                    <button 
                                        onClick={() => deleteAllMutation.mutate()}
                                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                        title="Clear All"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Notification List Body */}
                        <div className="max-h-84 overflow-y-auto no-scrollbar divide-y divide-slate-100">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => handleNotificationClick(n)}
                                        className={`p-3.5 transition-all hover:bg-slate-50 cursor-pointer flex gap-3 items-start group ${
                                            n.isRead ? 'opacity-60 bg-white' : 'bg-blue-50/30'
                                        }`}
                                    >
                                        <div className="mt-0.5 w-8 h-8 shrink-0 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shadow-2xs">
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className="text-xs font-bold text-slate-900 leading-snug truncate">
                                                    {n.title}
                                                </p>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteMutation.mutate(n.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-600 text-slate-400 transition-opacity"
                                                    title="Dismiss"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5 line-clamp-2">
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-[10px] font-semibold">
                                                    {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : 'just now'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 px-6 text-center space-y-2">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                                        <BellOff className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 font-['Outfit',sans-serif]">
                                        All caught up!
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-medium">
                                        You have no new alerts or notifications at this time.
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-2.5 bg-slate-50/70 flex justify-between items-center px-4 border-t border-slate-100 text-[11px]">
                                <span className="text-slate-400 font-semibold">
                                    {notifications.length} alerts in inbox
                                </span>
                                <button 
                                    onClick={() => deleteAllMutation.mutate()}
                                    className="font-bold text-rose-600 hover:underline cursor-pointer"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
