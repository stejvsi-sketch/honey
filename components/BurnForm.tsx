'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MAX_WORDS } from '@/lib/constants';

type BurnStage = 'writing' | 'card' | 'burning' | 'done';

export default function BurnForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [stage, setStage] = useState<BurnStage>('writing');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const burnProgress = useRef(0);
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

  // Canvas-based fire animation
  const runFireAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const rect = card.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    // Burn line particles
    interface Particle {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; size: number;
    }
    const particles: Particle[] = [];

    // Burn edge — jagged line that moves upward
    const burnEdge: number[] = [];
    const edgeCols = Math.ceil(w / 3);
    for (let i = 0; i < edgeCols; i++) {
      burnEdge.push(h + 10);
    }

    let startTime = 0;
    const totalDuration = 4200; // 4.2 seconds

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      burnProgress.current = progress;

      ctx.clearRect(0, 0, w, h);

      // Target Y for burn edge (moves from bottom to top)
      const targetY = h * (1 - progress * 1.15);

      // Move burn edge toward target with jaggedness
      for (let i = 0; i < edgeCols; i++) {
        const jag = Math.sin(i * 0.8 + elapsed * 0.005) * 12 + Math.random() * 8;
        const target = targetY + jag;
        burnEdge[i] += (target - burnEdge[i]) * 0.08;
      }

      // Draw charred/burnt region (below burn edge = burnt away)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, h + 5);
      for (let i = 0; i < edgeCols; i++) {
        ctx.lineTo(i * 3, burnEdge[i]);
      }
      ctx.lineTo(w + 5, h + 5);
      ctx.closePath();

      // The "gone" part — black charred
      ctx.fillStyle = 'rgba(20, 12, 5, 0.95)';
      ctx.fill();
      ctx.restore();

      // Draw glowing ember edge
      ctx.save();
      for (let i = 0; i < edgeCols; i++) {
        const x = i * 3;
        const y = burnEdge[i];
        const glowIntensity = 0.6 + Math.random() * 0.4;

        // Ember glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        gradient.addColorStop(0, `rgba(255, 200, 50, ${glowIntensity})`);
        gradient.addColorStop(0.4, `rgba(255, 100, 0, ${glowIntensity * 0.6})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 8, y - 8, 16, 16);
      }
      ctx.restore();

      // Spawn ember particles along the burn edge
      if (progress < 0.95) {
        for (let i = 0; i < 3; i++) {
          const idx = Math.floor(Math.random() * edgeCols);
          particles.push({
            x: idx * 3,
            y: burnEdge[idx] - Math.random() * 5,
            vx: (Math.random() - 0.5) * 2,
            vy: -(1 + Math.random() * 3),
            life: 0,
            maxLife: 40 + Math.random() * 40,
            size: 1.5 + Math.random() * 3,
          });
        }
      }

      // Draw & update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02; // float up faster
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio >= 1) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = 1 - lifeRatio;
        const r = 255;
        const g = Math.floor(200 - lifeRatio * 150);
        const b = Math.floor(50 - lifeRatio * 50);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, 0, ${alpha * 0.2})`;
        ctx.fill();
      }

      // Fade card behind the burnt area
      if (card) {
        const cardOpacity = Math.max(0, 1 - progress * 1.3);
        card.style.opacity = String(cardOpacity);
        // Darken as it burns
        const sepia = Math.min(progress * 1.5, 1);
        const brightness = Math.max(1 - progress * 0.6, 0.3);
        card.style.filter = `sepia(${sepia}) brightness(${brightness})`;
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Done — hide card fully
        if (card) {
          card.style.opacity = '0';
        }
        setTimeout(() => setStage('done'), 400);
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
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
    burnProgress.current = 0;
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
          {/* Canvas overlaid on the card for fire effect */}
          <canvas
            ref={canvasRef}
            className="burn-canvas"
            aria-hidden="true"
          />
        </div>

        {stage === 'card' && (
          <button className="btn burn-trigger" onClick={startBurning} style={{ marginTop: 32 }}>
            🔥 Burn This Letter
          </button>
        )}
        {stage === 'burning' && (
          <p style={{ marginTop: 24, color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center' }}>
            Letting go...
          </p>
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
