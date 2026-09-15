import { Hono } from 'hono';
import * as notificationController from '../controllers/notificationController';
import { authenticateJWT } from '../middlewares/auth';

const router = new Hono();

router.get('/', authenticateJWT, notificationController.getMyNotifications);
router.get('/unread/count', authenticateJWT, notificationController.getUnreadCount);
router.patch('/:id/read', authenticateJWT, notificationController.markAsRead);
router.patch('/read-all', authenticateJWT, notificationController.markAllAsRead);
router.delete('/:id', authenticateJWT, notificationController.deleteNotification);
router.delete('/all', authenticateJWT, notificationController.deleteAllNotifications);

export default router;
