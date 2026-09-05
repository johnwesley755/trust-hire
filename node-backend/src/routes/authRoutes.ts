import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.get('/me', authenticateJWT, authController.getCurrentUser);
router.post('/sync', authenticateJWT, authController.syncUser);
router.post('/oauth-sync', authController.oauthSync);

router.post('/internal/users/by-ids', authController.getUsersByIds);
router.post('/webhooks/sync', authController.handleLegacyWebhook);

export default router;
