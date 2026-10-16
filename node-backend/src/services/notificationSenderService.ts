import { NotificationDispatcher, sendNotification as dispatchSendNotification } from './notificationDispatcher';

export const sendNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  link?: string
) => {
  return dispatchSendNotification(userId, title, message, type, link);
};

export { NotificationDispatcher };
