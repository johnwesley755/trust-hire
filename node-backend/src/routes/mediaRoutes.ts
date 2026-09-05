import { Router } from 'express';
import * as mediaController from '../controllers/mediaController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.post('/upload', authenticateJWT, mediaController.upload);
router.delete('/:id', authenticateJWT, mediaController.remove);

export default router;
