'use client';

import { useEffect, useState } from 'react';
import CardRenderer from '@/components/cards/CardRenderer';
import type { Memory } from '@/lib/types';

export default function HomeCardGrid({ memories }: { memories: Memory[] }) {
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    function update() {
      setLimit(window.innerWidth >= 1024 ? 12 : 6);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="card-grid card-grid--home">
      {memories.slice(0, limit).map(memory => (
        <CardRenderer key={memory.id} memory={memory} />
      ))}
    </div>
  );
}
