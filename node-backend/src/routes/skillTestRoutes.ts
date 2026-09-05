import { Router } from 'express';
import * as skillTestController from '../controllers/skillTestController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/available', skillTestController.getAvailableTests);
router.get('/:id', skillTestController.getTestById);
router.post('/submit', authenticateJWT, skillTestController.submitResult);

export default router;
