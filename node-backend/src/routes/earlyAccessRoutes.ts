import { Router } from 'express';
import * as earlyAccessController from '../controllers/earlyAccessController';

const router = Router();

router.post('/', earlyAccessController.requestEarlyAccess);

export default router;
