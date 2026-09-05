import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/worker/stats', authenticateJWT, dashboardController.getWorkerStats);
router.get('/employer/stats', authenticateJWT, dashboardController.getEmployerStats);

export default router;
