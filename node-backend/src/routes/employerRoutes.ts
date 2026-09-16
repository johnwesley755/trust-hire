import { Hono } from 'hono';
import * as employerController from '../controllers/employerController';
import * as dashboardController from '../controllers/dashboardController';
import { authenticateJWT } from '../middlewares/auth';

const router = new Hono();

router.get('/profile', authenticateJWT, employerController.getEmployerProfile);
router.post('/profile', authenticateJWT, employerController.updateEmployerProfile);
router.put('/profile', authenticateJWT, employerController.updateEmployerProfile);

router.get('/me', authenticateJWT, employerController.getEmployerProfile);
router.post('/me', authenticateJWT, employerController.updateEmployerProfile);
router.put('/me', authenticateJWT, employerController.updateEmployerProfile);

router.get('/stats', authenticateJWT, dashboardController.getEmployerStats);
router.post('/complete-onboarding', authenticateJWT, employerController.updateEmployerProfile);
router.put('/tier', authenticateJWT, employerController.updateEmployerTier);

router.get('/:userId', employerController.getEmployerProfile);
router.put('/:userId', authenticateJWT, employerController.updateEmployerProfile);
router.post('/:userId', authenticateJWT, employerController.updateEmployerProfile);

export default router;
