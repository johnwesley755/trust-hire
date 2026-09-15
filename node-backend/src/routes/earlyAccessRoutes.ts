import { Hono } from 'hono';
import * as earlyAccessController from '../controllers/earlyAccessController';

const router = new Hono();

router.post('/', earlyAccessController.requestEarlyAccess);

export default router;
