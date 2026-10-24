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
    const isWindow = typeof window !== 'undefined';
    const hasNotification = isWindow && 'Notification' in window;
    const hasSW = isWindow && 'serviceWorker' in navigator;
    const hasPush = isWindow && 'PushManager' in window;
    const supported = isWindow && hasNotification && hasSW && hasPush;

    console.log(`[FCM-CLIENT:STEP-1:SUPPORT] Capability check: Notification=${hasNotification}, ServiceWorker=${hasSW}, PushManager=${hasPush} -> Supported=${supported}`);
    return supported;
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
  requestPushPermissionAndRegister: async (userId?: string): Promise<PushPermissionResult> => {
    console.log(`\n🚀 [FCM-CLIENT:STEP-2:START] Initiating Push Permission & Token Registration for userId: ${userId || 'anonymous'}`);

    if (!fcmService.isPushSupported()) {
      console.warn('⚠️ [FCM-CLIENT:STEP-1:SUPPORT] Push notifications are not supported in this browser environment.');
      return { status: 'unsupported' };
    }

    try {
      // 1. Check or prompt browser permission
      const initialPermission = Notification.permission;
      console.log(`📋 [FCM-CLIENT:STEP-2:PERMISSION] Current Notification.permission state: "${initialPermission}"`);

      let permission = initialPermission;
      if (initialPermission !== 'granted') {
        console.log('👆 [FCM-CLIENT:STEP-2:PERMISSION] Prompting user for Notification.requestPermission()...');
        permission = await Notification.requestPermission();
        console.log(`📋 [FCM-CLIENT:STEP-2:PERMISSION] User answered permission prompt with: "${permission}"`);
      }

      if (permission !== 'granted') {
        console.warn(`⚠️ [FCM-CLIENT:STEP-2:PERMISSION] Push permission is "${permission}". Cannot proceed with token generation.`);
        return { status: permission as 'denied' | 'default' };
      }

      // 2. Initialize Firebase Messaging
      console.log('🔥 [FCM-CLIENT:STEP-3:MESSAGING-INIT] Initializing Firebase Messaging instance...');
      const messaging = await getMessagingInstance();
      if (!messaging) {
        console.error('❌ [FCM-CLIENT:STEP-3:MESSAGING-INIT] Firebase messaging not supported or failed to initialize.');
        return { status: 'unsupported', error: 'Firebase messaging not supported in this environment' };
      }
      console.log('✅ [FCM-CLIENT:STEP-3:MESSAGING-INIT] Firebase Messaging instance acquired successfully.');

      // 3. Ensure background service worker is registered with dynamic env credentials
      let swRegistration: ServiceWorkerRegistration | undefined;
      const swParams = new URLSearchParams({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
      });
      const swUrl = `/firebase-messaging-sw.js?${swParams.toString()}`;

      console.log('👷 [FCM-CLIENT:STEP-4:SERVICE-WORKER] Registering /firebase-messaging-sw.js with dynamic env parameters...');
      try {
        swRegistration = await navigator.serviceWorker.register(swUrl, { scope: '/' });
        console.log(`✅ [FCM-CLIENT:STEP-4:SERVICE-WORKER] Registered successfully. Scope: "${swRegistration.scope}" | Active: ${Boolean(swRegistration.active)}`);
      } catch (swErr: any) {
        console.warn('⚠️ [FCM-CLIENT:STEP-4:SERVICE-WORKER] Dedicated SW register threw, falling back to navigator.serviceWorker.ready:', swErr.message);
        swRegistration = await navigator.serviceWorker.ready;
        console.log(`✅ [FCM-CLIENT:STEP-4:SERVICE-WORKER] Using navigator.serviceWorker.ready. Scope: "${swRegistration.scope}"`);
      }

      // 4. Retrieve FCM registration token (with optional VAPID public key if defined)
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      console.log(`🔑 [FCM-CLIENT:STEP-5:TOKEN-RETRIEVAL] Calling getToken with VAPID key: ${vapidKey ? `${vapidKey.slice(0, 10)}... (present)` : 'UNDEFINED'}`);

      const token = await getToken(messaging, {
        vapidKey: vapidKey || undefined,
        serviceWorkerRegistration: swRegistration
      });

      if (!token) {
        console.error('❌ [FCM-CLIENT:STEP-5:TOKEN-RETRIEVAL] getToken returned an empty or null token.');
        return { status: 'granted', token: null, error: 'Failed to retrieve FCM token' };
      }

      console.log(`✅ [FCM-CLIENT:STEP-5:TOKEN-RETRIEVAL] Obtained FCM token: ${token.slice(0, 20)}... (len: ${token.length})`);

      // 5. Check if token already registered for this specific user session
      const userTokenKey = userId ? `trusthyre_fcm_registered_${userId}` : 'trusthyre_fcm_registered_current';
      const lastRegisteredToken = localStorage.getItem(userTokenKey);

      if (lastRegisteredToken !== token) {
        console.log(`📤 [FCM-CLIENT:STEP-6:BACKEND-SYNC] Syncing token with backend for user: ${userId || 'current'}...`);
        try {
          const resp = await apiClient.post('/api/notifications/fcm-token', {
            token,
            deviceType: 'web'
          });
          localStorage.setItem(userTokenKey, token);
          localStorage.setItem(LOCAL_STORAGE_FCM_KEY, token);
          console.log(`✅ [FCM-CLIENT:STEP-6:BACKEND-SYNC] Token successfully registered in database. Status:`, resp.data);
        } catch (apiErr: any) {
          console.error(`❌ [FCM-CLIENT:STEP-6:BACKEND-SYNC] Failed to post token to backend:`, apiErr?.response?.data || apiErr.message);
        }
      } else {
        console.log(`ℹ️ [FCM-CLIENT:STEP-6:BACKEND-SYNC] Token already synced for user "${userId || 'current'}". Skipping redundant network call.`);
      }

      return { status: 'granted', token };
    } catch (err: any) {
      console.error('❌ [FCM-CLIENT:ERROR] Push registration exception:', err.name, err.message, err);
      return { status: 'denied', error: err.message };
    }
  },

  /**
   * Unregisters device token on user logout
   */
  unregisterPushToken: async (userId?: string): Promise<void> => {
    console.log(`\n🗑️ [FCM-CLIENT:UNREGISTER] Unregistering device token...`);
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_FCM_KEY);
      if (token) {
        await apiClient.delete(`/api/notifications/fcm-token?token=${encodeURIComponent(token)}`).catch(() => {});
        localStorage.removeItem(LOCAL_STORAGE_FCM_KEY);
        if (userId) {
          localStorage.removeItem(`trusthyre_fcm_registered_${userId}`);
        }
        console.log(`✅ [FCM-CLIENT:UNREGISTER] Device push token removed from backend and localStorage.`);
      }
    } catch (err: any) {
      console.warn('⚠️ [FCM-CLIENT:UNREGISTER] Token unregister notice:', err.message);
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

      console.log('👂 [FCM-CLIENT:STEP-7:FOREGROUND-LISTENER] Attaching onMessage foreground listener to Firebase Messaging.');

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('\n🔔 [FCM-CLIENT:STEP-8:MESSAGE-RECEIVED] Received foreground push notification:', payload);
        callback(payload);
      });

      return unsubscribe;
    } catch (err: any) {
      console.warn('⚠️ [FCM-CLIENT:STEP-7:FOREGROUND-LISTENER] Foreground listener setup notice:', err.message);
      return null;
    }
  },

  /**
   * Diagnostic helper that logs the complete FCM status to DevTools console.
   */
  diagnoseFcmStatus: async () => {
    const isSupported = fcmService.isPushSupported();
    const permission = typeof Notification !== 'undefined' ? Notification.permission : 'unsupported';
    const token = localStorage.getItem(LOCAL_STORAGE_FCM_KEY);
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    console.group('🔍 [FCM-DIAGNOSTICS] Client Push Notification Health Check');
    console.log('1. Push Supported:', isSupported ? '✅ YES' : '❌ NO');
    console.log('2. Notification Permission:', permission === 'granted' ? '✅ GRANTED' : `⚠️ ${permission}`);
    console.log('3. VAPID Key Configured:', vapidKey ? `✅ YES (${vapidKey.slice(0, 12)}...)` : '❌ MISSING');
    console.log('4. Stored Token in LocalStorage:', token ? `✅ YES (${token.slice(0, 16)}...)` : '❌ NONE');
    console.groupEnd();

    return { isSupported, permission, hasVapidKey: Boolean(vapidKey), hasToken: Boolean(token) };
  }
};
