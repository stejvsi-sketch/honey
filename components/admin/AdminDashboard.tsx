'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

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

interface Stats { total_memories: number; total_pending: number; total_banned: number; }

export default function AdminDashboard({ secret }: { secret: string }) {
  const [tab, setTab] = useState<'pending' | 'approved' | 'banned'>('pending');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [stats, setStats] = useState<Stats>({ total_memories: 0, total_pending: 0, total_banned: 0 });
  const [loading, setLoading] = useState(true);
  const [pinDuration, setPinDuration] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');

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
      } else if (tab === 'approved') {
        const memRes = await fetch('/api/admin/memories', { headers });
        if (memRes.ok) setMemories(await memRes.json());
        setSubmissions([]);
        setBannedUsers([]);
      } else {
        const subsRes = await fetch(`/api/admin/submissions?status=pending`, { headers });
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

  function handleLogout() {
    window.location.reload();
  }

  const isPinActive = (m: MemoryItem) => m.pinned_until && new Date(m.pinned_until) > new Date();

  // Search filtering
  const filteredPending = useMemo(() => submissions.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.message.toLowerCase().includes(search.toLowerCase())
  ), [submissions, search]);

  const filteredApproved = useMemo(() => memories.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.message.toLowerCase().includes(search.toLowerCase())
  ), [memories, search]);

  const filteredBanned = useMemo(() => bannedUsers.filter(b => 
    b.ip_hash.toLowerCase().includes(search.toLowerCase()) ||
    (b.reason && b.reason.toLowerCase().includes(search.toLowerCase()))
  ), [bannedUsers, search]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px', background: '#f5f5f5', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.1, color: '#111827', margin: 0 }}>
          Admin<br/>Panel
        </h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={handleLogout} style={{ 
            background: '#ef4444', color: 'white', border: 'none', padding: '8px 24px', 
            borderRadius: '6px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #d1d5db', marginBottom: '24px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button 
          onClick={() => setTab('pending')}
          style={{ 
            padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
            borderBottom: tab === 'pending' ? '3px solid #3b82f6' : '3px solid transparent',
            color: tab === 'pending' ? '#111827' : '#6b7280', fontWeight: tab === 'pending' ? 600 : 500,
            display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
          }}
        >
          Pending
          <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
            {stats.total_pending}
          </span>
        </button>
        <button 
          onClick={() => setTab('approved')}
          style={{ 
            padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
            borderBottom: tab === 'approved' ? '3px solid #3b82f6' : '3px solid transparent',
            color: tab === 'approved' ? '#111827' : '#6b7280', fontWeight: tab === 'approved' ? 600 : 500,
            display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
          }}
        >
          Approved
          <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
            {stats.total_memories}
          </span>
        </button>
        <button 
          onClick={() => setTab('banned')}
          style={{ 
            padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
            borderBottom: tab === 'banned' ? '3px solid #3b82f6' : '3px solid transparent',
            color: tab === 'banned' ? '#111827' : '#6b7280', fontWeight: tab === 'banned' ? 600 : 500,
            display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
          }}
        >
          Banned
          <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
            {stats.total_banned}
          </span>
        </button>
      </div>

      {/* Search & Refresh */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="Search by recipient, message..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            flex: 1, padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', 
            fontSize: '1rem', outline: 'none'
          }}
        />
        <button 
          onClick={fetchData}
          style={{ 
            background: '#3b82f6', color: 'white', border: 'none', padding: '0 24px', 
            borderRadius: '8px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      {/* Content */}
      <div style={{ paddingBottom: '60px' }}>
        {loading ? (
          <p style={{ color: '#6b7280' }}>Loading...</p>
        ) : tab === 'pending' ? (
          <>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>Showing {filteredPending.length} of {submissions.length} pending</p>
            {filteredPending.length === 0 && <p style={{ color: '#6b7280' }}>No pending memories found.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredPending.map(sub => (
                <div key={sub.id} style={{ 
                  background: 'white', borderRadius: '12px', padding: '20px', 
                  borderLeft: '5px solid #fbbf24', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>
                    To: {sub.name}
                  </div>
                  <div style={{ color: '#374151', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '16px' }}>
                    {sub.message}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem' }}>
                      🎨 {sub.color_id}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '16px', lineHeight: 1.5 }}>
                    IP: {sub.ip_hash.slice(0,12)}...<br/>
                    UUID: {sub.user_uuid.slice(0,8)}...<br/>
                    Country: {sub.country}<br/>
                    {new Date(sub.created_at).toLocaleString()}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleAction(sub.id, 'approve')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                    <button onClick={() => handleAction(sub.id, 'reject')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                    <button onClick={() => handleAction(sub.id, 'ban')} style={{ background: '#1f2937', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Ban IP</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : tab === 'approved' ? (
          <>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>Showing {filteredApproved.length} of {memories.length} memories</p>
            {filteredApproved.length === 0 && <p style={{ color: '#6b7280' }}>No memories found.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredApproved.map(mem => (
                <div key={mem.id} style={{ 
                  background: 'white', borderRadius: '12px', padding: '20px', 
                  borderLeft: isPinActive(mem) ? '5px solid #8b5cf6' : '5px solid #10b981', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>
                    {isPinActive(mem) && '📌 '}To: {mem.name}
                  </div>
                  <div style={{ color: '#374151', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '16px' }}>
                    {mem.message}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem' }}>
                      🎨 {mem.color_id}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '16px', lineHeight: 1.5 }}>
                    {new Date(mem.created_at).toLocaleString()}
                    {isPinActive(mem) && <><br/><span style={{ color: '#8b5cf6', fontWeight: 600 }}>Pinned until {new Date(mem.pinned_until!).toLocaleString()}</span></>}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button onClick={() => handleAction(mem.id, 'delete')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                    
                    {isPinActive(mem) ? (
                      <button onClick={() => handleUnpin(mem.id)} style={{ background: 'transparent', color: '#8b5cf6', border: '1px solid #8b5cf6', padding: '7px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Unpin</button>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          value={pinDuration[mem.id] || '24'}
                          onChange={(e) => setPinDuration(prev => ({ ...prev, [mem.id]: e.target.value }))}
                          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white' }}
                        >
                          <option value="24">24 H</option>
                          <option value="48">48 H</option>
                          <option value="168">7 D</option>
                        </select>
                        <button onClick={() => handlePin(mem.id)} style={{ background: '#4b5563', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Pin</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>Showing {filteredBanned.length} of {bannedUsers.length} banned users</p>
            {filteredBanned.length === 0 && <p style={{ color: '#6b7280' }}>No banned users found.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredBanned.map(user => (
                <div key={user.id} style={{ 
                  background: 'white', borderRadius: '12px', padding: '20px', 
                  borderLeft: '5px solid #ef4444', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>
                    Banned IP / User
                  </div>
                  <div style={{ color: '#374151', fontSize: '1rem', marginBottom: '12px' }}>
                    Reason: {user.reason}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '16px', lineHeight: 1.5 }}>
                    IP Hash: {user.ip_hash}<br/>
                    UUID: {user.user_uuid || 'N/A'}<br/>
                    Country: {user.country}<br/>
                    {new Date(user.created_at).toLocaleString()}
                  </div>
                  <button onClick={() => handleUnban(user.ip_hash)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Unban</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
