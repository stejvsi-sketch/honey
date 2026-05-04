'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Memory } from '@/lib/types';

const DesktopCard = dynamic(() => import('./DesktopCard'), { ssr: false });
const TabletCard = dynamic(() => import('./TabletCard'), { ssr: false });
const MobileCard = dynamic(() => import('./MobileCard'), { ssr: false });

type Device = 'mobile' | 'tablet' | 'desktop';

function useDevice(): Device {
  const [device, setDevice] = useState<Device>('desktop');

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

  switch (device) {
    case 'mobile': return <MobileCard memory={memory} />;
    case 'tablet': return <TabletCard memory={memory} />;
    default: return <DesktopCard memory={memory} />;
  }
}
