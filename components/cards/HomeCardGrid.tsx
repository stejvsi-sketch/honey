import CardRenderer from '@/components/cards/CardRenderer';
import DesktopCard from '@/components/cards/DesktopCard';
import type { Memory } from '@/lib/types';

// Server component: renders up to 12 recent cards directly in the server HTML.
// CSS hides cards 7-12 below 1024px (see .card-grid--home in globals.css), so small
// screens show 6 and desktops show 12. Cards without a wish reply stay server-rendered;
// only cards that need flipping hydrate client-side.
// An in-feed native ad is injected after the 3rd card (visible on all breakpoints).
export default function HomeCardGrid({ memories }: { memories: Memory[] }) {
  const cards = memories.slice(0, 12);

  return (
    <div className="card-grid card-grid--home">
      {cards.map((memory) => (
        memory.wish_reply
          ? <CardRenderer key={memory.id} memory={memory} />
          : <DesktopCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
}
