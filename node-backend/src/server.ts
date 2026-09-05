import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './config/prisma';
import { startJobExpiryScheduler } from './scheduler/jobExpiryScheduler';

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await prisma.$connect();
    startJobExpiryScheduler();
    console.log('Database connected successfully to PostgreSQL (trusthire_auth_db).');

    app.listen(PORT, () => {
      console.log(`TrustHire Node.js Monolith running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
