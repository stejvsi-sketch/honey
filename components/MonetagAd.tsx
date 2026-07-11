'use client';

import { useEffect, useRef } from 'react';

export default function MonetagAd({ zone, type = 'in-page' }: { zone: string; type?: 'in-page' | 'vignette' }) {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    
    // Check if a script for this zone already exists
    const scriptId = `monetag-${zone}`;
    if (document.getElementById(scriptId)) {
      isLoaded.current = true;
      return;
    }

    isLoaded.current = true;
    const s = document.createElement('script');
    s.id = scriptId;
    s.dataset.zone = zone;
    s.src = type === 'vignette' ? 'https://n6wxm.com/vignette.min.js' : 'https://nap5k.com/tag.min.js';
    s.async = true;
    
    // Append to body as requested by Monetag's default snippet
    document.body.appendChild(s);
  }, [zone, type]);

  return null;
}
