'use client';

import { useState } from 'react';
import Link from 'next/link';
import SubmitForm from '@/components/SubmitForm';
import BurnForm from '@/components/BurnForm';

type WriteMode = 'send' | 'burn';

export default function WritePageClient() {
  const [mode, setMode] = useState<WriteMode>('send');

  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1 className="page__title">{mode === 'send' ? 'Write an Unsent Letter Online' : 'Write & Burn'}</h1>
        <p className="page__subtitle">
          {mode === 'send'
            ? 'Write what you never sent without an account. New submissions are reviewed before publication; approved letters are public. Leave the sender name blank if you do not want it displayed, and avoid details that could identify you or someone else.'
            : 'Write what weighs on you. The burn tool does not submit your text to the public archive.'}
        </p>
        {mode === 'send' && (
          <p className="page__subtitle">
            Before sharing, read our <Link href="/moderation">moderation information</Link> and <Link href="/privacy">Privacy Policy</Link>.
          </p>
        )}
      </div>

      {mode === 'send' ? <SubmitForm /> : <BurnForm />}

      {/* Mode toggle — below the form hint text */}
      <div className="write-mode-toggle">
        <button
          className={`write-mode-toggle__option ${mode === 'send' ? 'write-mode-toggle__option--active' : ''}`}
          onClick={() => setMode('send')}
        >
          send a letter
        </button>
        <span className="write-mode-toggle__divider">/</span>
        <button
          className={`write-mode-toggle__option ${mode === 'burn' ? 'write-mode-toggle__option--active' : ''}`}
          onClick={() => setMode('burn')}
        >
          write &amp; burn
        </button>
      </div>
      <div className="cross-promo">
        <p className="cross-promo__text">This space is for unsent letters and memories.</p>
        <p className="cross-promo__text">For the worst things said to you:</p>
        <a href="https://www.theworstsaid.com/" target="_blank" rel="noopener noreferrer" className="cross-promo__link">
          theworstsaid.com ↗
        </a>
      </div>
    </div>
  );
}
