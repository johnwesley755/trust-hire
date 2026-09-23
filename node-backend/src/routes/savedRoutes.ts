import { Hono } from 'hono';
import { 
  getSavedJobs, 
  saveJob, 
  removeSavedJob, 
  getSavedWorkers, 
  saveWorker, 
  removeSavedWorker 
} from '../controllers/savedController';
import { authenticateJWT } from '../middlewares/auth';

const savedRoutes = new Hono();

savedRoutes.use('*', authenticateJWT);

// Saved Jobs Endpoints (Workers / Candidates)
savedRoutes.get('/jobs', getSavedJobs);
savedRoutes.post('/jobs', saveJob);
savedRoutes.delete('/jobs/:jobId', removeSavedJob);

// Saved Worker Profiles Endpoints (Employers)
savedRoutes.get('/workers', getSavedWorkers);
savedRoutes.post('/workers', saveWorker);
savedRoutes.delete('/workers/:workerId', removeSavedWorker);

export default savedRoutes;
