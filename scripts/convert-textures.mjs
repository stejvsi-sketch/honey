/**
 * Re-convert texture PNGs → 800×800 webp, FLATTENED onto white.
 *
 * Why flatten? The source PNGs are paper cutouts with transparent backgrounds.
 * The card mask is always rough-paper.webp (defines the torn-paper shape).
 * The texture grain overlay uses mix-blend-mode: multiply, so:
 *   white × any color = that color (invisible)
 *   texture grain × card color = textured result
 *
 * Flattening removes ALL transparency → the texture fills every pixel of the
 * 800×800 canvas → no gaps inside the mask shape.
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'new');
const outDir = path.join(__dirname, '..', 'public', 'textures');

const TEXTURES = [
  { src: '—Pngtree—aged torn paper stack with_24277239.png', out: 'aged-torn-stack.webp' },
  { src: '—Pngtree—distressed lined notebook paper with_23090644.png', out: 'distressed-lined.webp' },
  { src: '—Pngtree—pieces of vintage torn paper_14595040.png', out: 'vintage-torn-pieces.webp' },
  { src: '—Pngtree—rough paper texture png rice_21045671.png', out: 'rough-rice-paper.webp' },
  { src: '—Pngtree—rough vintage paper for frame_14639481.png', out: 'rough-vintage-frame.webp' },
  { src: '—Pngtree—torn green paper with rough_21452846.png', out: 'torn-green-rough.webp' },
  { src: '—Pngtree—vintage scrap book old paoer_15749458.png', out: 'vintage-scrapbook.webp' },
  { src: '—Pngtree—worn and torn aged paring_23090631.png', out: 'worn-aged-paring.webp' },
];

async function convert() {
  for (const { src, out } of TEXTURES) {
    const inputPath = path.join(srcDir, src);
    const outputPath = path.join(outDir, out);

    await sharp(inputPath)
      .resize(800, 800, { fit: 'cover', position: 'centre' })
      .flatten({ background: { r: 255, g: 255, b: 255 } })  // Kill all transparency
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const stats = await sharp(outputPath).metadata();
    const fileSizeKB = Math.round((await import('fs')).statSync(outputPath).size / 1024);
    console.log(`✓ ${out} → ${stats.width}×${stats.height} ${stats.format} ${stats.channels}ch ${fileSizeKB}KB`);
  }
  console.log('\nDone — all textures flattened onto white.');
}

convert().catch(console.error);
