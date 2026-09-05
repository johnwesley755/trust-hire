import { Router } from 'express';
import * as ratingController from '../controllers/ratingController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.post('/', authenticateJWT, ratingController.submitRating);
router.get('/user/:rateeId', ratingController.getForUser);
router.get('/user/:rateeId/average', ratingController.getAverage);
router.get('/my', authenticateJWT, ratingController.getMyRatings);
router.get('/:id', ratingController.getById);

export default router;
