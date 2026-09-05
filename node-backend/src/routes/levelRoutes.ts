import { Router } from 'express';
import * as levelController from '../controllers/levelController';

const router = Router();

router.get('/worker/:userId', levelController.getLevelDetails);
router.get('/progress/:userId', levelController.getLevelProgress);

export default router;
