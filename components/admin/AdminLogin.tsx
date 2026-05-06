'use client';

import { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';

const STORAGE_KEY = 'honey_admin_session';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export default function AdminLogin() {
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  // On mount, check localStorage for a saved session
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        if (session.secret && session.expiresAt && Date.now() < session.expiresAt) {
          // Validate the stored secret is still correct
          fetch('/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret: session.secret }),
          }).then(res => {
            if (res.ok) {
              setSecret(session.secret);
              setAuthenticated(true);
            } else {
              localStorage.removeItem(STORAGE_KEY);
            }
            setChecking(false);
          }).catch(() => {
            localStorage.removeItem(STORAGE_KEY);
            setChecking(false);
          });
          return;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // localStorage not available or corrupted
    }
    setChecking(false);
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
      // Save session to localStorage for 30 days
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          secret,
          expiresAt: Date.now() + SESSION_DURATION_MS,
        }));
      } catch {
        // Silently fail if storage is full
      }
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
