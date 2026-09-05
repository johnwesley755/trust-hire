import { Router } from 'express';
import * as settingsController from '../controllers/settingsController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/', authenticateJWT, settingsController.getSettings);
router.put('/', authenticateJWT, settingsController.updateSettings);
router.post('/password', authenticateJWT, settingsController.changePassword);

export default router;
