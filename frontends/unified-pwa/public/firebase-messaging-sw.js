// Firebase Cloud Messaging (FCM) Background Service Worker for TrustHyre
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// Initialize Firebase App in Service Worker context
firebase.initializeApp({
  apiKey: "AIzaSyC4gevbnB8eDxk5nskKjf5Nepr_9tVxThE",
  authDomain: "trust-hire-6edba.firebaseapp.com",
  projectId: "trust-hire-6edba",
  storageBucket: "trust-hire-6edba.firebasestorage.app",
  messagingSenderId: "824793842854",
  appId: "1:824793842854:web:c892195f74ebb3ae43e067"
});

console.log('👷 [FCM-SW:STEP-1:INIT] Initializing Firebase Cloud Messaging Background Service Worker...');

const messaging = firebase.messaging();

// Handle background push messages when PWA tab is closed or unfocused
messaging.onBackgroundMessage((payload) => {
  console.log('\n🔔 [FCM-SW:STEP-2:BACKGROUND-MESSAGE] Received background push payload:', payload);

  // If the push already has a top-level notification object, the Firebase/Chrome runtime automatically displays it.
  // Manually calling showNotification in that case creates a DUPLICATE notification.
  if (payload.notification) {
    console.log('ℹ️ [FCM-SW:STEP-3:AUTO-HANDLED] Top-level notification payload detected. Automatic WebPush display handled by browser.');
    return;
  }

  // Handle data-only push messages manually with TrustHyre branding
  const title = payload.data?.title || 'TrustHyre Notification';
  const body = payload.data?.body || payload.data?.message || 'You have a new update on TrustHyre.';
  const link = payload.data?.url || payload.data?.link || '/notifications';

  console.log(`📢 [FCM-SW:STEP-3:SHOW-NOTIFICATION] Displaying branded notification: "${title}" -> ${link}`);

  const notificationOptions = {
    body,
    icon: '/logo.png',
    badge: '/logo.png',
    data: {
      url: link,
      timestamp: Date.now()
    },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'Open TrustHyre' }
    ]
  };

  return self.registration.showNotification(title, notificationOptions);
});

// Handle notification click to focus existing tab or navigate
self.addEventListener('notificationclick', (event) => {
  console.log('\n👆 [FCM-SW:STEP-4:NOTIFICATION-CLICK] Notification clicked:', event.notification);
  event.notification.close();

  // Extract target URL whether created via webpush options, FCM_MSG, or custom data
  let targetPath = '/notifications';
  const data = event.notification.data;
  if (data) {
    targetPath = data.url || 
                 data.link || 
                 data.click_action || 
                 data?.FCM_MSG?.notification?.click_action ||
                 data?.FCM_MSG?.fcmOptions?.link ||
                 targetPath;
  }

  const fullTargetUrl = new URL(targetPath, self.location.origin).href;
  console.log(`   Navigating client to: ${fullTargetUrl}`);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a TrustHyre window is already open, focus it and navigate
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if ('navigate' in client && targetPath) {
            client.navigate(targetPath);
          }
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(fullTargetUrl);
      }
    })
  );
});
