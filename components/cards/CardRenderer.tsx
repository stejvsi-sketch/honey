'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Memory } from '@/lib/types';
import DesktopCard from './DesktopCard';

const TabletCard = dynamic(() => import('./TabletCard'), { ssr: false });
const MobileCard = dynamic(() => import('./MobileCard'), { ssr: false });

type Device = 'mobile' | 'tablet' | 'desktop';

function useDevice(): Device | null {
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    function detect() {
      const w = window.innerWidth;
      if (w < 768) setDevice('mobile');
      else if (w < 1024) setDevice('tablet');
      else setDevice('desktop');
    }
    detect();
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  return device;
}

export default function CardRenderer({ memory }: { memory: Memory }) {
  const device = useDevice();

  // SSR: render DesktopCard by default so Googlebot and first paint see content (fixes LCP)
  // Client: swap to the correct card after hydration
  if (!device) return <DesktopCard memory={memory} />;

  switch (device) {
    case 'mobile': return <MobileCard memory={memory} />;
    case 'tablet': return <TabletCard memory={memory} />;
    default: return <DesktopCard memory={memory} />;
  }
}
