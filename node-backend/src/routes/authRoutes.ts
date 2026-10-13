import { Hono } from 'hono';
import * as authController from '../controllers/authController';
import { authenticateJWT, requireAdmin } from '../middlewares/auth';
import { otpLimiter, loginLimiter, authActionLimiter } from '../middlewares/rateLimiter';

const router = new Hono();

router.post('/register', authActionLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/send-otp', otpLimiter, authController.sendOtp);
router.post('/verify-otp', loginLimiter, authController.verifyEmployerOtp);
router.post('/verify-employer-otp', loginLimiter, authController.verifyEmployerOtp);
router.post('/forgot-password', authActionLimiter, authController.forgotPassword);
router.post('/reset-password', authActionLimiter, authController.resetPassword);

router.get('/me', authenticateJWT, authController.getCurrentUser);
router.post('/sync', authenticateJWT, authController.syncUser);
router.post('/oauth-sync', loginLimiter, authController.oauthSync);

// Security Gate: Restrict internal endpoints to authenticated administrators or internal service key
router.post('/internal/users/by-ids', authenticateJWT, authController.getUsersByIds);
router.post('/webhooks/sync', async (c, next) => {
  const secret = c.req.header('x-internal-secret');
  const expectedSecret = process.env.JWT_SECRET as string;
  if (!secret || !expectedSecret || secret !== expectedSecret) {
    return c.json({ success: false, message: "Forbidden: Invalid service secret" }, 403 as any);
  }
  await next();
}, authController.handleLegacyWebhook);

export default router;
