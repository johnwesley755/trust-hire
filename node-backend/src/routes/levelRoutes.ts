import { Hono } from 'hono';
import * as levelController from '../controllers/levelController';

const router = new Hono();

router.get('/worker/:userId', levelController.getLevelDetails);
router.get('/progress/:userId', levelController.getLevelProgress);

export default router;
