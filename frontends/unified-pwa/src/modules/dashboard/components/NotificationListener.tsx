import { useEffect } from 'react';
import { useSocket } from '../../../providers/SocketProvider';
import { toast } from 'sonner';
import { Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import React from 'react';

export const NotificationListener = () => {
    const { subscribe, connected } = useSocket();

    useEffect(() => {
        console.log('Worker NotificationListener: Connected status:', connected);
        if (!connected) return;

        console.log('Worker NotificationListener: Subscribing to /user/queue/notifications');
        const unsubscribe = subscribe('/user/queue/notifications', (notification: any) => {
            console.log('Worker Received notification:', notification);
            
            toast(notification.title, {
                description: notification.message,
                icon: getIcon(notification.type),
                duration: 5000,
                className: "bg-white rounded-3xl border border-[#0A1931]/5 shadow-2xl p-5",
            });
        });

        return () => unsubscribe();
    }, [connected, subscribe]);

    const getIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'success':
            case 'application_accepted':
            case 'job_created':
                return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'info':
            case 'application_update':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <Bell className="w-5 h-5 text-[#0A1931]" />;
        }
    };

    return null; // This component doesn't render anything
};
