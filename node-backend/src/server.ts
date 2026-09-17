import { serve } from '@hono/node-server';
import app from './app';
import dotenv from 'dotenv';
import fs from 'fs';

// Load .env into process.env so our node server acts like Cloudflare Workers environment variables
if (fs.existsSync('.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const port = Number(process.env.PORT) || 8787;
console.log(`[Local DB Mode] Node Server is running on http://localhost:${port} (http://127.0.0.1:${port})`);
console.log(`Using Database: ${process.env.DATABASE_URL?.split('@')[1]}`);

serve({
  // Pass process.env as the Cloudflare c.env binding
  fetch: (req) => app.fetch(req, process.env, {} as any),
  port,
  hostname: '0.0.0.0'
});


