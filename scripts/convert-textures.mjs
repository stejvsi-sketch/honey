/**
 * Convert textures to match original rough-paper.webp dimensions.
 * Convert to GRAYSCALE+ALPHA so user's chosen color dominates via multiply blend.
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'new');
const outDir = path.join(__dirname, '..', 'public', 'textures');
const originalPath = path.join(outDir, 'rough-paper.webp');

const TEXTURES = [
  { src: '—Pngtree—distressed lined notebook paper with_23090644.png', out: 'distressed-lined.webp' },
  { src: '—Pngtree—pieces of vintage torn paper_14595040.png', out: 'vintage-torn-pieces.webp' },
  { src: '—Pngtree—rough paper texture png rice_21045671.png', out: 'rough-rice-paper.webp' },
  { src: '—Pngtree—rough vintage paper for frame_14639481.png', out: 'rough-vintage-frame.webp' },
  { src: '—Pngtree—torn green paper with rough_21452846.png', out: 'torn-green-rough.webp' },
  { src: '—Pngtree—vintage scrap book old paoer_15749458.png', out: 'vintage-scrapbook.webp' },
  { src: '—Pngtree—worn and torn aged paring_23090631.png', out: 'worn-aged-paring.webp' },
];

async function getOpaqueBounds(filePath) {
  const { info } = await sharp(filePath).trim().toBuffer({ resolveWithObject: true });
  const meta = await sharp(filePath).metadata();
  return {
    canvasW: meta.width, canvasH: meta.height,
    contentX: info.trimOffsetLeft, contentY: info.trimOffsetTop,
    contentW: info.width, contentH: info.height,
  };
}

async function convert() {
  console.log('Analyzing original rough-paper.webp...');
  const orig = await getOpaqueBounds(originalPath);
  console.log(`  Content: ${orig.contentW}×${orig.contentH} at (${orig.contentX},${orig.contentY})\n`);

  for (const { src, out } of TEXTURES) {
    const inputPath = path.join(srcDir, src);
    const outputPath = path.join(outDir, out);

    // Trim to opaque content
    const trimmed = await sharp(inputPath).trim().toBuffer();

    // Resize to match original content dimensions, then desaturate to grayscale
    const resized = await sharp(trimmed)
      .resize(orig.contentW, orig.contentH, { fit: 'fill' })
      .grayscale()  // Strip color — only grain/marks remain
      .toBuffer();

    // Place on 800×800 transparent canvas at the original's position
    await sharp({
      create: { width: 800, height: 800, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: resized, left: orig.contentX, top: orig.contentY }])
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const fileSize = Math.round(fs.statSync(outputPath).size / 1024);
    console.log(`✓ ${out} → ${fileSize}KB (grayscale)`);
  }
  console.log('\nDone.');
}

convert().catch(console.error);
