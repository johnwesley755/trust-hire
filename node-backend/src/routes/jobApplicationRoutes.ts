import { Hono } from 'hono';
import * as jobApplicationController from '../controllers/jobApplicationController';
import { authenticateJWT } from '../middlewares/auth';

const router = new Hono();

router.post('/', authenticateJWT, jobApplicationController.applyForJob);
router.post('/dispatch-offer', authenticateJWT, jobApplicationController.dispatchOffer);
router.get('/my', authenticateJWT, jobApplicationController.getMyApplications);
router.get('/job/:jobId', authenticateJWT, jobApplicationController.getJobApplications);
router.post('/by-jobs', authenticateJWT, jobApplicationController.getApplicationsByJobs);
router.patch('/:applicationId/status', authenticateJWT, jobApplicationController.updateApplicationStatus);
router.patch('/:id/status-old', authenticateJWT, jobApplicationController.updateApplicationStatus);

export default router;
