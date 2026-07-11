'use client';

import { useEffect, useRef } from 'react';

export default function MonetagAd({ zone, type = 'in-page' }: { zone: string; type?: 'in-page' | 'vignette' }) {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    
    // CUSTOM VIGNETTE CAPPING: Max 1 per 30 minutes
    if (type === 'vignette') {
      try {
        const now = Date.now();
        const lastShown = localStorage.getItem('monetag_vignette_last_shown');
        if (lastShown && now - parseInt(lastShown, 10) < 30 * 60 * 1000) {
          return; // Skip loading the vignette if it hasn't been 30 minutes
        }
        localStorage.setItem('monetag_vignette_last_shown', now.toString());
      } catch (e) {
        // Ignore localStorage errors (e.g., incognito mode)
      }
    }

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
