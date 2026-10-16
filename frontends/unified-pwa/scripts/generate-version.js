import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const pkgPath = path.resolve(rootDir, 'package.json');
const publicDir = path.resolve(rootDir, 'public');
const versionJsonPublicPath = path.resolve(publicDir, 'version.json');
const distDir = path.resolve(rootDir, 'dist');
const versionJsonDistPath = path.resolve(distDir, 'version.json');

try {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const versionData = {
    version: pkg.version || '1.0.0',
    buildTime: new Date().toISOString(),
  };

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const payload = JSON.stringify(versionData, null, 2) + '\n';
  fs.writeFileSync(versionJsonPublicPath, payload, 'utf-8');
  console.log(`[generate-version] Wrote public/version.json: version ${versionData.version}`);

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(versionJsonDistPath, payload, 'utf-8');
    console.log(`[generate-version] Wrote dist/version.json: version ${versionData.version}`);
  }
} catch (error) {
  console.error('[generate-version] Failed to generate version.json:', error);
  process.exit(1);
}
