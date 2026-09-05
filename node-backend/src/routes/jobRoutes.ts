import { Router } from 'express';
import * as jobController from '../controllers/jobController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.post('/', authenticateJWT, jobController.createJob);
router.get('/', jobController.getAllJobs);
router.get('/employer', authenticateJWT, jobController.getMyJobs);
router.get('/stats', jobController.getStats);
router.get('/:id', jobController.getJobById);
router.put('/:id', authenticateJWT, jobController.updateJob);
router.delete('/:id', authenticateJWT, jobController.deleteJob);
router.post('/by-ids', jobController.getJobsByIds);

export default router;
