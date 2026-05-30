'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { CARD_COLORS, MAX_WORDS } from '@/lib/constants';
import { getBrowserFingerprint } from '@/lib/fingerprint';

type Phase = 'void' | 'submitting' | 'revealing' | 'wall';

// ── Floating wall messages — raw human confessions ────────────
// These are NOT pulled from the archive. They exist only here.
const WALL_MESSAGES = [
  "I never said goodbye and it eats at me every day",
  "you made me believe I was worth something",
  "I still check if you're online",
  "we were so close to forever",
  "I forgave you a long time ago. you just never asked",
  "every love song is about you and I hate it",
  "I'm sorry I wasn't enough",
  "you were the only person who made silence comfortable",
  "I kept your voicemail. I play it when I can't sleep",
  "I wish I told you I loved you before it was too late",
  "sometimes I write you letters I'll never send",
  "you deserved someone who stayed",
  "I think about the way you laughed every single day",
  "nobody will ever know me the way you did",
  "the worst part is I'd do it all again",
  "I miss who I was when I was with you",
  "you were right about everything",
  "I drove past your house. I don't know why",
  "some nights I still reach for you in my sleep",
  "you changed me. I hope you know that",
  "I'm still angry and I'm still in love",
  "I hope she makes you happy. I mean it",
  "the hardest part was learning to eat alone again",
  "I told everyone I was over you. I lied",
  "you were my person. I don't know who I am without that",
  "I keep your photo in my wallet. old school I know",
  "my biggest regret is not fighting harder for us",
  "I hear your name and I still flinch",
  "you made rainy days feel like a gift",
  "I never loved anyone the way I loved you",
  "if you're reading this please know I tried",
  "I named my plant after you. it's thriving unlike us",
  "the distance between us feels like a punishment",
  "I wrote your name in the sand and watched the waves take it",
  "you are the first person I think about every morning",
  "our song came on at the grocery store and I had to leave",
  "I practice what I'd say if I saw you again. I never get it right",
  "I miss your mom's cooking almost as much as I miss you",
  "you taught me that love doesn't always mean staying",
  "I kept the ticket stubs from our first movie",
  "the saddest part is how ordinary the ending was",
  "I hope you found what you were looking for",
  "I'm proud of who you've become even from a distance",
  "I still order your coffee by accident",
  "you were the bravest person I ever knew",
  "I think about you when it rains",
  "they ask me about my type. I just describe you",
  "I learned to cook your favorite meal after you left",
  "every airport reminds me of the time you almost came back",
  "you were my 3am and my good morning",
  "I deleted your number but I still know it by heart",
  "we were kids and we loved like it was the last day on earth",
  "I carry you in every song I listen to",
  "you made me feel brave enough to be soft",
  "I saw your twin today and nearly called out your name",
  "I haven't been to our restaurant since",
  "you left and took the color out of everything",
  "I miss being someone's favorite person",
  "the way you said my name was different from everyone else",
  "I kept all the promises I made to you. every single one",
];

export default function ConfessionMode() {
  const [phase, setPhase] = useState<Phase>('void');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [revealStep, setRevealStep] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const submitLockRef = useRef(false);
  const fingerprintRef = useRef<string>('');

  // Shuffle wall messages once and memoize
  const shuffledWall = useMemo(() => {
    const arr = [...WALL_MESSAGES];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  useEffect(() => {
    getBrowserFingerprint().then(fp => {
      fingerprintRef.current = fp;
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (phase !== 'void') return;
    const interval = setInterval(() => setCursorBlink(b => !b), 530);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === 'void' && !showNameInput && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [phase, showNameInput]);

  useEffect(() => {
    if (showNameInput && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showNameInput]);

  const words = message.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const isOverLimit = wordCount > MAX_WORDS;

  const handleMessageDone = useCallback(() => {
    if (!message.trim() || isOverLimit) return;
    setShowNameInput(true);
  }, [message, isOverLimit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageDone();
    }
  }, [handleMessageDone]);

  const handleNameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, message]);

  async function handleSubmit() {
    if (submitLockRef.current) return;
    if (!name.trim() || !message.trim() || isOverLimit) return;

    submitLockRef.current = true;
    setPhase('submitting');
    setErrorMsg('');

    const colorId = CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)].id;

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          color_id: colorId,
          idempotency_key: crypto.randomUUID(),
          fingerprint_hash: fingerprintRef.current || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Something went wrong.');
        setPhase('void');
        submitLockRef.current = false;
        return;
      }

      // Start cinematic reveal — no API fetch, use local wall messages
      setPhase('revealing');
      startReveal();
    } catch {
      setErrorMsg('Network error. Check your connection.');
      setPhase('void');
    } finally {
      submitLockRef.current = false;
    }
  }

  function startReveal() {
    setRevealStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setRevealStep(step);
      if (step >= 30) {
        clearInterval(interval);
        setTimeout(() => setPhase('wall'), 800);
      }
    }, 120);
  }

  function resetToVoid() {
    setPhase('void');
    setName('');
    setMessage('');
    setShowNameInput(false);
    setRevealStep(0);
    setErrorMsg('');
  }

  // ─── VOID PHASE ────────────────────────────────────────────
  if (phase === 'void') {
    return (
      <div className="confess">
        <div className="confess__void">
          <div className="confess__particles">
            {Array.from({ length: 20 }, (_, i) => (
              <span key={i} className="confess__particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
              }} />
            ))}
          </div>

          {!showNameInput ? (
            <div className="confess__write">
              <p className="confess__prompt">write what you never said</p>
              <div className="confess__textarea-wrap">
                <textarea
                  ref={textareaRef}
                  className="confess__textarea"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  maxLength={250}
                  autoComplete="off"
                  spellCheck={false}
                  rows={4}
                />
                {!message && (
                  <span className={`confess__cursor ${cursorBlink ? 'confess__cursor--on' : ''}`}>|</span>
                )}
              </div>

              {message.trim() && (
                <div className="confess__meta">
                  <span className={`confess__wc ${isOverLimit ? 'confess__wc--over' : ''}`}>
                    {wordCount}/{MAX_WORDS}
                  </span>
                  {!isOverLimit && (
                    <button className="confess__next" onClick={handleMessageDone}>
                      continue →
                    </button>
                  )}
                </div>
              )}

              {errorMsg && <p className="confess__error">{errorMsg}</p>}
            </div>
          ) : (
            <div className="confess__name-phase">
              <p className="confess__your-words">&ldquo;{message}&rdquo;</p>
              <p className="confess__name-prompt">who was this for?</p>
              <input
                ref={nameInputRef}
                type="text"
                className="confess__name-input"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={handleNameKeyDown}
                placeholder=""
                maxLength={30}
                autoComplete="off"
                spellCheck={false}
              />
              <div className="confess__actions">
                <button className="confess__back" onClick={() => setShowNameInput(false)}>
                  ← back
                </button>
                {name.trim() && (
                  <button className="confess__send" onClick={handleSubmit}>
                    let it go
                  </button>
                )}
              </div>
              {errorMsg && <p className="confess__error">{errorMsg}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── SUBMITTING PHASE ──────────────────────────────────────
  if (phase === 'submitting') {
    return (
      <div className="confess">
        <div className="confess__void">
          <div className="confess__sending">
            <div className="confess__sending-dot" />
            <div className="confess__sending-dot" />
            <div className="confess__sending-dot" />
          </div>
        </div>
      </div>
    );
  }

  // ─── REVEALING PHASE — messages float in one by one ────────
  if (phase === 'revealing') {
    return (
      <div className="confess">
        <div className="confess__void">
          <div className="confess__reveal-wall">
            <p className="confess__reveal-text">you are not alone</p>
            <div className="confess__floating-messages">
              {shuffledWall.slice(0, revealStep).map((msg, i) => (
                <span
                  key={i}
                  className="confess__float-msg"
                  style={{
                    animationDelay: `${i * 0.12}s`,
                    top: `${10 + (i * 2.8) % 75}%`,
                    left: `${5 + ((i * 17) % 80)}%`,
                    fontSize: `${0.75 + (i % 4) * 0.1}rem`,
                    opacity: Math.max(0.15, 0.5 - i * 0.01),
                  }}
                >
                  {msg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── WALL PHASE — full floating wall with your message ─────
  return (
    <div className="confess">
      <div className="confess__wall">
        <div className="confess__wall-header">
          <p className="confess__wall-yours">
            &ldquo;{message}&rdquo;
            <span className="confess__wall-to">— to {name}</span>
          </p>
          <p className="confess__wall-safe">your words are safe now</p>
          <div className="confess__wall-actions">
            <button className="confess__btn" onClick={resetToVoid}>
              Confess Again
            </button>
            <a href="/letters" className="confess__btn confess__btn--outline">
              Read All Letters
            </a>
          </div>
        </div>

        <div className="confess__drifting-wall">
          {shuffledWall.map((msg, i) => (
            <span
              key={i}
              className="confess__drift-msg"
              style={{
                animationDuration: `${18 + (i % 8) * 4}s`,
                animationDelay: `${(i * 0.6) % 10}s`,
                top: `${5 + ((i * 7) % 85)}%`,
                fontSize: `${0.72 + (i % 5) * 0.08}rem`,
              }}
            >
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
