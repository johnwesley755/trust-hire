import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import workerRoutes from './routes/workerRoutes';
import employerRoutes from './routes/employerRoutes';
import jobRoutes from './routes/jobRoutes';
import mediaRoutes from './routes/mediaRoutes';
import activityRoutes from './routes/activityRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import earlyAccessRoutes from './routes/earlyAccessRoutes';
import jobApplicationRoutes from './routes/jobApplicationRoutes';
import levelRoutes from './routes/levelRoutes';
import notificationRoutes from './routes/notificationRoutes';
import ratingRoutes from './routes/ratingRoutes';
import searchRoutes from './routes/searchRoutes';
import settingsRoutes from './routes/settingsRoutes';
import skillTestRoutes from './routes/skillTestRoutes';
import supportRoutes from './routes/supportRoutes';
import verificationRoutes from './routes/verificationRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/early-access', earlyAccessRoutes);
app.use('/api/jobs/applications', jobApplicationRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/skill-tests', skillTestRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/verification', verificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;
