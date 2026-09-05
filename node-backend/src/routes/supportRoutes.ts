import { Router } from 'express';
import * as supportController from '../controllers/supportController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

// Allow optional auth (depends on implementation)
router.post('/ticket', authenticateJWT, supportController.createTicket);

export default router;
