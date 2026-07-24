'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MAX_WORDS } from '@/lib/constants';

type BurnStage = 'writing' | 'card' | 'burning' | 'done';

// --- Particle types ---
interface FireParticle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number;
  type: 'fire' | 'ember' | 'smoke';
}

export default function BurnForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [stage, setStage] = useState<BurnStage>('writing');
  const fireCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  const words = message.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const isOverLimit = wordCount > MAX_WORDS;

  function handleBurn(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isOverLimit) return;
    setStage('card');
  }

  function startBurning() {
    setStage('burning');
  }

  const runFireAnimation = useCallback(() => {
    const fireEl = fireCanvasRef.current;
    const maskEl = maskCanvasRef.current;
    const cardEl = cardRef.current;
    if (!fireEl || !maskEl || !cardEl) return;
    // Non-null aliases for use inside animate() closure
    const fireCanvas: HTMLCanvasElement = fireEl;
    const maskCanvas: HTMLCanvasElement = maskEl;
    const card: HTMLDivElement = cardEl;

    const rect = card.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);

    // Set both canvases
    for (const c of [fireCanvas, maskCanvas]) {
      c.width = w; c.height = h;
      c.style.width = w + 'px'; c.style.height = h + 'px';
    }

    const fireCtx = fireCanvas.getContext('2d')!;
    const maskCtx = maskCanvas.getContext('2d')!;

    // Draw the card as an opaque white mask initially
    maskCtx.fillStyle = '#fff';
    maskCtx.fillRect(0, 0, w, h);

    const particles: FireParticle[] = [];

    // Burn edge — jagged line across the card width
    const cols = Math.ceil(w / 2);
    const burnEdge = new Float32Array(cols).fill(h + 20);

    let startTime = 0;
    const totalDuration = 4500;

    function spawnParticles(burnY: number, elapsed: number) {
      // Fire particles along burn edge
      for (let i = 0; i < 4; i++) {
        const col = Math.floor(Math.random() * cols);
        const edgeY = burnEdge[col];
        particles.push({
          x: col * 2, y: edgeY - 2 - Math.random() * 6,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(1.5 + Math.random() * 3),
          life: 0, maxLife: 20 + Math.random() * 25,
          size: 3 + Math.random() * 5,
          type: 'fire',
        });
      }

      // Ember particles — small bright dots that fly up
      if (Math.random() < 0.6) {
        const col = Math.floor(Math.random() * cols);
        particles.push({
          x: col * 2, y: burnEdge[col],
          vx: (Math.random() - 0.5) * 3,
          vy: -(3 + Math.random() * 4),
          life: 0, maxLife: 30 + Math.random() * 40,
          size: 1 + Math.random() * 2.5,
          type: 'ember',
        });
      }

      // Smoke particles — grey, float up slowly, spread out
      if (elapsed > 500 && Math.random() < 0.4) {
        const col = Math.floor(Math.random() * cols);
        particles.push({
          x: col * 2, y: burnEdge[col] - 10 - Math.random() * 20,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(0.5 + Math.random() * 1.5),
          life: 0, maxLife: 60 + Math.random() * 50,
          size: 8 + Math.random() * 12,
          type: 'smoke',
        });
      }
    }

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Target Y for burn edge
      const targetY = h * (1 - progress * 1.2);

      // Move burn edge with organic jaggedness
      for (let i = 0; i < cols; i++) {
        const noise1 = Math.sin(i * 0.15 + elapsed * 0.003) * 15;
        const noise2 = Math.sin(i * 0.4 + elapsed * 0.007) * 8;
        const noise3 = Math.random() * 4;
        const target = targetY + noise1 + noise2 + noise3;
        burnEdge[i] += (target - burnEdge[i]) * 0.06;
      }

      // --- MASK: Cut away the burnt part ---
      maskCtx.clearRect(0, 0, w, h);
      maskCtx.fillStyle = '#fff';
      maskCtx.fillRect(0, 0, w, h);

      // Erase everything below the burn edge (burnt away)
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.beginPath();
      maskCtx.moveTo(-5, h + 10);
      for (let i = 0; i < cols; i++) {
        maskCtx.lineTo(i * 2, burnEdge[i]);
      }
      maskCtx.lineTo(w + 5, h + 10);
      maskCtx.closePath();
      maskCtx.fill();
      maskCtx.globalCompositeOperation = 'source-over';

      // Draw charred edge (dark brown/black gradient along burn line)
      for (let i = 0; i < cols; i++) {
        const x = i * 2;
        const y = burnEdge[i];

        // Charred/scorched border above burn edge
        const charGrad = maskCtx.createLinearGradient(x, y - 25, x, y);
        charGrad.addColorStop(0, 'rgba(0,0,0,0)');
        charGrad.addColorStop(0.5, 'rgba(40, 20, 5, 0.4)');
        charGrad.addColorStop(0.8, 'rgba(20, 10, 0, 0.7)');
        charGrad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        maskCtx.fillStyle = charGrad;
        maskCtx.fillRect(x - 1, y - 25, 3, 26);
      }

      // Apply mask to card
      card.style.mask = `url(#burn-mask)`;
      card.style.webkitMask = `url(#burn-mask)`;
      // Use canvas as mask via CSS
      card.style.clipPath = 'none';

      // Actually clip the card using the mask canvas as a CSS mask-image
      const maskDataUrl = maskCanvas.toDataURL();
      card.style.maskImage = `url(${maskDataUrl})`;
      card.style.webkitMaskImage = `url(${maskDataUrl})`;
      card.style.maskSize = '100% 100%';
      card.style.webkitMaskSize = '100% 100%';

      // --- FIRE CANVAS: Draw fire, embers, smoke ---
      // Clear fully each frame (transparent background)
      fireCtx.clearRect(0, 0, w, h);

      // Spawn new particles
      if (progress < 0.92) {
        spawnParticles(targetY, elapsed);
      }

      // Draw glow along burn edge
      fireCtx.save();
      fireCtx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < cols; i += 2) {
        const x = i * 2;
        const y = burnEdge[i];
        const flicker = 0.5 + Math.random() * 0.5;

        const glow = fireCtx.createRadialGradient(x, y, 0, x, y, 12);
        glow.addColorStop(0, `rgba(255, 220, 80, ${0.8 * flicker})`);
        glow.addColorStop(0.3, `rgba(255, 140, 20, ${0.5 * flicker})`);
        glow.addColorStop(0.6, `rgba(255, 60, 0, ${0.25 * flicker})`);
        glow.addColorStop(1, 'rgba(255, 30, 0, 0)');
        fireCtx.fillStyle = glow;
        fireCtx.fillRect(x - 12, y - 12, 24, 24);
      }
      fireCtx.restore();

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        const t = p.life / p.maxLife;

        if (t >= 1) { particles.splice(i, 1); continue; }

        // Wiggle (organic movement)
        p.vx += Math.sin(p.life * 0.3 + p.x * 0.01) * 0.1;
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === 'fire') {
          p.vy *= 0.97;
          const alpha = (1 - t) * 0.9;
          const r = 255;
          const g = Math.floor(255 - t * 200);
          const b = Math.floor(80 - t * 80);
          const size = p.size * (1 - t * 0.3);

          fireCtx.save();
          fireCtx.globalCompositeOperation = 'lighter';
          fireCtx.beginPath();
          fireCtx.arc(p.x, p.y, size, 0, Math.PI * 2);
          fireCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          fireCtx.fill();
          // Outer glow
          fireCtx.beginPath();
          fireCtx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
          fireCtx.fillStyle = `rgba(255, 80, 0, ${alpha * 0.15})`;
          fireCtx.fill();
          fireCtx.restore();

        } else if (p.type === 'ember') {
          p.vy += 0.02; // slight gravity pull
          const alpha = (1 - t);
          const size = p.size * (1 - t * 0.5);
          fireCtx.save();
          fireCtx.globalCompositeOperation = 'lighter';
          fireCtx.beginPath();
          fireCtx.arc(p.x, p.y, size, 0, Math.PI * 2);
          fireCtx.fillStyle = `rgba(255, 200, 50, ${alpha})`;
          fireCtx.fill();
          fireCtx.beginPath();
          fireCtx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
          fireCtx.fillStyle = `rgba(255, 100, 0, ${alpha * 0.2})`;
          fireCtx.fill();
          fireCtx.restore();

        } else if (p.type === 'smoke') {
          p.vy *= 0.99;
          p.size += 0.15; // smoke expands
          const alpha = (1 - t) * 0.25;
          fireCtx.save();
          fireCtx.globalCompositeOperation = 'source-over';
          fireCtx.beginPath();
          fireCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          fireCtx.fillStyle = `rgba(60, 50, 40, ${alpha})`;
          fireCtx.fill();
          fireCtx.restore();
        }
      }

      // Card visual effects
      const sepia = Math.min(progress * 0.8, 0.6);
      const brightness = Math.max(1 - progress * 0.3, 0.6);
      card.style.filter = `sepia(${sepia}) brightness(${brightness})`;

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        card.style.opacity = '0';
        card.style.maskImage = 'none';
        card.style.webkitMaskImage = 'none';
        setTimeout(() => setStage('done'), 300);
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  useEffect(() => {
    if (stage === 'burning') {
      const cleanup = runFireAnimation();
      return cleanup;
    }
  }, [stage, runFireAnimation]);

  function reset() {
    setName('');
    setMessage('');
    setStage('writing');
    if (cardRef.current) {
      cardRef.current.style.opacity = '1';
      cardRef.current.style.filter = 'none';
      cardRef.current.style.maskImage = 'none';
      cardRef.current.style.webkitMaskImage = 'none';
    }
  }

  if (stage === 'done') {
    return (
      <div className="burn-done">
        <div className="burn-done__icon">🕊</div>
        <h2 className="burn-done__title">It&apos;s gone now.</h2>
        <p className="burn-done__text">
          No one will ever read it. No server saved it. It existed only for you, and now it&apos;s ash.
        </p>
        <button className="btn" style={{ width: 'auto', display: 'inline-flex', marginTop: 24 }} onClick={reset}>
          Burn Another
        </button>
      </div>
    );
  }

  if (stage === 'card' || stage === 'burning') {
    return (
      <div className="burn-stage">
        <div className="burn-card-wrapper">
          <div className="memory-card" ref={cardRef} style={{ margin: '0 auto', pointerEvents: 'none' }}>
            <div className="memory-card__bg">
              <div className="memory-card__color" style={{ backgroundColor: '#f5e6d0' }} />
              <div className="memory-card__texture" />
            </div>
            <div className="memory-card__content">
              <div className="memory-card__header">
                <span className="memory-card__brand">honey, if only</span>
              </div>
              <span className="memory-card__name" style={{ cursor: 'default' }}>
                To {name}
              </span>
              <div className="memory-card__message"><span>{message}</span></div>
            </div>
          </div>
          {/* Fire particles canvas — behind card */}
          <canvas ref={fireCanvasRef} className="burn-canvas burn-canvas--fire" aria-hidden="true" />
          {/* Mask canvas — hidden, used for masking */}
          <canvas ref={maskCanvasRef} className="burn-canvas burn-canvas--mask" aria-hidden="true" />
        </div>

        {stage === 'card' && (
          <button className="btn burn-trigger" onClick={startBurning} style={{ marginTop: 32 }}>
            🔥 Burn This Letter
          </button>
        )}
        {stage === 'burning' && (
          <p className="burn-status-text">Letting go...</p>
        )}
      </div>
    );
  }

  // Writing stage
  return (
    <form className="form" onSubmit={handleBurn}>
      <div className="form__group">
        <label className="form__label" htmlFor="burn-name">To</label>
        <input
          id="burn-name" className="form__input" type="text" value={name}
          onChange={e => setName(e.target.value)} placeholder="Their name"
          maxLength={30} required autoComplete="off"
        />
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="burn-message">Your unsent words</label>
        <textarea
          id="burn-message" className="form__textarea" value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="The things you need to let go of..."
          maxLength={500} required autoComplete="off"
        />
        <p className={`form__word-count ${isOverLimit ? 'form__word-count--over' : ''}`}>
          {wordCount} / {MAX_WORDS} words
        </p>
      </div>

      <button className="btn" type="submit" disabled={isOverLimit || !name.trim() || !message.trim()}>
        Prepare to Burn
      </button>
      <p className="form__hint" style={{ textAlign: 'center', marginTop: 12 }}>
        Nothing you write here is saved. Not on our servers, not anywhere. This is just for you.
      </p>
    </form>
  );
}
