import { Router } from 'express';
import * as searchController from '../controllers/searchController';

const router = Router();

router.get('/jobs', searchController.searchJobs);
router.get('/workers', searchController.searchWorkers);
router.post('/index/job', searchController.indexJob);
router.delete('/index/job/:jobId', searchController.removeJob);
router.post('/index/worker', searchController.indexWorker);
router.delete('/index/worker/:userId', searchController.removeWorker);

export default router;
