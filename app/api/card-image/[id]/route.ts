import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getMemoryById } from '@/lib/data';
import { CARD_COLORS, SITE_NAME } from '@/lib/constants';
import type { Memory } from '@/lib/types';

export const runtime = 'nodejs';
export const revalidate = 18000;

const IMAGE_WIDTH = 1260;
const IMAGE_HEIGHT = 1560;
const CARD_WIDTH = 1200;
const CARD_HEIGHT = 1486;
const CARD_LEFT = Math.round((IMAGE_WIDTH - CARD_WIDTH) / 2);
const CARD_TOP = Math.round((IMAGE_HEIGHT - CARD_HEIGHT) / 2);
const PAGE_BACKGROUND = '#dad7d1';
const TEXT_CENTER_X = CARD_WIDTH / 2;
const TEXTURE_PATH = path.join(process.cwd(), 'public', 'textures', 'rough-paper.webp');
const MASK_INPUT = {
  raw: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    channels: 1 as const,
  },
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function makeFileName(memory: Memory): string {
  const name = memory.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'letter';

  return `honey-if-only-${name}-${memory.id.slice(0, 8)}.png`;
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length === maxLines) break;
  }

  if (current && lines.length < maxLines) lines.push(current);

  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\s+\S*$/, '')}...`;
  }

  return lines.length > 0 ? lines : [''];
}

function renderTspans(lines: string[], x: number, lineHeight: number): string {
  return lines
    .map((line, index) => (
      `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
    ))
    .join('');
}

function isPinned(memory: Memory): boolean {
  if (!memory.pinned_until) return false;
  return new Date(memory.pinned_until) > new Date();
}

function renderTextSvg(memory: Memory): Buffer {
  const messageLength = memory.message.length;
  const messageFontSize = messageLength > 175 ? 50 : messageLength > 120 ? 56 : 62;
  const lineHeight = Math.round(messageFontSize * 1.62);
  const maxChars = messageFontSize > 60 ? 28 : messageFontSize > 54 ? 31 : 34;
  const messageLines = wrapText(memory.message, maxChars, 7);
  const messageBlockHeight = (messageLines.length - 1) * lineHeight + messageFontSize;
  const groupHeight = 72 + 58 + messageBlockHeight;
  const nameY = Math.round((CARD_HEIGHT - groupHeight) / 2 + 90);
  const messageY = nameY + 130;
  const pin = isPinned(memory);

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  ${pin ? `
  <g transform="translate(${TEXT_CENTER_X} 42)">
    <ellipse cx="0" cy="0" rx="42" ry="42" fill="#c4a67a" stroke="#a8895c" stroke-width="7" />
    <ellipse cx="0" cy="0" rx="20" ry="20" fill="#dcc9a3" />
    <rect x="-9" y="38" width="18" height="88" rx="9" fill="#b89b6a" stroke="#a8895c" stroke-width="5" />
    <ellipse cx="0" cy="128" rx="11" ry="7" fill="#a8895c" />
  </g>` : ''}

  <g fill="rgba(26,23,20,0.72)" text-anchor="middle">
    <text x="${TEXT_CENTER_X}" y="118" font-family="Georgia, serif" font-size="42" font-style="italic" letter-spacing="8">${escapeXml(SITE_NAME.toLowerCase())}</text>
    <line x1="${TEXT_CENTER_X - 54}" y1="154" x2="${TEXT_CENTER_X + 54}" y2="154" stroke="rgba(26,23,20,0.25)" stroke-width="4" />
    <text x="${TEXT_CENTER_X}" y="${nameY}" font-family="Georgia, serif" font-size="56" font-weight="600" font-style="italic" fill="rgba(26,23,20,0.75)">To ${escapeXml(memory.name)}</text>
    <text x="${TEXT_CENTER_X}" y="${messageY}" font-family="Georgia, serif" font-size="${messageFontSize}" line-height="${lineHeight}" fill="rgba(26,23,20,0.72)">
      ${renderTspans(messageLines, TEXT_CENTER_X, lineHeight)}
    </text>
  </g>
</svg>`);
}

async function createCardImage(memory: Memory): Promise<Buffer> {
  const color = CARD_COLORS.find(item => item.id === memory.color_id);
  const hex = color?.hex || '#f5e6d0';
  const textureSource = await readFile(TEXTURE_PATH);
  const roughPaper = await sharp(textureSource)
    .resize(CARD_WIDTH, CARD_HEIGHT, { fit: 'fill' })
    .ensureAlpha()
    .png()
    .toBuffer();
  const roughPaperMask = await sharp(roughPaper)
    .removeAlpha()
    .greyscale()
    .threshold(12)
    .raw()
    .toBuffer();
  const softenedTexture = await sharp(roughPaper)
    .modulate({ saturation: 0.55, brightness: 1.18 })
    .linear(0.58, 82)
    .png()
    .toBuffer();
  const text = renderTextSvg(memory);
  const lightWash = Buffer.from(`<svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffffff" opacity="0.13"/></svg>`);
  const cardRgb = await sharp({
    create: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      channels: 3,
      background: hex,
    },
  })
    .composite([
      { input: lightWash, blend: 'over' },
      { input: softenedTexture, blend: 'multiply' },
      { input: text, blend: 'over' },
    ])
    .png()
    .toBuffer();
  const cardBase = await sharp(cardRgb)
    .removeAlpha()
    .png()
    .toBuffer();
  const card = await sharp(cardBase)
    .joinChannel(roughPaperMask, MASK_INPUT)
    .toColourspace('srgb')
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      channels: 4,
      background: PAGE_BACKGROUND,
    },
  })
    .composite([
      { input: card, left: CARD_LEFT, top: CARD_TOP },
    ])
    .png()
    .toBuffer();
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const memory = await getMemoryById(id);

  if (!memory) {
    return NextResponse.json({ error: 'Card image not found' }, { status: 404 });
  }

  const png = await createCardImage(memory);
  const download = request.nextUrl.searchParams.has('download');
  const fileName = makeFileName(memory);

  return new NextResponse(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': png.length.toString(),
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${fileName}"`,
      'Cache-Control': 'public, max-age=18000, s-maxage=18000, stale-while-revalidate=18000, must-revalidate',
    },
  });
}
