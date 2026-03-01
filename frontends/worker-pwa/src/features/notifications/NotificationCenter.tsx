import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, type Notification } from '../../api/notification.service';
import { Bell, BellOff, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useSocket } from '../../providers/SocketProvider';

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const { subscribe } = useSocket();

    const { data: notifications, isLoading } = useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: notificationService.getNotifications
    });

    useEffect(() => {
        // Subscribe to real-time notifications
        // The backend should publish to /user/queue/notifications
        const unsubscribe = subscribe('/user/queue/notifications', (newNotification) => {
            queryClient.setQueryData(['notifications'], (old: Notification[] | undefined) => {
                if (!old) return [newNotification];
                return [newNotification, ...old];
            });
        });

        return () => unsubscribe();
    }, [subscribe, queryClient]);

    const mutation = useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const unreadCount = (notifications || []).filter((n: Notification) => !n.isRead).length;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all relative group cursor-pointer"
            >
                <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-indigo-400' : 'text-slate-400'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-4 w-80 bg-slate-900 border border-white/10 rounded-4xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                            <h3 className="font-black uppercase tracking-tighter italic">Alerts</h3>
                            {unreadCount > 0 && <span className="text-[10px] font-black bg-indigo-600 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                            {isLoading ? (
                                <div className="p-10 text-center animate-pulse"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
                            ) : (notifications || []).length ? (
                                (notifications || []).map((n: Notification) => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => mutation.mutate(n.id)}
                                        className={`p-5 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 flex gap-4 ${n.isRead ? 'opacity-50' : ''}`}
                                    >
                                        <div className="mt-1">
                                            {n.type === 'SUCCESS' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : 
                                             n.type === 'ALERT' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : 
                                             <Info className="w-5 h-5 text-blue-400" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold leading-tight">{n.title}</p>
                                            <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center space-y-3">
                                    <BellOff className="w-10 h-10 text-slate-800 mx-auto" strokeWidth={1} />
                                    <p className="text-xs text-slate-600 font-medium italic">No notifications yet.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 bg-white/2 text-center border-t border-white/5">
                            <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Clear All</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
