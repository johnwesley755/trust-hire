import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, type AppNotification } from '../../../services/notification.service';
import { Bell, BellOff, CheckCircle2, Info, AlertTriangle, Clock, Trash2 } from 'lucide-react';
import { useSocket } from '../../../providers/SocketProvider';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { subscribe, connected } = useSocket();

    const { data: notifications = [], isLoading } = useQuery<AppNotification[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const data = await notificationService.getNotifications();
            return data;
        },
        refetchInterval: 10000
    });

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['unreadCount'],
        queryFn: notificationService.getUnreadCount,
        refetchInterval: 10000
    });

    useEffect(() => {
        if (!connected) return;
        const unsubscribe = subscribe('/user/queue/notifications', (newNotification: any) => {
            queryClient.setQueryData(['notifications'], (old: AppNotification[] | undefined) => {
                const list = old || [];
                return [newNotification, ...list];
            });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        });
        return () => unsubscribe();
    }, [connected, subscribe, queryClient]);

    const deleteMutation = useMutation({
        mutationFn: (id: string) => notificationService.deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        }
    });

    const deleteAllMutation = useMutation({
        mutationFn: () => notificationService.deleteAllNotifications(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
            setIsOpen(false);
        }
    });

    const handleNotificationClick = (n: AppNotification) => {
        setIsOpen(false);

        const t = n.type?.toUpperCase();
        if (t === 'APPLICATION_SUBMITTED' || t === 'APPLICATION_UPDATE') {
            navigate('/applied-jobs');
        } else if (t === 'NEW_JOB' || t === 'JOB_MATCH') {
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
        if (t === 'SUCCESS' || t === 'APPLICATION_ACCEPTED' || t === 'APPLICATION_SUBMITTED') {
            return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        }
        if (t === 'WARNING') return <AlertTriangle className="w-4 h-4 text-amber-500" />;
        if (t === 'INFO' || t === 'APPLICATION_UPDATE' || t === 'WELCOME') {
            return <Info className="w-4 h-4 text-blue-500" />;
        }
        return <Bell className="w-4 h-4 text-[#0A1931]" />;
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-[#E9E8E3] rounded-full transition-all relative group text-[#0A1931] cursor-pointer"
            >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-[#ba1a1a] text-white text-[8px] font-black flex items-center justify-center rounded-full animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 md:right-0 mt-4 w-[calc(100vw-2rem)] md:w-80 bg-white border border-[#0A1931]/5 rounded-3xl shadow-2xl z-[101] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-[#e2e8f0] flex justify-between items-center bg-[#F8FAFC]/50">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0A1931]">Notifications</h3>
                            {notifications.length > 0 && (
                                <button 
                                    onClick={() => deleteAllMutation.mutate()}
                                    className="text-[9px] font-black text-red-600 hover:underline uppercase flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Clear all
                                </button>
                            )}
                        </div>
                        
                        <div className="max-h-[28rem] overflow-y-auto no-scrollbar">
                            {notifications.length ? (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => handleNotificationClick(n)}
                                        className={`p-4 border-b border-[#e2e8f0] cursor-pointer transition-all hover:bg-[#F8FAFC] flex gap-3 ${n.isRead ? 'opacity-40' : ''}`}
                                    >
                                        <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${n.isRead ? 'bg-[#e2e8f0]' : 'bg-[#FACD15]/10'}`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className="text-xs font-extrabold leading-tight text-[#0A1931] truncate">{n.title}</p>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteMutation.mutate(n.id);
                                                    }}
                                                    className="p-1 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-2.5 h-2.5" />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-[#414845] font-medium line-clamp-2 mt-0.5">{n.message}</p>
                                            <div className="flex items-center gap-1 mt-1 opacity-40">
                                                <Clock className="w-2.5 h-2.5" />
                                                <span className="text-[8px] font-bold uppercase tracking-tighter">
                                                    {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : 'just now'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center space-y-3">
                                    <BellOff className="w-8 h-8 text-[#0A1931]/10 mx-auto" strokeWidth={1} />
                                    <p className="text-[10px] font-bold text-[#414845]/40 uppercase tracking-widest">All caught up</p>
                                </div>
                            )}
                        </div>
                        
                        <button 
                            onClick={() => deleteAllMutation.mutate()}
                            className="w-full p-3 bg-[#F8FAFC] text-center border-t border-[#0A1931]/5 hover:bg-red-50 transition-colors"
                        >
                            <p className="text-[8px] font-black text-red-600 uppercase tracking-widest">Wipe All Notifications</p>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
