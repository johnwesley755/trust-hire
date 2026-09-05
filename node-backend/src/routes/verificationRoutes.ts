import { Router } from 'express';
import * as verificationController from '../controllers/verificationController';
import { authenticateJWT } from '../middlewares/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: '/tmp/uploads/' });

router.post('/upload-doc', authenticateJWT, upload.single('file'), verificationController.uploadDoc);
router.post('/capture-live', authenticateJWT, upload.single('file'), verificationController.captureLive);
router.get('/status', authenticateJWT, verificationController.getStatus);

export default router;
