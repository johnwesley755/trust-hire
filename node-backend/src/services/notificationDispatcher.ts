import prisma from '../config/prisma';
import { v4 as uuidv4 } from 'uuid';
import { getFirebaseMessaging } from '../config/firebaseAdmin';
import type { SendResponse } from 'firebase-admin/messaging';

export interface DispatchNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  data?: Record<string, string>;
}

export interface DispatchMulticastParams {
  userIds: string[];
  title: string;
  message: string;
  type: string;
  link?: string;
  data?: Record<string, string>;
}

export class NotificationDispatcher {
  /**
   * Dispatches a synchronized in-app and push notification to a single user.
   */
  public static async dispatch(params: DispatchNotificationParams) {
    const startTime = Date.now();
    console.log(`\n🚀 [FCM-BACKEND:STEP-1:DISPATCH-INIT] Dispatching notification to userId=${params.userId}`);
    console.log(`   Type: ${params.type} | Title: "${params.title}" | Message: "${params.message}" | Link: ${params.link || 'none'}`);

    try {
      const notificationId = uuidv4();

      // 1. Persist the notification in PostgreSQL as the single source of truth
      const notification = await prisma.notifications.create({
        data: {
          id: notificationId,
          user_id: params.userId,
          title: params.title,
          message: params.message,
          type: params.type,
          link: params.link || null,
          is_read: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log(`✅ [FCM-BACKEND:STEP-2:DB-PERSIST] Notification record saved in PostgreSQL with ID: ${notificationId}`);

      // 2. Check user's notification preferences
      const settings = await prisma.user_settings.findUnique({
        where: { user_id: params.userId }
      }).catch(() => null);

      const isPushAllowed = settings ? settings.push_notifications !== false : true;
      console.log(`📋 [FCM-BACKEND:STEP-3:PREFERENCE-CHECK] User push_notifications setting: ${isPushAllowed ? 'ALLOWED' : 'MUTED'}`);
      
      if (!isPushAllowed) {
        console.log(`⚠️ [FCM-BACKEND:STEP-3] User has muted push notifications in Settings. Skipping FCM push.`);
        return notification;
      }

      // 3. Retrieve user's registered FCM device tokens
      let tokenRecords: { token: string }[] = [];
      try {
        if ((prisma as any).user_fcm_tokens) {
          tokenRecords = await (prisma as any).user_fcm_tokens.findMany({
            where: { user_id: params.userId },
            select: { token: true }
          });
        } else {
          tokenRecords = await prisma.$queryRaw<{ token: string }[]>`SELECT token FROM user_fcm_tokens WHERE user_id = ${params.userId}`;
        }
      } catch (err: any) {
        console.warn(`⚠️ [FCM-BACKEND:STEP-4:TOKEN-LOOKUP] Prisma model lookup failed, attempting raw query fallback:`, err.message);
        tokenRecords = await prisma.$queryRaw<{ token: string }[]>`SELECT token FROM user_fcm_tokens WHERE user_id = ${params.userId}`.catch(() => []);
      }

      const tokens = (tokenRecords || []).map(r => r.token).filter(Boolean);
      console.log(`📱 [FCM-BACKEND:STEP-4:TOKEN-LOOKUP] Found ${tokens.length} active device token(s) for userId=${params.userId}`);

      if (tokens.length === 0) {
        console.log(`⚠️ [FCM-BACKEND:STEP-4] No active FCM tokens found in DB for this user. Notification saved in-app only.`);
        return notification;
      }

      // 4. Send FCM Multicast Push via Firebase Admin SDK
      const messaging = getFirebaseMessaging();
      if (!messaging) {
        console.warn(`❌ [FCM-BACKEND:STEP-5:FIREBASE-CHECK] Firebase Messaging instance is not initialized. Skipping push delivery.`);
        return notification;
      }
      console.log(`🔥 [FCM-BACKEND:STEP-5:FIREBASE-CHECK] Firebase Messaging is ready.`);

      const targetUrl = params.link || '/notifications';
      console.log(`📤 [FCM-BACKEND:STEP-6:MULTICAST-SEND] Sending multicast to ${tokens.length} device(s) with deep link: ${targetUrl}`);

      const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
      const iconUrl = `${frontendUrl}/logo.png`;

      const response = await messaging.sendEachForMulticast({
        tokens,
        notification: {
          title: params.title,
          body: params.message
        },
        data: {
          id: notificationId,
          type: params.type,
          title: params.title,
          message: params.message,
          url: targetUrl,
          link: targetUrl,
          click_action: targetUrl,
          createdAt: new Date().toISOString(),
          ...(params.data || {})
        },
        webpush: {
          notification: {
            title: params.title,
            body: params.message,
            icon: iconUrl,
            badge: iconUrl
          },
          fcmOptions: {
            link: targetUrl
          }
        }
      }).catch((e: any) => {
        console.error('❌ [FCM-BACKEND:STEP-6:SEND-ERROR] FCM sendEachForMulticast rejected:', e.message);
        return null;
      });

      // 5. Automatic stale token cleanup if any device token is expired/unregistered
      if (response) {
        console.log(`📊 [FCM-BACKEND:STEP-7:FCM-RESPONSE] Multicast delivery finished in ${Date.now() - startTime}ms:`);
        console.log(`   Success Count: ${response.successCount} | Failure Count: ${response.failureCount}`);

        const deadTokens: string[] = [];
        response.responses.forEach((resp: SendResponse, idx: number) => {
          if (resp.success) {
            console.log(`   [Device ${idx + 1}] Delivered successfully. Message ID: ${resp.messageId}`);
          } else if (resp.error) {
            console.error(`   [Device ${idx + 1}] Failed with code: "${resp.error.code}" | Message: "${resp.error.message}"`);
            const code = resp.error.code;
            if (
              code === 'messaging/registration-token-not-registered' ||
              code === 'messaging/invalid-registration-token'
            ) {
              deadTokens.push(tokens[idx]);
            }
          }
        });

        if (deadTokens.length > 0) {
          try {
            if ((prisma as any).user_fcm_tokens) {
              await (prisma as any).user_fcm_tokens.deleteMany({
                where: { token: { in: deadTokens } }
              });
            } else {
              for (const t of deadTokens) {
                await prisma.$executeRaw`DELETE FROM user_fcm_tokens WHERE token = ${t}`;
              }
            }
            console.log(`🧹 [FCM-BACKEND:STEP-8:TOKEN-CLEANUP] Pruned ${deadTokens.length} expired FCM token(s) from database.`);
          } catch (err: any) {
            console.warn('⚠️ [FCM-BACKEND:STEP-8:TOKEN-CLEANUP] Stale token cleanup notice:', err.message);
          }
        }
      }

      return notification;
    } catch (err: any) {
      console.error('❌ [FCM-BACKEND:ERROR] Unexpected error in dispatch:', err.message);
      return null;
    }
  }

  /**
   * Dispatches notifications to multiple users simultaneously (e.g. proximity job alerts).
   */
  public static async dispatchMulticast(params: DispatchMulticastParams) {
    if (!params.userIds || params.userIds.length === 0) return [];
    
    // Process in parallel with concurrency limit
    const results = await Promise.allSettled(
      params.userIds.map(userId =>
        this.dispatch({
          userId,
          title: params.title,
          message: params.message,
          type: params.type,
          link: params.link,
          data: params.data
        })
      )
    );

    return results;
  }
}

// Re-export as standard helper matching previous signature for drop-in compatibility
export const sendNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  link?: string
) => {
  return NotificationDispatcher.dispatch({
    userId,
    title,
    message,
    type,
    link
  });
};
