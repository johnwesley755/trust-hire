import { Hono } from 'hono';
import * as activityController from '../controllers/activityController';
import { authenticateJWT } from '../middlewares/auth';

const router = new Hono();

router.get('/recent', authenticateJWT, activityController.getRecentActivities);

export default router;
