import CardRenderer from '@/components/cards/CardRenderer';
import type { Memory } from '@/lib/types';

// Server component: renders up to 12 recent cards directly in the server HTML.
// CSS hides cards 7-12 below 1024px (see .card-grid--home in globals.css), so small
// screens show 6 and desktops show 12 - no client JS, no layout shift, full SSR.
export default function HomeCardGrid({ memories }: { memories: Memory[] }) {
  return (
    <div className="card-grid card-grid--home">
      {memories.slice(0, 12).map(memory => (
        <CardRenderer key={memory.id} memory={memory} />
      ))}
    </div>
  );
}
