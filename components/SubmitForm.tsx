'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { CARD_COLORS, MAX_WORDS } from '@/lib/constants';
import { getBrowserFingerprint } from '@/lib/fingerprint';

export default function SubmitForm() {
  const [name, setName] = useState('');
  const [fromName, setFromName] = useState('');
  const [message, setMessage] = useState('');
  const [wishReply, setWishReply] = useState('');
  const [colorId, setColorId] = useState<string>(CARD_COLORS[0].id);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Ref-based lock to absolutely prevent double submissions across all edge cases
  // (rapid clicks, slow network, re-renders, etc.)
  const submitLockRef = useRef(false);
  const fingerprintRef = useRef<string>('');

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

  // Generate a unique idempotency key per submission attempt
  const generateIdempotencyKey = useCallback(() => {
    return crypto.randomUUID();
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

      {errorMsg && <p className="form__error">{errorMsg}</p>}

      <button className="btn" type="submit" disabled={status === 'submitting' || isOverLimit || hasLongWord || !name.trim() || !message.trim()}>
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
