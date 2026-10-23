import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const landingDir = path.resolve(rootDir, 'public/images/landing');
const publicDir = path.resolve(rootDir, 'public');
const assetsDir = path.resolve(rootDir, 'src/assets');

async function optimizeImages() {
  console.log('🚀 Starting image optimization with sharp...');

  // 1. Convert landing images to WebP
  if (fs.existsSync(landingDir)) {
    const files = fs.readdirSync(landingDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));
    for (const file of files) {
      const inputPath = path.join(landingDir, file);
      const nameWithoutExt = path.parse(file).name;
      const webpPath = path.join(landingDir, `${nameWithoutExt}.webp`);

      const origStat = fs.statSync(inputPath);
      await sharp(inputPath)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80, effort: 5 })
        .toFile(webpPath);

      const webpStat = fs.statSync(webpPath);
      const savings = Math.round((1 - webpStat.size / origStat.size) * 100);
      console.log(`✅ ${file} (${Math.round(origStat.size / 1024)} KB) -> ${nameWithoutExt}.webp (${Math.round(webpStat.size / 1024)} KB) [${savings}% smaller]`);
    }
  }

  // 2. Optimize public/logo.png
  const publicLogo = path.join(publicDir, 'logo.png');
  if (fs.existsSync(publicLogo)) {
    const origStat = fs.statSync(publicLogo);
    const tempLogo = path.join(publicDir, 'logo.temp.png');
    await sharp(publicLogo)
      .resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9, quality: 85 })
      .toFile(tempLogo);
    fs.renameSync(tempLogo, publicLogo);
    const newStat = fs.statSync(publicLogo);
    console.log(`✅ public/logo.png: ${Math.round(origStat.size / 1024)} KB -> ${Math.round(newStat.size / 1024)} KB`);
  }

  // 3. Optimize src/assets logos
  if (fs.existsSync(assetsDir)) {
    const assetFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png'));
    for (const file of assetFiles) {
      const inputPath = path.join(assetsDir, file);
      const origStat = fs.statSync(inputPath);
      if (origStat.size > 200 * 1024) {
        const tempPath = path.join(assetsDir, `temp-${file}`);
        await sharp(inputPath)
          .resize({ width: 800, withoutEnlargement: true })
          .png({ compressionLevel: 9, quality: 85 })
          .toFile(tempPath);
        fs.renameSync(tempPath, inputPath);
        const newStat = fs.statSync(inputPath);
        console.log(`✅ src/assets/${file}: ${Math.round(origStat.size / 1024)} KB -> ${Math.round(newStat.size / 1024)} KB`);
      }
    }
  }

  console.log('✨ All images optimized successfully!');
}

optimizeImages().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
