/**
 * Match each texture to the original rough-paper.webp silhouette.
 *
 * Strategy:
 * 1. Extract the alpha channel from rough-paper.webp (the paper shape)
 * 2. For each new texture, resize to 800×800 (fill, no gaps)
 * 3. Stamp the original's alpha channel onto the new texture
 * 4. Result: every texture has IDENTICAL shape/edges as the original
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

async function convert() {
  // Step 1: Extract alpha channel from original rough-paper.webp as a greyscale buffer
  const originalMeta = await sharp(originalPath).metadata();
  console.log(`Original: ${originalMeta.width}×${originalMeta.height}, ${originalMeta.channels}ch`);

  // Get the raw RGBA pixels of the original
  const { data: originalRaw, info: originalInfo } = await sharp(originalPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = originalInfo.width;   // 800
  const H = originalInfo.height;  // 800

  // Extract just the alpha channel into a single-channel greyscale buffer
  const alphaBuffer = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) {
    alphaBuffer[i] = originalRaw[i * 4 + 3]; // 4th byte = alpha
  }

  console.log(`Extracted alpha mask: ${W}×${H}\n`);

  // Step 2: Process each texture
  for (const { src, out } of TEXTURES) {
    const inputPath = path.join(srcDir, src);

    // Resize source to 800×800, flatten onto white (fill all transparent areas),
    // then get raw RGB pixels
    const { data: textureRaw } = await sharp(inputPath)
      .resize(W, H, { fit: 'cover', position: 'centre' })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .removeAlpha()
      .ensureAlpha()  // Add back a full-opaque alpha channel
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Step 3: Replace the alpha channel with the original's alpha
    for (let i = 0; i < W * H; i++) {
      textureRaw[i * 4 + 3] = alphaBuffer[i];
    }

    // Step 4: Write out as RGBA webp
    const outputPath = path.join(outDir, out);
    await sharp(textureRaw, { raw: { width: W, height: H, channels: 4 } })
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const fileSizeKB = Math.round(fs.statSync(outputPath).size / 1024);
    const meta = await sharp(outputPath).metadata();
    console.log(`✓ ${out} → ${meta.width}×${meta.height} ${meta.channels}ch ${fileSizeKB}KB`);
  }

  console.log('\nDone — all textures now have identical silhouette as rough-paper.webp');
}

convert().catch(console.error);
