/**
 * Convert new paper texture PNGs to optimized webp format.
 * Matches the original rough-paper.webp specs: 800×800, RGBA, ~70KB webp.
 * 
 * Each image gets a short, URL-friendly name and is saved to public/textures/.
 */
import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, resolve } from 'path';

const INPUT_DIR = resolve('new');
const OUTPUT_DIR = resolve('public/textures');

// Map original filenames to clean, short names for the textures
const NAME_MAP = [
  { match: 'aged torn paper stack',    output: 'aged-torn-stack' },
  { match: 'distressed lined notebook', output: 'distressed-lined' },
  { match: 'pieces of vintage torn',   output: 'vintage-torn-pieces' },
  { match: 'rough paper texture png rice', output: 'rough-rice-paper' },
  { match: 'rough vintage paper for frame', output: 'rough-vintage-frame' },
  { match: 'torn green paper with rough',   output: 'torn-green-rough' },
  { match: 'vintage scrap book',       output: 'vintage-scrapbook' },
  { match: 'worn and torn aged paring', output: 'worn-aged-paring' },
];

function getOutputName(filename) {
  const lower = filename.toLowerCase();
  for (const entry of NAME_MAP) {
    if (lower.includes(entry.match)) return entry.output;
  }
  // Fallback: sanitize the filename
  return filename
    .replace(/[—]/g, '')
    .replace(/Pngtree/gi, '')
    .replace(/\.\w+$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 30);
}

async function convert() {
  const files = await readdir(INPUT_DIR);
  const pngs = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

  console.log(`Found ${pngs.length} images to convert.\n`);

  for (const file of pngs) {
    const inputPath = join(INPUT_DIR, file);
    const outputName = getOutputName(file);
    const outputPath = join(OUTPUT_DIR, `${outputName}.webp`);

    const meta = await sharp(inputPath).metadata();
    console.log(`Processing: ${file}`);
    console.log(`  Original: ${meta.width}×${meta.height}, ${meta.format}, ${meta.channels}ch`);

    // Resize to 800×800 (cover + centre crop to match the original texture)
    // Use RGBA to preserve transparency (alpha channel is critical for the mask effect)
    await sharp(inputPath)
      .resize(800, 800, {
        fit: 'cover',
        position: 'centre',
      })
      .webp({
        quality: 72,        // Match original's quality/size balance
        alphaQuality: 80,   // Keep alpha channel quality for mask effects
        effort: 6,          // High compression effort
        smartSubsample: true,
      })
      .toFile(outputPath);

    // Verify output
    const outMeta = await sharp(outputPath).metadata();
    const { size } = await import('fs').then(fs => fs.statSync(outputPath));
    console.log(`  Output:   ${outMeta.width}×${outMeta.height}, webp, ${(size / 1024).toFixed(1)}KB`);
    console.log(`  Saved as: ${outputPath}\n`);
  }

  console.log('Done! All textures converted.');
}

convert().catch(err => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
