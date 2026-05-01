import { useEffect } from 'react';
import { useSocket } from '../../core/providers/SocketProvider';
import { toast } from 'sonner';
import { Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { addNotification, fetchUnreadCount } from '../../store/slices/notificationSlice';

export const NotificationListener = () => {
    const { subscribe, connected } = useSocket();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!connected) return;

        const unsubscribe = subscribe('/user/queue/notifications', (notification: any) => {
            // Update Redux state
            dispatch(addNotification(notification));
            dispatch(fetchUnreadCount());

            // Show Toast
            toast(notification.title, {
                description: notification.message,
                icon: getIcon(notification.type),
                duration: 8000,
                className: "bg-white rounded-[2rem] border border-[#1F3F34]/5 shadow-2xl p-6 selection:bg-[#FACD15] selection:text-[#1F3F34]",
            });
        });

        return () => unsubscribe();
    }, [connected, subscribe, dispatch]);

    const getIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'success':
            case 'new_application':
            case 'job_created':
                return <CheckCircle2 className="w-5 h-5 text-emerald-500 font-black" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-amber-500 font-black" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500 font-black" />;
            default:
                return <Bell className="w-5 h-5 text-[#1F3F34] font-black" />;
        }
    };

    return null;
};
