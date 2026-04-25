import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, type AppNotification } from '../../api/notification.service';
import { Bell, BellOff, CheckCircle2, Info, AlertTriangle, Clock, RefreshCw, Trash2 } from 'lucide-react';
import { useSocket } from '../../../../core/providers/SocketProvider';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { subscribe, connected } = useSocket();

    const { data: notifications = [], isLoading, refetch, isRefetching } = useQuery<AppNotification[]>({
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
        const unsubscribe = subscribe('/user/queue/notifications', (newNotification) => {
            queryClient.setQueryData(['notifications'], (old: AppNotification[] | undefined) => {
                const list = old || [];
                return [newNotification, ...list];
            });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        });
        return () => unsubscribe();
    }, [subscribe, queryClient, connected]);

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
        // Navigate first, then delete
        setIsOpen(false);

        const t = n.type?.toUpperCase();
        if (t === 'NEW_APPLICATION') {
            navigate('/applications');
        } else if (t === 'JOB_CREATED') {
            navigate('/my-active-jobs');
        } else if (t === 'WELCOME') {
            navigate('/profile');
        }

        // Delete the notification after a small delay to ensure navigation starts
        setTimeout(() => {
            deleteMutation.mutate(n.id);
        }, 500);
    };

    const handleRefresh = async () => {
        await queryClient.invalidateQueries({ queryKey: ['notifications'] });
        await queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        await refetch();
    };

    const getIcon = (type: string) => {
        const t = type?.toUpperCase();
        if (t === 'JOB_CREATED' || t === 'SUCCESS') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
        if (t === 'NEW_APPLICATION') return <Bell className="w-3.5 h-3.5 text-blue-500" />;
        if (t === 'ALERT' || t === 'WARNING') return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
        return <Info className="w-3.5 h-3.5 text-indigo-500" />;
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all relative group cursor-pointer ${
                    isOpen ? 'bg-[#1F3F34] text-white' : 'bg-white hover:bg-[#F5F4EF] text-[#1F3F34] border border-[#EFEEE9]'
                }`}
            >
                <Bell className={`w-5 h-5 ${unreadCount > 0 && !isOpen ? 'animate-bounce' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#BA1A1A] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-[#EFEEE9] rounded-2xl shadow-[0_20px_50px_rgba(31,63,52,0.15)] z-[101] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-[#EFEEE9] flex justify-between items-center bg-[#F5F4EF]/30">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1F3F34]">Notifications</span>
                                {(isLoading || isRefetching) && <RefreshCw className="w-3 h-3 animate-spin text-[#1F3F34]/30" />}
                            </div>
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={handleRefresh}
                                    className="p-1 hover:bg-black/5 rounded-md transition-colors"
                                >
                                    <RefreshCw className={`w-3 h-3 text-[#1F3F34]/50 ${isRefetching ? 'animate-spin' : ''}`} />
                                </button>
                                {notifications.length > 0 && (
                                    <button 
                                        onClick={() => deleteAllMutation.mutate()}
                                        className="p-1 hover:bg-red-50 text-red-500 rounded-md transition-colors"
                                        title="Clear All"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto no-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => handleNotificationClick(n)}
                                        className={`px-4 py-3 border-b border-[#EFEEE9] cursor-pointer transition-all hover:bg-[#F5F4EF] flex gap-3 ${n.isRead ? 'opacity-50' : 'bg-white'}`}
                                    >
                                        <div className={`mt-0.5 w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${n.isRead ? 'bg-[#EFEEE9]' : 'bg-[#FACD15]/10'}`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className="text-[11px] font-black text-[#1F3F34] leading-tight truncate">{n.title}</p>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteMutation.mutate(n.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-2.5 h-2.5" />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-[#414845] font-medium leading-relaxed mt-0.5 line-clamp-2">{n.message}</p>
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
                                <div className="p-10 text-center space-y-2">
                                    <div className="w-10 h-10 bg-[#F5F4EF] rounded-full flex items-center justify-center mx-auto">
                                        <BellOff className="w-5 h-5 text-[#1F3F34]/20" strokeWidth={1.5} />
                                    </div>
                                    <p className="text-[10px] font-bold text-[#1F3F34]/30 uppercase tracking-[0.1em]">All caught up</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-2.5 bg-[#F5F4EF]/50 flex justify-between items-center px-4 border-t border-[#EFEEE9]">
                            <span className="text-[8px] font-bold text-[#1F3F34]/30 uppercase tracking-[0.1em]">Recent Activity</span>
                            <button 
                                onClick={() => deleteAllMutation.mutate()}
                                className="text-[8px] font-black text-red-600 uppercase tracking-[0.1em] hover:underline"
                            >
                                Clear All Notifications
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};