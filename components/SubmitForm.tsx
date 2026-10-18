'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { CARD_COLORS, CARD_TEXTURES, DEFAULT_TEXTURE_ID, MAX_WORDS } from '@/lib/constants';
import { getBrowserFingerprint } from '@/lib/fingerprint';

// Get a random texture ID from the non-default textures (indices 1–8)
function getRandomTextureId(): string {
  const nonDefault = CARD_TEXTURES.filter(t => t.id !== DEFAULT_TEXTURE_ID);
  return nonDefault[Math.floor(Math.random() * nonDefault.length)].id;
}

export default function SubmitForm() {
  const [name, setName] = useState('');
  const [fromName, setFromName] = useState('');
  const [message, setMessage] = useState('');
  const [wishReply, setWishReply] = useState('');
  const [colorId, setColorId] = useState<string>(CARD_COLORS[0].id);
  const [textureId, setTextureId] = useState<string>(DEFAULT_TEXTURE_ID);
  const [isShuffling, setIsShuffling] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Ref-based lock to absolutely prevent double submissions across all edge cases
  // (rapid clicks, slow network, re-renders, etc.)
  const submitLockRef = useRef(false);
  const fingerprintRef = useRef<string>('');
  const shuffleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate browser fingerprint on mount (async, non-blocking)
  useEffect(() => {
    getBrowserFingerprint().then(fp => {
      fingerprintRef.current = fp;
    }).catch(() => {
      // Fingerprint generation failed — submit will work without it
    });
  }, []);

  const words = message.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const isOverLimit = wordCount > MAX_WORDS;
  const hasLongWord = words.some(w => w.length > 20);
  const wishReplyWords = wishReply.trim().split(/\s+/).filter(w => w.length > 0);
  const wishReplyOverLimit = wishReply.trim().length > 0 && wishReplyWords.length > MAX_WORDS;

  // Generate a unique idempotency key per submission attempt
  const generateIdempotencyKey = useCallback(() => {
    return crypto.randomUUID();
  }, []);

  // Animate the shuffle — cycle through textures rapidly then land on a random one
  function handleShuffle() {
    if (isShuffling) return;
    setIsShuffling(true);

    const nonDefault = CARD_TEXTURES.filter(t => t.id !== DEFAULT_TEXTURE_ID);
    let step = 0;
    const totalSteps = 8 + Math.floor(Math.random() * 4); // 8–11 visual ticks
    const finalId = getRandomTextureId();

    function tick() {
      if (step < totalSteps - 1) {
        // Visual cycling: pick a random texture each tick
        setTextureId(nonDefault[Math.floor(Math.random() * nonDefault.length)].id);
        step++;
        // Accelerating delay: starts fast (60ms), ends slower (180ms)
        const delay = 60 + (step / totalSteps) * 120;
        shuffleTimerRef.current = setTimeout(tick, delay);
      } else {
        // Final: land on the actual selection
        setTextureId(finalId);
        setIsShuffling(false);
      }
    }

    tick();
  }

  // Cleanup shuffle timer on unmount
  useEffect(() => {
    return () => {
      if (shuffleTimerRef.current) clearTimeout(shuffleTimerRef.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Hard lock: if already submitting, bail immediately
    if (submitLockRef.current) return;
    if (isOverLimit || hasLongWord || !name.trim() || !message.trim()) return;

    // Acquire the lock
    submitLockRef.current = true;

    // Capture form data before clearing
    const submissionData = {
      name: name.trim(),
      message: message.trim(),
      color_id: colorId,
      texture_id: textureId !== DEFAULT_TEXTURE_ID ? textureId : undefined,
      from_name: fromName.trim() || undefined,
      wish_reply: wishReply.trim() || undefined,
      idempotency_key: generateIdempotencyKey(),
      fingerprint_hash: fingerprintRef.current || undefined,
    };

    // OPTIMISTIC: Show success instantly so user never feels compelled to re-click
    setStatus('success');
    setErrorMsg('');
    setName('');
    setFromName('');
    setMessage('');
    setWishReply('');
    setColorId(CARD_COLORS[0].id);
    setTextureId(DEFAULT_TEXTURE_ID);

    // Fire the actual API call in the background
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!res.ok) {
        const data = await res.json();
        // Revert optimistic UI on server rejection
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        // Restore form data so user doesn't lose their message
        setName(submissionData.name);
        setFromName(submissionData.from_name || '');
        setMessage(submissionData.message);
        setWishReply(submissionData.wish_reply || '');
        setColorId(submissionData.color_id);
        setTextureId(submissionData.texture_id || DEFAULT_TEXTURE_ID);
      }
      // If res.ok, user already sees success — nothing to do
    } catch {
      // Network error — revert optimistic UI
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
      setName(submissionData.name);
      setFromName(submissionData.from_name || '');
      setMessage(submissionData.message);
      setWishReply(submissionData.wish_reply || '');
      setColorId(submissionData.color_id);
      setTextureId(submissionData.texture_id || DEFAULT_TEXTURE_ID);
    } finally {
      // Release the lock
      submitLockRef.current = false;
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 12 }}>
          Your letter has been received.
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontStyle: 'italic' }}>
          It will appear once it&apos;s been reviewed. Thank you for sharing your words.
        </p>
        <button className="btn" style={{ width: 'auto', display: 'inline-flex' }} onClick={() => setStatus('idle')}>
          Write Another
        </button>
      </div>
    );
  }

  const selectedTexture = CARD_TEXTURES.find(t => t.id === textureId);

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__group">
        <label className="form__label" htmlFor="name">To</label>
        <input
          id="name" className="form__input" type="text" value={name}
          onChange={e => setName(e.target.value)} placeholder="Their name"
          maxLength={30} required autoComplete="off"
        />
        <p className="form__hint">Who is this letter for?</p>
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="fromName">From <span style={{ fontWeight: 400, color: 'var(--text-light)', fontSize: '0.8em' }}>(optional)</span></label>
        <input
          id="fromName" className="form__input" type="text" value={fromName}
          onChange={e => setFromName(e.target.value)} placeholder="Your name"
          maxLength={30} autoComplete="off"
        />
        <p className="form__hint">Sign your letter, if you&apos;d like.</p>
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="message">Your unsent words</label>
        <textarea
          id="message" className="form__textarea" value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="The things you never got to say..."
          maxLength={250} required autoComplete="off"
        />
        <p className={`form__word-count ${isOverLimit ? 'form__word-count--over' : ''}`}>
          {wordCount} / {MAX_WORDS} words
        </p>
        {hasLongWord && (
          <p className="form__error">Each word must be 20 characters or less.</p>
        )}
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="wishReply">If only they&apos;d say... <span style={{ fontWeight: 400, color: 'var(--text-light)', fontSize: '0.8em' }}>(optional)</span></label>
        <textarea
          id="wishReply" className="form__textarea" value={wishReply}
          onChange={e => setWishReply(e.target.value)}
          placeholder="What you wish they'd say back..."
          maxLength={250} autoComplete="off"
          style={{ minHeight: '80px' }}
        />
        {wishReply.trim().length > 0 && (
          <p className={`form__word-count ${wishReplyWords.length > MAX_WORDS ? 'form__word-count--over' : ''}`}>
            {wishReplyWords.length} / {MAX_WORDS} words
          </p>
        )}
        <p className="form__hint">Tap the card to see the other side. This is what you wish they&apos;d say.</p>
      </div>

      <div className="form__group">
        <label className="form__label">Choose a color</label>
        <div className="color-picker">
          {CARD_COLORS.map(color => (
            <button
              key={color.id} type="button"
              className={`color-swatch ${colorId === color.id ? 'color-swatch--selected' : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setColorId(color.id)}
              title={color.name}
              aria-label={`Select ${color.name} color`}
              aria-pressed={colorId === color.id}
            />
          ))}
        </div>
      </div>

      <div className="form__group">
        <label className="form__label">Choose paper texture</label>
        <div className="texture-picker">
          {/* Default original texture */}
          <button
            type="button"
            className={`texture-swatch ${textureId === DEFAULT_TEXTURE_ID ? 'texture-swatch--selected' : ''}`}
            onClick={() => setTextureId(DEFAULT_TEXTURE_ID)}
            title="Original"
            aria-label="Select Original paper texture"
            aria-pressed={textureId === DEFAULT_TEXTURE_ID}
          >
            <img
              src={`/textures/${CARD_TEXTURES[0].file}`}
              alt="Original"
              className="texture-swatch__img"
              loading="lazy"
            />
          </button>

          {/* Random shuffle button */}
          <button
            type="button"
            className={`texture-swatch texture-swatch--shuffle ${textureId !== DEFAULT_TEXTURE_ID ? 'texture-swatch--selected' : ''} ${isShuffling ? 'texture-swatch--shuffling' : ''}`}
            onClick={handleShuffle}
            title={isShuffling ? 'Shuffling...' : (selectedTexture && textureId !== DEFAULT_TEXTURE_ID ? selectedTexture.name : 'Random Shuffle')}
            aria-label="Randomly select a paper texture"
            disabled={isShuffling}
          >
            {textureId !== DEFAULT_TEXTURE_ID ? (
              <img
                src={`/textures/${selectedTexture?.file || CARD_TEXTURES[0].file}`}
                alt={selectedTexture?.name || 'Random'}
                className="texture-swatch__img"
                loading="lazy"
              />
            ) : (
              <span className="texture-swatch__shuffle-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8" />
                  <line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" />
                  <line x1="15" y1="15" x2="21" y2="21" />
                  <line x1="4" y1="4" x2="9" y2="9" />
                </svg>
              </span>
            )}
            <span className="texture-swatch__label">
              {isShuffling ? '...' : (textureId !== DEFAULT_TEXTURE_ID ? 'reshuffle' : 'shuffle')}
            </span>
          </button>
        </div>
        <p className="form__hint">
          {textureId === DEFAULT_TEXTURE_ID
            ? 'Classic paper, or tap shuffle for a surprise.'
            : `Selected: ${selectedTexture?.name || 'Custom'}. Tap shuffle again to change.`}
        </p>
      </div>

      {errorMsg && <p className="form__error">{errorMsg}</p>}

      <button className="btn" type="submit" disabled={status === 'submitting' || isOverLimit || hasLongWord || wishReplyOverLimit || !name.trim() || !message.trim()}>
        {status === 'submitting' ? 'Sending...' : 'Send This Letter'}
      </button>
      <p className="form__hint" style={{ textAlign: 'center', marginTop: 12 }}>
        All letters are reviewed before appearing. Only first names allowed.
      </p>
      <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
        If you or someone you know is in crisis, please reach out:{' '}
        <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>988 Suicide &amp; Crisis Lifeline</a>{' '}
        (call or text 988) or{' '}
        <a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Crisis Text Line</a>{' '}
        (text HOME to 741741).
      </p>
    </form>
  );
}
