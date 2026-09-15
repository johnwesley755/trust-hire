import { Hono } from 'hono';
import * as employerController from '../controllers/employerController';
import { authenticateJWT } from '../middlewares/auth';

const router = new Hono();

router.get('/profile', authenticateJWT, employerController.getEmployerProfile);
router.post('/profile', authenticateJWT, employerController.updateEmployerProfile);
router.get('/:userId', employerController.getEmployerProfile);
router.put('/:userId', authenticateJWT, employerController.updateEmployerProfile);

export default router;
