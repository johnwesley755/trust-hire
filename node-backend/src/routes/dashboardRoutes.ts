import { Hono } from 'hono';
import * as dashboardController from '../controllers/dashboardController';
import { authenticateJWT } from '../middlewares/auth';

const router = new Hono();

router.get('/worker/stats', authenticateJWT, dashboardController.getWorkerStats);
router.get('/employer/stats', authenticateJWT, dashboardController.getEmployerStats);

export default router;
