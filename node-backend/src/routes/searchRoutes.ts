import { Hono } from 'hono';
import * as searchController from '../controllers/searchController';
import { optionalAuth } from '../middlewares/auth';

const router = new Hono();

router.get('/jobs', searchController.searchJobs);
router.get('/workers', optionalAuth, searchController.searchWorkers);
router.post('/index/job', searchController.indexJob);
router.delete('/index/job/:jobId', searchController.removeJob);
router.post('/index/worker', searchController.indexWorker);
router.delete('/index/worker/:userId', searchController.removeWorker);

export default router;
