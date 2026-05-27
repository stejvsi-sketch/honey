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

/* ── colour palette for admin ── */
const C = {
  bg:         '#1c1917',
  cardBg:     '#292524',
  cardBorder: '#3f3a36',
  accent:     '#c4a67a',
  accentDim:  'rgba(196,166,122,0.35)',
  text:       '#e7e0d8',
  textMuted:  '#a89f94',
  textFaint:  '#706861',
  green:      '#5cb87a',
  greenDim:   'rgba(92,184,122,0.15)',
  greenBorder:'rgba(92,184,122,0.35)',
  red:        '#e06060',
  redDim:     'rgba(224,96,96,0.12)',
  redBorder:  'rgba(224,96,96,0.30)',
  yellow:     '#e8c44a',
  yellowDim:  'rgba(232,196,74,0.12)',
  yellowBorder:'rgba(232,196,74,0.30)',
};

const PAGE_SIZE = 50;

export default function AdminDashboard({ secret }: { secret: string }) {
  const [tab, setTab] = useState<'pending' | 'approved' | 'banned'>('pending');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [stats, setStats] = useState<Stats>({ total_memories: 0, total_pending: 0, total_banned: 0 });
  const [loading, setLoading] = useState(true);
  const [pinDuration, setPinDuration] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  // ── Pagination state ──
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'x-admin-secret': secret };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setSelected(new Set()); // Clear selection on refresh
    try {
      const statsRes = await fetch('/api/admin/stats', { headers });
      if (statsRes.ok) setStats(await statsRes.json());

      if (tab === 'banned') {
        const bannedRes = await fetch('/api/admin/banned', { headers });
        if (bannedRes.ok) setBannedUsers(await bannedRes.json());
        setSubmissions([]);
        setMemories([]);
        setTotalItems(0);
      } else if (tab === 'approved') {
        const memRes = await fetch(`/api/admin/memories?page=${page}&limit=${PAGE_SIZE}`, { headers });
        if (memRes.ok) {
          const json = await memRes.json();
          setMemories(json.data || json);
          setTotalItems(json.total || 0);
        }
        setSubmissions([]);
        setBannedUsers([]);
      } else {
        const subsRes = await fetch(`/api/admin/submissions?status=pending&page=${page}&limit=${PAGE_SIZE}`, { headers });
        if (subsRes.ok) {
          const json = await subsRes.json();
          setSubmissions(json.data || json);
          setTotalItems(json.total || 0);
        }
        setBannedUsers([]);
        setMemories([]);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, secret, page]);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) void fetchData();
    });

    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
    setSearch('');
  }, [tab]);

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
    try { localStorage.removeItem('honey_admin_session'); } catch {}
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

  // ── Bulk selection helpers ──
  const currentIds = useMemo(() => {
    if (tab === 'pending') return filteredPending.map(s => s.id);
    if (tab === 'approved') return filteredApproved.map(m => m.id);
    return [];
  }, [tab, filteredPending, filteredApproved]);

  const allSelected = currentIds.length > 0 && currentIds.every(id => selected.has(id));

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(currentIds));
    }
  }

  async function handleBulkAction(action: 'approve' | 'reject' | 'delete') {
    if (selected.size === 0) return;
    const confirmMsg = action === 'approve'
      ? `Approve ${selected.size} item(s)?`
      : `Delete ${selected.size} item(s)? This cannot be undone.`;
    if (!confirm(confirmMsg)) return;

    setBulkLoading(true);
    const promises = Array.from(selected).map(id =>
      fetch('/api/admin/action', {
        method: 'POST', headers,
        body: JSON.stringify({ id, action }),
      })
    );
    await Promise.all(promises);
    setBulkLoading(false);
    fetchData();
  }

  /* ── Shared styles ── */
  const btnStyle = (bg: string, color: string, border: string): React.CSSProperties => ({
    background: bg, color, border: `1px solid ${border}`,
    padding: '7px 18px', borderRadius: '6px', cursor: 'pointer',
    fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.15s',
  });

  const checkboxStyle: React.CSSProperties = {
    width: 18, height: 18, accentColor: C.accent, cursor: 'pointer',
  };

  /* ── Pagination component ── */
  function PaginationBar() {
    if (tab === 'banned' || totalPages <= 1) return null;
    
    const startItem = (page - 1) * PAGE_SIZE + 1;
    const endItem = Math.min(page * PAGE_SIZE, totalItems);

    return (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 16px', margin: '16px 0',
        background: C.cardBg, borderRadius: '8px',
        border: `1px solid ${C.cardBorder}`,
        flexWrap: 'wrap', gap: '12px',
      }}>
        <span style={{ fontSize: '0.85rem', color: C.textMuted }}>
          {startItem}–{endItem} of {totalItems.toLocaleString()}
        </span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            onClick={() => setPage(1)}
            disabled={page <= 1}
            style={{
              ...btnStyle(C.cardBg, page <= 1 ? C.textFaint : C.text, C.cardBorder),
              padding: '7px 12px',
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              opacity: page <= 1 ? 0.4 : 1,
            }}
          >
            ««
          </button>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{
              ...btnStyle(C.cardBg, page <= 1 ? C.textFaint : C.text, C.cardBorder),
              padding: '7px 14px',
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              opacity: page <= 1 ? 0.4 : 1,
            }}
          >
            ‹ Prev
          </button>
          <span style={{ fontSize: '0.85rem', color: C.accent, fontWeight: 600, padding: '0 8px' }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            style={{
              ...btnStyle(C.cardBg, page >= totalPages ? C.textFaint : C.text, C.cardBorder),
              padding: '7px 14px',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              opacity: page >= totalPages ? 0.4 : 1,
            }}
          >
            Next ›
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page >= totalPages}
            style={{
              ...btnStyle(C.cardBg, page >= totalPages ? C.textFaint : C.text, C.cardBorder),
              padding: '7px 12px',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              opacity: page >= totalPages ? 0.4 : 1,
            }}
          >
            »»
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '20px 16px', background: C.bg, minHeight: '100vh', color: C.text }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 500, color: C.text, margin: 0 }}>
          Admin Panel
        </h1>
        <button onClick={handleLogout} style={{
          ...btnStyle('transparent', C.red, C.redBorder),
          fontSize: '0.8rem', padding: '6px 16px',
        }}>
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: C.cardBg, padding: '4px', borderRadius: '8px' }}>
        {(['pending', 'approved', 'banned'] as const).map((t) => {
          const isActive = tab === t;
          const count = t === 'pending' ? stats.total_pending : t === 'approved' ? stats.total_memories : stats.total_banned;
          return (
            <button 
              key={t}
              onClick={() => { setTab(t); setSelected(new Set()); }}
              style={{ 
                flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
                borderRadius: '6px', transition: 'all 0.15s',
                background: isActive ? C.accent : 'transparent',
                color: isActive ? C.bg : C.textMuted,
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.95rem', fontFamily: 'var(--font-serif)',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span style={{ 
                marginLeft: '6px', fontSize: '0.8rem',
                opacity: isActive ? 0.8 : 0.6,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Refresh & Bulk Actions */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by name, message..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            flex: 1, minWidth: '180px', padding: '10px 14px',
            border: `1px solid ${C.cardBorder}`, borderRadius: '6px', 
            fontSize: '0.9rem', outline: 'none', background: C.cardBg, color: C.text,
          }}
        />
        <button 
          onClick={fetchData}
          style={btnStyle(C.cardBg, C.text, C.cardBorder)}
        >
          Refresh
        </button>
      </div>

      {/* Bulk action bar */}
      {(tab === 'pending' || tab === 'approved') && !loading && currentIds.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 14px', marginBottom: '16px',
          background: C.cardBg, borderRadius: '8px',
          border: `1px solid ${C.cardBorder}`,
          flexWrap: 'wrap',
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: C.textMuted }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              style={checkboxStyle}
            />
            Select all ({currentIds.length})
          </label>

          {selected.size > 0 && (
            <>
              <span style={{ fontSize: '0.85rem', color: C.accent, fontWeight: 500 }}>
                {selected.size} selected
              </span>
              <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                {tab === 'pending' && (
                  <button
                    onClick={() => handleBulkAction('approve')}
                    disabled={bulkLoading}
                    style={btnStyle(C.greenDim, C.green, C.greenBorder)}
                  >
                    {bulkLoading ? 'Working...' : `Approve (${selected.size})`}
                  </button>
                )}
                <button
                  onClick={() => handleBulkAction(tab === 'pending' ? 'reject' : 'delete')}
                  disabled={bulkLoading}
                  style={btnStyle(C.redDim, C.red, C.redBorder)}
                >
                  {bulkLoading ? 'Working...' : `Delete (${selected.size})`}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Pagination — top */}
      <PaginationBar />

      {/* Content */}
      <div style={{ paddingBottom: '60px' }}>
        {loading ? (
          <p style={{ color: C.textMuted, fontStyle: 'italic', textAlign: 'center', padding: '40px 0' }}>Loading...</p>
        ) : tab === 'pending' ? (
          <>
            <p style={{ color: C.textMuted, marginBottom: '12px', fontSize: '0.85rem' }}>
              Showing {filteredPending.length} of {totalItems.toLocaleString()} pending
            </p>
            {filteredPending.length === 0 && <p style={{ color: C.textFaint, fontStyle: 'italic' }}>The queue is empty.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredPending.map(sub => (
                <div key={sub.id} style={{ 
                  background: C.cardBg, borderRadius: '8px', padding: '20px', 
                  border: `1px solid ${selected.has(sub.id) ? C.accent : C.cardBorder}`,
                  borderLeft: `3px solid ${selected.has(sub.id) ? C.accent : C.yellow}`,
                  transition: 'border-color 0.15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={selected.has(sub.id)}
                      onChange={() => toggleSelect(sub.id)}
                      style={{ ...checkboxStyle, marginTop: '4px', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '8px', color: C.text, fontWeight: 500 }}>
                        To {sub.name}
                      </div>
                      <div style={{ color: C.textMuted, fontSize: '1rem', lineHeight: 1.6, marginBottom: '12px', wordBreak: 'break-word' }}>
                        &ldquo;{sub.message}&rdquo;
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <span style={{ background: 'rgba(255,255,255,0.06)', color: C.textFaint, padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                          {sub.color_id}
                        </span>
                        <span style={{ background: 'rgba(255,255,255,0.06)', color: C.textFaint, padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                          {sub.country}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: C.textFaint, marginBottom: '14px', lineHeight: 1.5 }}>
                        IP: {sub.ip_hash.slice(0,12)}... &middot; UUID: {sub.user_uuid.slice(0,8)}... &middot; {new Date(sub.created_at).toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => handleAction(sub.id, 'approve')} style={btnStyle(C.greenDim, C.green, C.greenBorder)}>Approve</button>
                        <button onClick={() => handleAction(sub.id, 'reject')} style={btnStyle(C.redDim, C.red, C.redBorder)}>Delete</button>
                        <button onClick={() => handleAction(sub.id, 'ban')} style={btnStyle('transparent', C.textMuted, C.cardBorder)}>Ban IP</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : tab === 'approved' ? (
          <>
            <p style={{ color: C.textMuted, marginBottom: '12px', fontSize: '0.85rem' }}>
              Showing {filteredApproved.length} of {totalItems.toLocaleString()} memories
            </p>
            {filteredApproved.length === 0 && <p style={{ color: C.textFaint, fontStyle: 'italic' }}>No memories found.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredApproved.map(mem => (
                <div key={mem.id} style={{ 
                  background: isPinActive(mem) ? 'rgba(196, 166, 122, 0.08)' : C.cardBg, 
                  borderRadius: '8px', padding: '20px', 
                  border: `1px solid ${selected.has(mem.id) ? C.accent : isPinActive(mem) ? C.accentDim : C.cardBorder}`,
                  borderLeft: `3px solid ${selected.has(mem.id) ? C.accent : isPinActive(mem) ? C.accent : C.green}`,
                  transition: 'border-color 0.15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={selected.has(mem.id)}
                      onChange={() => toggleSelect(mem.id)}
                      style={{ ...checkboxStyle, marginTop: '4px', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '8px', color: C.text, fontWeight: 500 }}>
                        {isPinActive(mem) && '📌 '}To {mem.name}
                      </div>
                      <div style={{ color: C.textMuted, fontSize: '1rem', lineHeight: 1.6, marginBottom: '12px', wordBreak: 'break-word' }}>
                        &ldquo;{mem.message}&rdquo;
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <span style={{ background: 'rgba(255,255,255,0.06)', color: C.textFaint, padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                          {mem.color_id}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: C.textFaint, marginBottom: '14px', lineHeight: 1.5 }}>
                        {new Date(mem.created_at).toLocaleString()}
                        {isPinActive(mem) && <> &middot; <span style={{ color: C.accent }}>Pinned until {new Date(mem.pinned_until!).toLocaleString()}</span></>}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button onClick={() => handleAction(mem.id, 'delete')} style={btnStyle(C.redDim, C.red, C.redBorder)}>Delete</button>
                        
                        {isPinActive(mem) ? (
                          <button onClick={() => handleUnpin(mem.id)} style={btnStyle('transparent', C.accent, C.accentDim)}>Unpin</button>
                        ) : (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <select
                              value={pinDuration[mem.id] || '24'}
                              onChange={(e) => setPinDuration(prev => ({ ...prev, [mem.id]: e.target.value }))}
                              style={{ padding: '7px 8px', borderRadius: '6px', border: `1px solid ${C.cardBorder}`, background: C.cardBg, color: C.textMuted, fontSize: '0.85rem' }}
                            >
                              <option value="24">24 H</option>
                              <option value="48">48 H</option>
                              <option value="168">7 D</option>
                            </select>
                            <button onClick={() => handlePin(mem.id)} style={btnStyle(C.cardBg, C.text, C.cardBorder)}>Pin</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p style={{ color: C.textMuted, marginBottom: '12px', fontSize: '0.85rem' }}>
              Showing {filteredBanned.length} of {bannedUsers.length} banned users
            </p>
            {filteredBanned.length === 0 && <p style={{ color: C.textFaint, fontStyle: 'italic' }}>No banned users found.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredBanned.map(user => (
                <div key={user.id} style={{ 
                  background: C.cardBg, borderRadius: '8px', padding: '20px', 
                  border: `1px solid ${C.cardBorder}`, borderLeft: `3px solid ${C.red}`,
                }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '8px', color: C.text, fontWeight: 500 }}>
                    Banned IP / User
                  </div>
                  <div style={{ color: C.textMuted, fontSize: '0.95rem', marginBottom: '10px' }}>
                    Reason: {user.reason}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: C.textFaint, marginBottom: '14px', lineHeight: 1.5 }}>
                    IP Hash: {user.ip_hash}<br/>
                    UUID: {user.user_uuid || 'N/A'}<br/>
                    Country: {user.country}<br/>
                    {new Date(user.created_at).toLocaleString()}
                  </div>
                  <button onClick={() => handleUnban(user.ip_hash)} style={btnStyle(C.redDim, C.red, C.redBorder)}>Unban</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination — bottom */}
      <PaginationBar />
    </div>
  );
}
