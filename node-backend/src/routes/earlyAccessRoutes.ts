import { Hono } from 'hono';
import * as earlyAccessController from '../controllers/earlyAccessController';
import { authActionLimiter } from '../middlewares/rateLimiter';

const router = new Hono();

router.post('/', authActionLimiter, earlyAccessController.requestEarlyAccess);

export default router;
