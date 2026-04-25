import { useEffect } from 'react';
import { useSocket } from '../../../core/providers/SocketProvider';
import { toast } from 'sonner';
import { Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import React from 'react';

export const NotificationListener = () => {
    const { subscribe, connected } = useSocket();

    useEffect(() => {
        console.log('NotificationListener: Connected status:', connected);
        if (!connected) return;

        console.log('NotificationListener: Subscribing to /user/queue/notifications');
        const unsubscribe = subscribe('/user/queue/notifications', (notification: any) => {
            console.log('NotificationListener: Received notification:', notification);
            toast(notification.title, {
                description: notification.message,
                icon: getIcon(notification.type),
                duration: 6000,
                className: "bg-white rounded-3xl border border-[#1F3F34]/5 shadow-2xl p-6",
            });
        });

        return () => unsubscribe();
    }, [connected, subscribe]);

    const getIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'success':
            case 'new_application':
            case 'job_created':
                return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <Bell className="w-5 h-5 text-[#1F3F34]" />;
        }
    };

    return null;
};
