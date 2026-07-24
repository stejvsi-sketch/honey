'use client';

import { useState } from 'react';
import SubmitForm from '@/components/SubmitForm';
import BurnForm from '@/components/BurnForm';

type WriteMode = 'send' | 'burn';

export default function WritePageClient() {
  const [mode, setMode] = useState<WriteMode>('send');

  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1 className="page__title">{mode === 'send' ? 'Write a Letter' : 'Write & Burn'}</h1>
        <p className="page__subtitle">
          {mode === 'send'
            ? 'Say what you never could. Your letter will be written on paper and shared anonymously.'
            : 'Write what weighs on you. It won\u2019t be saved \u2014 not anywhere, not ever.'}
        </p>
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
    </div>
  );
}
