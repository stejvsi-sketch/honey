'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { CARD_COLORS, SITE_NAME } from '@/lib/constants';
import { formatSubmittedName } from '@/lib/names';
import type { Memory } from '@/lib/types';

// Deterministic pseudo-random based on string hash (so SSR matches client)
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

interface LetterPlacement {
  memory: Memory;
  x: number;       // percentage left
  y: number;       // percentage top
  rotation: number; // degrees
  scale: number;
  zIndex: number;
}

function generatePlacements(memories: Memory[]): LetterPlacement[] {
  return memories.map((memory, i) => {
    const seed = hashCode(memory.id);
    const r1 = seededRandom(seed);
    const r2a = seededRandom(seed + 1);
    const r3 = seededRandom(seed + 2);
    const r4 = seededRandom(seed + 3);
    const r5 = seededRandom(seed + 4);

    // Distribute cards in a perfectly continuous fluid sequence vertically to eliminate any visual rows or shelves entirely
    // Average vertical advance per card is 55px to beautifully support larger desktop card dimensions
    const baseY = i * 55 + 20;

    // Cycle through 5 horizontal sectors using a prime-step jump so consecutive cards drop in completely distinct areas
    const sector = (i * 2 + Math.floor(i / 5)) % 5;
    // Spread sector centers beautifully across available width up to 79% to fill desktop right side perfectly
    const baseX = sector * 19 + 3;

    // Apply generous organic scatter within and across sector boundaries for hyper-realistic tabletop scatter
    const x = r2(baseX + (r1 - 0.5) * 16);   // fluid organic placement spanning full screen breadth perfectly
    const y = r2(baseY + (r2a - 0.5) * 42);  // controlled continuous overlapping jitter
    const rotation = r2((r3 - 0.5) * 56);    // -28 to +28 degrees for an authentic casual tossed look
    const scale = r2(0.88 + r4 * 0.12);      // consistent realistic physical depth sizing

    return {
      memory,
      x,
      y,
      rotation,
      scale,
      zIndex: Math.round(r5 * 100),     // dynamic z-index for organic layering order
    };
  });
}

function TableCard({
  placement,
  isLifted,
  onLift,
}: {
  placement: LetterPlacement;
  isLifted: boolean;
  onLift: (id: string) => void;
}) {
  const { memory, x, y, rotation, scale, zIndex } = placement;
  const color = CARD_COLORS.find(c => c.id === memory.color_id);
  const hex = color?.hex || '#f5e6d0';
  const displayName = formatSubmittedName(memory.name);

  return (
    <div
      className={`table-card ${isLifted ? 'table-card--lifted' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}px`,
        '--card-rotation': `${rotation}deg`,
        '--card-scale': scale,
        zIndex: isLifted ? 999 : zIndex,
      } as React.CSSProperties}
      onClick={() => onLift(memory.id)}
    >
      <div className="table-card__bg">
        <div className="table-card__color" style={{ backgroundColor: hex }} />
        <div className="table-card__texture" />
      </div>
      <div className="table-card__content">
        <div className="table-card__header">
          <span className="table-card__brand">{SITE_NAME.toLowerCase()}</span>
        </div>
        <span className="table-card__name">To {displayName}</span>
        <p className="table-card__message">{memory.message}</p>
      </div>
      <Link
        href={`/letter/${memory.id}`}
        className="table-card__read"
        style={{
          opacity: isLifted ? 1 : 0,
          visibility: isLifted ? 'visible' : 'hidden',
          pointerEvents: isLifted ? 'auto' : 'none',
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={isLifted ? 0 : -1}
      >
        Read This Letter
      </Link>
    </div>
  );
}

const SCRIBBLES = [
  // Sad/love text scribbles
  'come back please ;(',
  'I still check your profile',
  'why did you leave',
  'I miss your laugh',
  'you were my home',
  'it was always you',
  'I never said goodbye',
  'do you even think of me?',
  'I loved you in silence',
  'sorry sorry sorry',
  'I should have fought harder',
  'you ruined me',
  'I hope you are happy',
  'we were so close',
  'I dream about you still',
  'please just one more chance',
  'I hate that I miss you',
  'you promised forever',
  'was any of it real?',
  'I wrote this for you',
  'my heart is so tired',
  'I forgive you',
  'stay. just stay.',
  'I never stopped loving you',
  'you felt like sunlight',
  'why wasn\'t I enough?',
  'come home',
  'I keep your hoodie',
  'everything reminds me of you',
  'I\'m sorry I wasn\'t ready',
  'you were the one',
  'I can\'t breathe without you',
  'tell me it meant something',
  'I wish I told you sooner',
  'the silence is killing me',
  'I wrote your name in the margins',
  'do you remember that night?',
  'I lied when I said I was fine',
  'you smell like home',
  'I reread your old texts',
  'my pillow still smells like you',
  '3am and I almost called',
  'I deleted your number but I know it by heart',
  'you don\'t even know what you did',
  'I saved every voicemail',
  'I\'m not over it',
  'it still hurts',
  'I would have stayed',
  'you were my person',
  'I can\'t listen to our song',
  'the worst part is I still love you',
  'I pretend I don\'t care',
  'every love poem is about you',
  'I hope she treats you well',
  'I never told anyone about us',
  'you were my favorite mistake',
  'I miss who I was with you',

  // Doodle scribbles - hearts, symbols, short handwritten expressions
  '\u2661',
  '\u2661 \u2661 \u2661',
  '\u2665',
  '\u2764',
  '\u2661\u2661',
  'xoxo',
  'XOXO',
  '\u2606',
  '\u2605',
  '\u2606 \u2606',
  '\u2192',
  '\u2190',
  '\u221e',
  '???',
  '?!',
  '!!!',
  '+ you +',
  '// me & you //',
  '\u266a',
  '\u266b',
  '\u2639',
  ':(',
  ';(',
  ':\'(',
  '<3',
  '</3',
  '\u2729',
  'always',
  'forever?',
  'if only',
  'come back',
  'miss u',
  'why',
  'so cold',
  'still waiting',
  'never forgot',
];

interface ScribblePlacement {
  text: string;
  x: number;
  y: number;
  rotation: number;
  fontSize: number;
  opacity: number;
}

function generateScribbles(tableHeight: number): ScribblePlacement[] {
  const allScribbles: ScribblePlacement[] = [];
  // Perform 3 passes over the scribbles array to densely cover the table surface
  for (let pass = 0; pass < 3; pass++) {
    SCRIBBLES.forEach((text, i) => {
      const seed = pass * 1000 + i * 7 + 31;
      const r1 = seededRandom(seed);
      const r2a = seededRandom(seed + 1);
      const r3 = seededRandom(seed + 2);
      const r4 = seededRandom(seed + 3);
      const r5 = seededRandom(seed + 4);

      allScribbles.push({
        text,
        x: r2(r1 * 92 + 2),                    // 2% to 94%
        y: r2(r2a * (tableHeight - 80) + 20),  // spread across full height
        rotation: r2((r3 - 0.5) * 60),          // -30 to +30 degrees
        fontSize: r2(1.1 + r4 * 1.5),           // 1.1rem to 2.6rem
        opacity: r2(0.08 + r5 * 0.12),          // 0.08 to 0.20
      });
    });
  }
  return allScribbles;
}

export default function TableView({ memories }: { memories: Memory[] }) {
  const [liftedId, setLiftedId] = useState<string | null>(null);
  const placements = useMemo(() => generatePlacements(memories), [memories]);

  // Total table height calibrated for expanded vertical advance and generous layout padding
  const tableHeight = memories.length * 55 + 600;

  const scribbles = useMemo(() => generateScribbles(tableHeight), [tableHeight]);

  const handleLift = useCallback((id: string) => {
    setLiftedId(prev => (prev === id ? null : id));
  }, []);

  return (
    <div className="table-surface">
      <div className="table-surface__header">
        <h1 className="table-surface__title">The Table</h1>
        <p className="table-surface__subtitle">
          Fifty letters, scattered and waiting. Pick one up.
        </p>
      </div>
      <div
        className="table-surface__area"
        style={{ height: `${tableHeight}px` }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setLiftedId(null);
        }}
      >
        {/* Handwritten scribbles on the table — decorative only, hidden from crawlers */}
        <div aria-hidden="true" role="presentation" data-nosnippet="">
        {scribbles.map((scribble, i) => (
          <span
            key={`scribble-${i}`}
            className="table-scribble"
            style={{
              left: `${scribble.x}%`,
              top: `${scribble.y}px`,
              transform: `rotate(${scribble.rotation}deg)`,
              fontSize: `${scribble.fontSize}rem`,
              opacity: scribble.opacity,
            }}
          >
            {scribble.text}
          </span>
        ))}
        </div>

        {placements.map(placement => (
          <TableCard
            key={placement.memory.id}
            placement={placement}
            isLifted={liftedId === placement.memory.id}
            onLift={handleLift}
          />
        ))}
      </div>
    </div>
  );
}
