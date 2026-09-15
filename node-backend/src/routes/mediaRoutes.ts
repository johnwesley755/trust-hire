import { Hono } from 'hono';
import * as mediaController from '../controllers/mediaController';
import { authenticateJWT } from '../middlewares/auth';

const router = new Hono();

router.post('/upload', authenticateJWT, mediaController.upload);
router.delete('/:id', authenticateJWT, mediaController.remove);

export default router;
