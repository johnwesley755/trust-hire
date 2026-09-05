import prisma from '../config/prisma';
import { v4 as uuidv4 } from 'uuid';

export const sendNotification = async (userId: string, title: string, message: string, type: string) => {
  try {
    const notification = await prisma.notifications.create({
      data: {
        id: uuidv4(),
        user_id: userId,
        title,
        message,
        type,
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    return notification;
  } catch (error) {
    console.error("Error sending notification", error);
  }
};
