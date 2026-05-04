import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, '..', 'rough-paper.png');
const outputPath = path.join(__dirname, '..', 'public', 'textures', 'rough-paper.webp');

// Ensure output directory exists
import { mkdirSync } from 'fs';
mkdirSync(path.join(__dirname, '..', 'public', 'textures'), { recursive: true });

async function compress() {
  const info = await sharp(inputPath)
    .resize(800, 800, { fit: 'cover' })
    .webp({ quality: 65 })
    .toFile(outputPath);

  console.log(`✅ Compressed: ${(info.size / 1024).toFixed(1)} KB`);
  console.log(`   Dimensions: ${info.width}x${info.height}`);
}

compress().catch(console.error);
