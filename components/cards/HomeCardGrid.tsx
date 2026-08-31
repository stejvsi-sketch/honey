import CardRenderer from '@/components/cards/CardRenderer';
import BidVertiserAd from '@/components/BidVertiserAd';
import type { Memory } from '@/lib/types';

// Server component: renders up to 12 recent cards directly in the server HTML.
// CSS hides cards 7-12 below 1024px (see .card-grid--home in globals.css), so small
// screens show 6 and desktops show 12 - no client JS, no layout shift, full SSR.
// An in-feed native ad is injected after the 3rd card (visible on all breakpoints).
export default function HomeCardGrid({ memories }: { memories: Memory[] }) {
  const cards = memories.slice(0, 12);

  return (
    <div className="card-grid card-grid--home">
      {cards.map((memory, i) => (
        <>
          <CardRenderer key={memory.id} memory={memory} />
          {/* In-feed ad after the 3rd card */}
          {i === 2 && (
            <BidVertiserAd
              key="ad-infeed-home"
              rows={1}
              imageWidth={350}
              placement="home-infeed"
              variant="infeed"
            />
          )}
        </>
      ))}
    </div>
  );
}
