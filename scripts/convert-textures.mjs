/**
 * Match new textures to the original rough-paper.webp dimensions.
 *
 * Strategy:
 * 1. Measure rough-paper.webp's opaque bounding box (the paper shape within 800×800)
 * 2. For each new texture: trim to its opaque content, resize to match the original's
 *    bounding box dimensions, and place at the same position on an 800×800 RGBA canvas
 *
 * Result: Every texture has the same visible footprint as the original.
 * Each texture is used as BOTH the mask and the grain (like the original).
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
  { src: '—Pngtree—aged torn paper stack with_24277239.png', out: 'aged-torn-stack.webp' },
  { src: '—Pngtree—distressed lined notebook paper with_23090644.png', out: 'distressed-lined.webp' },
  { src: '—Pngtree—pieces of vintage torn paper_14595040.png', out: 'vintage-torn-pieces.webp' },
  { src: '—Pngtree—rough paper texture png rice_21045671.png', out: 'rough-rice-paper.webp' },
  { src: '—Pngtree—rough vintage paper for frame_14639481.png', out: 'rough-vintage-frame.webp' },
  { src: '—Pngtree—torn green paper with rough_21452846.png', out: 'torn-green-rough.webp' },
  { src: '—Pngtree—vintage scrap book old paoer_15749458.png', out: 'vintage-scrapbook.webp' },
  { src: '—Pngtree—worn and torn aged paring_23090631.png', out: 'worn-aged-paring.webp' },
];

/**
 * Get the bounding box of opaque pixels in an image.
 * Uses sharp's trim() to find content bounds.
 */
async function getOpaqueBounds(filePath) {
  const { info } = await sharp(filePath)
    .trim()
    .toBuffer({ resolveWithObject: true });
  
  // trim() returns trimOffsetLeft, trimOffsetTop in info
  const meta = await sharp(filePath).metadata();
  
  return {
    canvasW: meta.width,
    canvasH: meta.height,
    contentX: info.trimOffsetLeft,
    contentY: info.trimOffsetTop,
    contentW: info.width,
    contentH: info.height,
  };
}

async function convert() {
  // Step 1: Measure the original
  console.log('Analyzing original rough-paper.webp...');
  const orig = await getOpaqueBounds(originalPath);
  console.log(`  Canvas: ${orig.canvasW}×${orig.canvasH}`);
  console.log(`  Content bounds: x=${orig.contentX}, y=${orig.contentY}, w=${orig.contentW}, h=${orig.contentH}`);
  console.log(`  Content coverage: ${((orig.contentW * orig.contentH) / (orig.canvasW * orig.canvasH) * 100).toFixed(1)}%`);
  console.log('');

  // Step 2: Process each new texture
  for (const { src, out } of TEXTURES) {
    const inputPath = path.join(srcDir, src);
    const outputPath = path.join(outDir, out);

    // Get the source's opaque content bounds
    const srcBounds = await getOpaqueBounds(inputPath);
    console.log(`${out}:`);
    console.log(`  Source: ${srcBounds.canvasW}×${srcBounds.canvasH}, content: ${srcBounds.contentW}×${srcBounds.contentH} at (${srcBounds.contentX},${srcBounds.contentY})`);

    // Trim to just the opaque content
    const trimmed = await sharp(inputPath).trim().toBuffer();

    // Resize trimmed content to match the original's content dimensions
    const resized = await sharp(trimmed)
      .resize(orig.contentW, orig.contentH, { fit: 'fill' })
      .toBuffer();

    // Place on an 800×800 transparent canvas at the same position as the original
    const canvas = sharp({
      create: {
        width: 800,
        height: 800,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    }).composite([{
      input: resized,
      left: orig.contentX,
      top: orig.contentY,
    }]);

    await canvas
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const fileSize = Math.round(fs.statSync(outputPath).size / 1024);
    const outMeta = await sharp(outputPath).metadata();
    console.log(`  Output: ${outMeta.width}×${outMeta.height} ${outMeta.channels}ch ${fileSize}KB`);
    console.log('');
  }

  console.log('Done — all textures matched to original dimensions.');
}

convert().catch(console.error);
