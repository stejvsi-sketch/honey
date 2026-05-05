'use client';

import { useState, useEffect, useCallback } from 'react';

interface Submission {
  id: string; name: string; message: string; color_id: string;
  status: string; ip_hash: string; country: string; user_uuid: string; created_at: string;
}

interface MemoryItem {
  id: string; name: string; message: string; color_id: string;
  created_at: string; pinned_until: string | null;
}

interface BannedUser {
  id: string; ip_hash: string; user_uuid: string;
  country: string; reason: string; created_at: string;
}

interface Stats { total_memories: number; total_pending: number; total_rejected: number; total_banned: number; }

export default function AdminDashboard({ secret }: { secret: string }) {
  const [tab, setTab] = useState<'pending' | 'approved' | 'banned' | 'memories'>('pending');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [stats, setStats] = useState<Stats>({ total_memories: 0, total_pending: 0, total_rejected: 0, total_banned: 0 });
  const [loading, setLoading] = useState(true);
  const [pinDuration, setPinDuration] = useState<Record<string, string>>({});

  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'x-admin-secret': secret };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/admin/stats', { headers });
      if (statsRes.ok) setStats(await statsRes.json());

      if (tab === 'banned') {
        const bannedRes = await fetch('/api/admin/banned', { headers });
        if (bannedRes.ok) setBannedUsers(await bannedRes.json());
        setSubmissions([]);
        setMemories([]);
      } else if (tab === 'memories') {
        const memRes = await fetch('/api/admin/memories', { headers });
        if (memRes.ok) setMemories(await memRes.json());
        setSubmissions([]);
        setBannedUsers([]);
      } else {
        const subsRes = await fetch(`/api/admin/submissions?status=${tab}`, { headers });
        if (subsRes.ok) setSubmissions(await subsRes.json());
        setBannedUsers([]);
        setMemories([]);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, secret]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleAction(id: string, action: 'approve' | 'reject' | 'delete' | 'ban') {
    await fetch('/api/admin/action', {
      method: 'POST', headers,
      body: JSON.stringify({ id, action }),
    });
    fetchData();
  }

  async function handleUnban(ipHash: string) {
    await fetch('/api/admin/action', {
      method: 'POST', headers,
      body: JSON.stringify({ ip_hash: ipHash, action: 'unban' }),
    });
    fetchData();
  }

  async function handlePin(memoryId: string) {
    const hours = parseInt(pinDuration[memoryId] || '24', 10);
    if (isNaN(hours) || hours <= 0) return;
    await fetch('/api/admin/action', {
      method: 'POST', headers,
      body: JSON.stringify({ id: memoryId, action: 'pin', hours }),
    });
    fetchData();
  }

  async function handleUnpin(memoryId: string) {
    await fetch('/api/admin/action', {
      method: 'POST', headers,
      body: JSON.stringify({ id: memoryId, action: 'unpin' }),
    });
    fetchData();
  }

  const tabStyle = (t: string) => ({
    padding: '8px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    cursor: 'pointer', fontSize: '0.85rem',
    background: tab === t ? 'var(--text)' : 'transparent',
    color: tab === t ? 'var(--bg)' : 'var(--text-muted)',
  });

  const isPinActive = (m: MemoryItem) => m.pinned_until && new Date(m.pinned_until) > new Date();

  return (
    <div className="page">
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: 24 }}>Admin Panel</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Published', value: stats.total_memories },
          { label: 'Pending', value: stats.total_pending },
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
        {(['pending', 'approved', 'banned', 'memories'] as const).map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t === 'memories' ? '📌 Memories' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Loading...</p>
      ) : tab === 'banned' ? (
        /* Banned users list */
        bannedUsers.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No banned users.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bannedUsers.map(user => (
              <div key={user.id} style={{
                padding: 20, border: '1px solid var(--border-light)', borderRadius: 'var(--radius)',
                background: 'rgba(255,255,255,0.3)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, marginBottom: 4 }}>
                      Banned User
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      Reason: {user.reason}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      Country: {user.country} · ID: {user.ip_hash.slice(0, 12)}... · UUID: {user.user_uuid?.slice(0, 8) || 'N/A'}... · {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn--outline" style={{ width: 'auto', padding: '6px 16px', fontSize: '0.8rem' }}
                      onClick={() => handleUnban(user.ip_hash)}>Unban</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : tab === 'memories' ? (
        /* Memories list with pin controls */
        memories.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No published memories.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {memories.map(mem => (
              <div key={mem.id} style={{
                padding: 20, border: `1px solid ${isPinActive(mem) ? '#c4a67a' : 'var(--border-light)'}`,
                borderRadius: 'var(--radius)',
                background: isPinActive(mem) ? 'rgba(196, 166, 122, 0.08)' : 'rgba(255,255,255,0.3)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, marginBottom: 4 }}>
                      {isPinActive(mem) && <span style={{ color: '#c4a67a', marginRight: 6 }}>📌</span>}
                      To {mem.name}
                    </div>
                    <div style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 8 }}>
                      &ldquo;{mem.message}&rdquo;
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      Color: {mem.color_id} · {new Date(mem.created_at).toLocaleDateString()}
                      {isPinActive(mem) && (
                        <span style={{ color: '#c4a67a', marginLeft: 8 }}>
                          · Pinned until {new Date(mem.pinned_until!).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    {isPinActive(mem) ? (
                      <button className="btn btn--outline" style={{ width: 'auto', padding: '6px 16px', fontSize: '0.8rem', borderColor: '#c4a67a', color: '#c4a67a' }}
                        onClick={() => handleUnpin(mem.id)}>Unpin</button>
                    ) : (
                      <>
                        <select
                          value={pinDuration[mem.id] || '24'}
                          onChange={(e) => setPinDuration(prev => ({ ...prev, [mem.id]: e.target.value }))}
                          style={{ padding: '6px 8px', fontSize: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'transparent' }}
                        >
                          <option value="1">1 hour</option>
                          <option value="6">6 hours</option>
                          <option value="12">12 hours</option>
                          <option value="24">24 hours</option>
                          <option value="48">2 days</option>
                          <option value="72">3 days</option>
                          <option value="168">7 days</option>
                          <option value="336">14 days</option>
                          <option value="720">30 days</option>
                        </select>
                        <button className="btn" style={{ width: 'auto', padding: '6px 16px', fontSize: '0.8rem', background: '#c4a67a' }}
                          onClick={() => handlePin(mem.id)}>📌 Pin</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Submissions list */
        submissions.length === 0 ? (
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
                      Color: {sub.color_id} · Country: {sub.country} · ID: {sub.ip_hash.slice(0, 12)}... · {new Date(sub.created_at).toLocaleDateString()}
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
        )
      )}
    </div>
  );
}
