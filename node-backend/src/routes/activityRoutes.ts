import { Router } from 'express';
import * as activityController from '../controllers/activityController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/recent', authenticateJWT, activityController.getRecentActivities);

export default router;
