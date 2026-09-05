import { Router } from 'express';
import * as workerController from '../controllers/workerController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/profile', authenticateJWT, workerController.getMyProfile);
router.put('/profile', authenticateJWT, workerController.updateProfile);
router.get('/internal/profiles/:userId/completion', workerController.getProfileCompletion);
router.post('/profiles/by-user-ids', workerController.getProfilesByUserIds);
router.post('/profile/:userId/view', workerController.incrementProfileView);
router.get('/trust-score/:userId', workerController.getTrustScore);
router.get('/stats', workerController.getGlobalStats);

export default router;
