import { Hono } from 'hono';
import * as workerController from '../controllers/workerController';
import { authenticateJWT, optionalAuth } from '../middlewares/auth';

const router = new Hono();

router.get('/profile', authenticateJWT, workerController.getMyProfile);
router.put('/profile', authenticateJWT, workerController.updateProfile);
router.get('/internal/profiles/:userId/completion', workerController.getProfileCompletion);
router.post('/profiles/by-user-ids', optionalAuth, workerController.getProfilesByUserIds);
router.post('/profile/:userId/view', workerController.incrementProfileView);
router.get('/trust-score/:userId', workerController.getTrustScore);
router.get('/stats', workerController.getGlobalStats);

export default router;
