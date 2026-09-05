import { Router } from 'express';
import * as skillTestController from '../controllers/skillTestController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/', skillTestController.getAvailableTests);
router.get('/available', skillTestController.getAvailableTests);
router.get('/results/worker/:workerId', skillTestController.getWorkerResults);
router.get('/:id', skillTestController.getTestById);
router.post('/submit', authenticateJWT, skillTestController.submitResult);
router.post('/:id/submit', authenticateJWT, skillTestController.submitResult);

export default router;
