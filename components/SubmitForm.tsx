'use client';

import { useState } from 'react';
import { CARD_COLORS, MAX_WORDS } from '@/lib/constants';

export default function SubmitForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [colorId, setColorId] = useState<string>(CARD_COLORS[0].id);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const words = message.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const isOverLimit = wordCount > MAX_WORDS;
  const hasLongWord = words.some(w => w.length > 20);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isOverLimit || hasLongWord || !name.trim() || !message.trim()) return;
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim(), color_id: colorId }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus('error'); setErrorMsg(data.error || 'Something went wrong.'); return; }
      setStatus('success');
      setName(''); setMessage(''); setColorId(CARD_COLORS[0].id);
    } catch {
      setStatus('error');
      setErrorMsg('Failed to submit. Please try again.');
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
            />
          ))}
        </div>
      </div>

      {errorMsg && <p className="form__error">{errorMsg}</p>}

      <button className="btn" type="submit" disabled={status === 'submitting' || isOverLimit || hasLongWord || !name.trim() || !message.trim()}>
        {status === 'submitting' ? 'Sending...' : 'Send This Letter'}
      </button>
      <p className="form__hint" style={{ textAlign: 'center', marginTop: 12 }}>
        All letters are reviewed before appearing. You can submit up to 6 per day.
      </p>
    </form>
  );
}
