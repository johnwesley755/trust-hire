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

      // 2. Check user's notification preferences
      const settings = await prisma.user_settings.findUnique({
        where: { user_id: params.userId }
      }).catch(() => null);

      const isPushAllowed = settings ? settings.push_notifications !== false : true;
      if (!isPushAllowed) {
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
      } catch (err) {
        tokenRecords = await prisma.$queryRaw<{ token: string }[]>`SELECT token FROM user_fcm_tokens WHERE user_id = ${params.userId}`.catch(() => []);
      }

      const tokens = (tokenRecords || []).map(r => r.token).filter(Boolean);
      if (tokens.length === 0) {
        return notification;
      }

      // 4. Send FCM Multicast Push via Firebase Admin SDK
      const messaging = getFirebaseMessaging();
      if (messaging && tokens.length > 0) {
        const targetUrl = params.link || '/notifications';
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
              icon: '/logo.png',
              badge: '/src/assets/TrustHyre Logo with Skills Tagline Header.png'
            },
            fcmOptions: {
              link: targetUrl
            }
          }
        }).catch((e: any) => {
          console.warn('[NotificationDispatcher] FCM sendEachForMulticast notice:', e.message);
          return null;
        });

        // 5. Automatic stale token cleanup if any device token is expired/unregistered
        if (response && response.failureCount > 0) {
          const deadTokens: string[] = [];
          response.responses.forEach((resp: SendResponse, idx: number) => {
            if (!resp.success && resp.error) {
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
              console.log(`[NotificationDispatcher] Pruned ${deadTokens.length} expired FCM token(s).`);
            } catch (err: any) {
              console.warn('[NotificationDispatcher] Stale token cleanup notice:', err.message);
            }
          }
        }
      }

      return notification;
    } catch (err: any) {
      console.error('[NotificationDispatcher] Error dispatching notification:', err.message);
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
