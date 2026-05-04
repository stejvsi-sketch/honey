'use client';

import { useState, useEffect, useCallback } from 'react';

interface Submission {
  id: string; name: string; message: string; color_id: string;
  status: string; ip_hash: string; country: string; user_uuid: string; created_at: string;
}

interface Stats { total_memories: number; total_pending: number; total_rejected: number; total_banned: number; }

export default function AdminDashboard({ secret }: { secret: string }) {
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected' | 'banned'>('pending');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats>({ total_memories: 0, total_pending: 0, total_rejected: 0, total_banned: 0 });
  const [loading, setLoading] = useState(true);

  const headers = { 'Content-Type': 'application/json', 'x-admin-secret': secret };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/submissions?status=${tab}`, { headers }),
        fetch('/api/admin/stats', { headers }),
      ]);
      if (subsRes.ok) setSubmissions(await subsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [tab, secret]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleAction(id: string, action: 'approve' | 'reject' | 'delete' | 'ban') {
    await fetch('/api/admin/action', {
      method: 'POST', headers,
      body: JSON.stringify({ id, action }),
    });
    fetchData();
  }

  const tabStyle = (t: string) => ({
    padding: '8px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    cursor: 'pointer', fontSize: '0.85rem',
    background: tab === t ? 'var(--text)' : 'transparent',
    color: tab === t ? 'var(--bg)' : 'var(--text-muted)',
  });

  return (
    <div className="page">
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: 24 }}>Admin Panel</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Published', value: stats.total_memories },
          { label: 'Pending', value: stats.total_pending },
          { label: 'Rejected', value: stats.total_rejected },
          { label: 'Banned', value: stats.total_banned },
        ].map(s => (
          <div key={s.label} style={{
            padding: 20, border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {(['pending', 'approved', 'rejected', 'banned'] as const).map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Submissions list */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Loading...</p>
      ) : submissions.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No {tab} submissions.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {submissions.map(sub => (
            <div key={sub.id} style={{
              padding: 20, border: '1px solid var(--border-light)', borderRadius: 'var(--radius)',
              background: 'rgba(255,255,255,0.3)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, marginBottom: 4 }}>
                    To {sub.name}
                  </div>
                  <div style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 8 }}>
                    &ldquo;{sub.message}&rdquo;
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    Color: {sub.color_id} · Country: {sub.country} · IP: {sub.ip_hash.slice(0, 12)}... · {new Date(sub.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {tab === 'pending' && (
                    <>
                      <button className="btn" style={{ width: 'auto', padding: '6px 16px', fontSize: '0.8rem' }}
                        onClick={() => handleAction(sub.id, 'approve')}>Approve</button>
                      <button className="btn btn--outline" style={{ width: 'auto', padding: '6px 16px', fontSize: '0.8rem' }}
                        onClick={() => handleAction(sub.id, 'reject')}>Reject</button>
                    </>
                  )}
                  <button className="btn btn--outline" style={{ width: 'auto', padding: '6px 16px', fontSize: '0.8rem', borderColor: '#a8432b', color: '#a8432b' }}
                    onClick={() => handleAction(sub.id, 'ban')}>Ban User</button>
                  <button className="btn btn--outline" style={{ width: 'auto', padding: '6px 16px', fontSize: '0.8rem' }}
                    onClick={() => handleAction(sub.id, 'delete')}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
