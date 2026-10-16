import { getToken, onMessage, type MessagePayload } from 'firebase/messaging';
import { getMessagingInstance } from '../lib/firebase';
import apiClient from '../api/apiClient';

const LOCAL_STORAGE_FCM_KEY = 'trusthyre_fcm_token';

export interface PushPermissionResult {
  status: 'granted' | 'denied' | 'default' | 'unsupported';
  token?: string | null;
  error?: string;
}

export const fcmService = {
  /**
   * Checks whether the current browser environment supports Push & Web Notifications.
   */
  isPushSupported: (): boolean => {
    return (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  },

  /**
   * Returns current browser notification permission ('granted' | 'denied' | 'default').
   */
  getPermissionState: (): NotificationPermission | 'unsupported' => {
    if (!fcmService.isPushSupported()) return 'unsupported';
    return Notification.permission;
  },

  /**
   * Requests notification permissions from user, retrieves Firebase VAPID token,
   * and synchronizes it with the TrustHyre backend.
   */
  requestPushPermissionAndRegister: async (): Promise<PushPermissionResult> => {
    if (!fcmService.isPushSupported()) {
      return { status: 'unsupported' };
    }

    try {
      // 1. Prompt browser permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { status: permission as 'denied' | 'default' };
      }

      // 2. Initialize Firebase Messaging
      const messaging = await getMessagingInstance();
      if (!messaging) {
        return { status: 'unsupported', error: 'Firebase messaging not supported in this environment' };
      }

      // 3. Ensure background service worker is registered
      let swRegistration: ServiceWorkerRegistration | undefined;
      try {
        swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      } catch (swErr) {
        console.warn('[FCM] Custom SW register notice, using ready SW:', swErr);
        swRegistration = await navigator.serviceWorker.ready;
      }

      // 4. Retrieve FCM registration token (with optional VAPID public key if defined)
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      const token = await getToken(messaging, {
        vapidKey: vapidKey || undefined,
        serviceWorkerRegistration: swRegistration
      });

      if (!token) {
        return { status: 'granted', token: null, error: 'Failed to retrieve FCM token' };
      }

      // 5. Check if token already registered locally to avoid redundant API roundtrips
      const existingToken = localStorage.getItem(LOCAL_STORAGE_FCM_KEY);
      if (existingToken !== token) {
        await apiClient.post('/api/notifications/fcm-token', {
          token,
          deviceType: 'web'
        });
        localStorage.setItem(LOCAL_STORAGE_FCM_KEY, token);
        console.log('✅ [FCM] Device push token registered successfully with backend.');
      }

      return { status: 'granted', token };
    } catch (err: any) {
      console.warn('[FCM] Push registration notice:', err.message);
      return { status: 'denied', error: err.message };
    }
  },

  /**
   * Unregisters device token on user logout
   */
  unregisterPushToken: async (): Promise<void> => {
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_FCM_KEY);
      if (token) {
        await apiClient.delete(`/api/notifications/fcm-token?token=${encodeURIComponent(token)}`).catch(() => {});
        localStorage.removeItem(LOCAL_STORAGE_FCM_KEY);
      }
    } catch (err: any) {
      console.warn('[FCM] Token unregister notice:', err.message);
    }
  },

  /**
   * Attaches a foreground listener to receive incoming push messages in real-time
   * when the user is actively viewing the TrustHyre web application.
   */
  listenToForegroundMessages: async (
    callback: (payload: MessagePayload) => void
  ): Promise<(() => void) | null> => {
    if (!fcmService.isPushSupported()) return null;

    try {
      const messaging = await getMessagingInstance();
      if (!messaging) return null;

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('🔔 [FCM] Received foreground push notification:', payload);
        callback(payload);
      });

      return unsubscribe;
    } catch (err: any) {
      console.warn('[FCM] Foreground listener setup notice:', err.message);
      return null;
    }
  }
};
