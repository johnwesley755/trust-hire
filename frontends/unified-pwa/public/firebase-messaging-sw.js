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

const messaging = firebase.messaging();

// Handle background push messages when PWA tab is closed or unfocused
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background push payload received:', payload);

  const title = payload.notification?.title || payload.data?.title || 'TrustHyre Notification';
  const body = payload.notification?.body || payload.data?.body || payload.data?.message || 'You have a new update on TrustHyre.';
  const link = payload.data?.url || payload.data?.link || '/notifications';

  const notificationOptions = {
    body,
    icon: '/logo.png',
    badge: '/src/assets/TrustHyre Logo with Skills Tagline Header.png',
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
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a TrustHyre window is already open, focus it and navigate
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if ('navigate' in client && targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
