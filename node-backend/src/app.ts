import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Fix: Prevent "Do not know how to serialize a BigInt" in JSON.stringify
(BigInt.prototype as any).toJSON = function () {
  const intVal = Number(this);
  return Number.isSafeInteger(intVal) ? intVal : this.toString();
};

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
import verificationRoutes from './routes/verificationRoutes';
import savedRoutes from './routes/savedRoutes';
import adminRoutes from './routes/adminRoutes';
import { leadRouter } from './routes/leadRoutes';

export type AppContext = {
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
};

const app = new Hono<AppContext>();

app.use('*', async (c, next) => {
  if (typeof process === 'undefined') {
    (globalThis as any).process = { env: c.env };
  } else {
    Object.assign(process.env, c.env || {});
  }
  await next();
});

app.use('*', logger());
app.use('*', cors({ origin: (origin) => origin || '*', allowHeaders: ['Content-Type', 'Authorization'], allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'], credentials: true }));
app.options('*', (c) => c.body(null, 204));

app.route('/api/auth', authRoutes);
app.route('/api/worker', workerRoutes);
app.route('/api/employer', employerRoutes);
app.route('/api/jobs', jobRoutes);
app.route('/api/media', mediaRoutes);
app.route('/api/activities', activityRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/early-access', earlyAccessRoutes);
app.route('/api/jobs/applications', jobApplicationRoutes);
app.route('/api/levels', levelRoutes);
app.route('/api/notifications', notificationRoutes);
app.route('/api/ratings', ratingRoutes);
app.route('/api/search', searchRoutes);
app.route('/api/settings', settingsRoutes);
app.route('/api/skill-tests', skillTestRoutes);
app.route('/api/verification', verificationRoutes);
app.route('/api/saved', savedRoutes);
app.route('/api/admin/leads', leadRouter);
app.route('/api/admin', adminRoutes);

app.get('/api/health', (c) => {
  return c.json({ status: 'UP', runtime: 'Hono' });
});

app.onError((err, c) => {
  console.error('Unhandled Application Error:', err);
  const origin = c.req.header('Origin') || '*';
  c.header('Access-Control-Allow-Origin', origin);
  c.header('Access-Control-Allow-Credentials', 'true');
  return c.json({ success: false, message: err?.message || 'Internal Server Error' }, 500);
});

export default app;


