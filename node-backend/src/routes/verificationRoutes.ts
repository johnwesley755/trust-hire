import { Hono } from 'hono';
import * as verificationController from '../controllers/verificationController';
import { authenticateJWT } from '../middlewares/auth';
import multer from 'multer';

const router = new Hono();
router.post('/upload-doc', authenticateJWT, verificationController.uploadDoc);
router.post('/capture-live', authenticateJWT, verificationController.captureLive);
router.get('/status', authenticateJWT, verificationController.getStatus);

export default router;
