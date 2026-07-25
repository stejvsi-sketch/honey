'use client';

import { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';

const STORAGE_KEY = 'honey_admin_session';
const COOKIE_KEY = 'hio_admin';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function setCookie(secret: string) {
  const expires = new Date(Date.now() + SESSION_DURATION_MS).toUTCString();
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(secret)}; expires=${expires}; path=/; SameSite=Strict`;
}

function getCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function clearCookie() {
  document.cookie = `${COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}

export default function AdminLogin() {
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  // On mount, check localStorage first, then cookie as fallback
  useEffect(() => {
    let cancelled = false;

    function tryValidate(storedSecret: string) {
      fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: storedSecret }),
      }).then(res => {
        if (cancelled) return;
        if (res.ok) {
          setSecret(storedSecret);
          setAuthenticated(true);
          // Re-save to both storages in case one was cleared
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ secret: storedSecret, expiresAt: Date.now() + SESSION_DURATION_MS })); } catch {}
          setCookie(storedSecret);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          clearCookie();
        }
        setChecking(false);
      }).catch(() => {
        if (cancelled) return;
        localStorage.removeItem(STORAGE_KEY);
        clearCookie();
        setChecking(false);
      });
    }

    // Try localStorage first
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        if (session.secret && session.expiresAt && Date.now() < session.expiresAt) {
          tryValidate(session.secret);
          return () => { cancelled = true; };
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {}

    // Fallback: try cookie
    const cookieSecret = getCookie();
    if (cookieSecret) {
      tryValidate(cookieSecret);
      return () => { cancelled = true; };
    }

    queueMicrotask(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    });
    if (res.ok) {
      // Save session to both localStorage and cookie for 30 days
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          secret,
          expiresAt: Date.now() + SESSION_DURATION_MS,
        }));
      } catch {
        // Silently fail if storage is full
      }
      setCookie(secret);
      setAuthenticated(true);
    } else {
      setError('Invalid secret.');
    }
  }

  if (checking) {
    return (
      <div className="page page--narrow" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-muted)', fontStyle: 'italic' }}>Verifying session...</p>
      </div>
    );
  }

  if (authenticated) return <AdminDashboard secret={secret} />;

  return (
    <div className="page page--narrow" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 360 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 24, textAlign: 'center' }}>
          Admin Access
        </h1>
        <div className="form__group">
          <input
            className="form__input" type="password" value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="Enter admin secret" required autoComplete="off"
          />
        </div>
        {error && <p className="form__error" style={{ marginBottom: 12 }}>{error}</p>}
        <button className="btn" type="submit">Enter</button>
      </form>
    </div>
  );
}
