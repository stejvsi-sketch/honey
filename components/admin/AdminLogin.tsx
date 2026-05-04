'use client';

import { useState } from 'react';
import AdminDashboard from './AdminDashboard';

export default function AdminLogin() {
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      setError('Invalid secret.');
    }
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
