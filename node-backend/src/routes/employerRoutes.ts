import { Router } from 'express';
import * as employerController from '../controllers/employerController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/:userId', employerController.getEmployerProfile);
router.put('/:userId', authenticateJWT, employerController.updateEmployerProfile);

export default router;
