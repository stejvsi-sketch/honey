'use client';

import { useState, useRef, useEffect } from 'react';
import { MAX_WORDS } from '@/lib/constants';

type BurnStage = 'writing' | 'card' | 'burning' | 'done';

export default function BurnForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [stage, setStage] = useState<BurnStage>('writing');
  const cardRef = useRef<HTMLDivElement>(null);

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

  // After burning animation completes, show the "done" message
  useEffect(() => {
    if (stage === 'burning') {
      const timer = setTimeout(() => setStage('done'), 3800);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  function reset() {
    setName('');
    setMessage('');
    setStage('writing');
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
        <div className={`burn-card-wrapper ${stage === 'burning' ? 'burn-card-wrapper--burning' : ''}`}>
          {/* Ember particles */}
          {stage === 'burning' && (
            <div className="burn-embers" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, i) => (
                <span key={i} className="burn-ember" style={{
                  left: `${8 + Math.random() * 84}%`,
                  animationDelay: `${Math.random() * 2.5}s`,
                  animationDuration: `${1.5 + Math.random() * 2}s`,
                }} />
              ))}
            </div>
          )}
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
          {/* Burn overlay - fire rising from bottom */}
          {stage === 'burning' && <div className="burn-fire-overlay" aria-hidden="true" />}
        </div>

        {stage === 'card' && (
          <button className="btn burn-trigger" onClick={startBurning} style={{ marginTop: 32 }}>
            🔥 Burn This Letter
          </button>
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
