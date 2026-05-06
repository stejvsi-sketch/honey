'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import CardRenderer from '@/components/cards/CardRenderer';
import Link from 'next/link';
import type { Memory } from '@/lib/types';

const PAGE_SIZE = 10;
const STORAGE_KEY = 'hio:letters';

interface ArchiveState {
  memories: Memory[];
  page: number;
  total: number;
  search: string;
  scrollY: number;
}

function saveState(state: ArchiveState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded is non-fatal */ }
}

function loadState(): ArchiveState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ArchiveState;
  } catch {
    return null;
  }
}

export default function LettersArchive({ initialMemories, initialTotal }: { initialMemories?: Memory[]; initialTotal?: number }) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories || []);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal || 0);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(!initialMemories || initialMemories.length === 0);
  const [restored, setRestored] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);

  const hasMore = memories.length < total;

  // Restore state from sessionStorage on mount (Fix 4)
  useEffect(() => {
    const saved = loadState();
    if (saved && saved.memories.length > 0) {
      setMemories(saved.memories);
      setPage(saved.page);
      setTotal(saved.total);
      setSearch(saved.search);
      setSearchInput(saved.search);
      setInitialLoad(false);
      setRestored(true);
      // Defer scroll restoration to after render
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, saved.scrollY);
        });
      });
    } else {
      setRestored(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLetters = useCallback(async (pageNum: number, searchQuery: string, append: boolean) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: PAGE_SIZE.toString(),
      });
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/letters?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMemories(prev => append ? [...prev, ...data.memories] : data.memories);
        setTotal(data.total);
      }
    } catch (e) {
      console.error('Failed to fetch letters:', e);
    }
    setLoading(false);
    setInitialLoad(false);
    fetchingRef.current = false;
  }, []);

  // Initial load — only if no restored state
  useEffect(() => {
    if (!restored) return;
    const saved = loadState();
    if (saved && saved.memories.length > 0 && !search) {
      // Already restored, skip fetch
      return;
    }
    setPage(1);
    fetchLetters(1, search, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, restored]);

  // Save state before navigating away (Fix 4)
  useEffect(() => {
    function handleBeforeNav() {
      saveState({ memories, page, total, search, scrollY: window.scrollY });
    }
    window.addEventListener('beforeunload', handleBeforeNav);
    // Also save on every click (catches SPA navigation)
    document.addEventListener('click', handleBeforeNav, { capture: true });
    return () => {
      window.removeEventListener('beforeunload', handleBeforeNav);
      document.removeEventListener('click', handleBeforeNav, { capture: true });
    };
  }, [memories, page, total, search]);

  // Infinite scroll observer (Fix 5: debounced, premium feel)
  useEffect(() => {
    if (!loaderRef.current || !restored) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !fetchingRef.current) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchLetters(nextPage, search, true);
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, page, search, fetchLetters, restored]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const newSearch = searchInput.trim();
    if (newSearch !== search) {
      // Clear stored state when searching
      sessionStorage.removeItem(STORAGE_KEY);
      setSearch(newSearch);
    }
  }

  function clearSearch() {
    sessionStorage.removeItem(STORAGE_KEY);
    setSearchInput('');
    setSearch('');
  }

  return (
    <>
      <div className="page__header">
        <h1 className="page__title">All Letters</h1>
        <p className="page__subtitle">
          {total > 0
            ? <>{total.toLocaleString()} {total === 1 ? 'letter' : 'letters'} and counting</>
            : initialLoad ? <>&nbsp;</> : <>No letters yet</>
          }
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <div className="search-bar__inner">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name..."
            className="search-bar__input"
            aria-label="Search letters by name"
          />
          {search && (
            <button type="button" onClick={clearSearch} className="search-bar__clear" aria-label="Clear search">
              ✕
            </button>
          )}
          <button type="submit" className="search-bar__btn" aria-label="Search">
            Search
          </button>
        </div>
        {search && (
          <p className="search-bar__results">
            {total} {total === 1 ? 'letter' : 'letters'} found for &ldquo;{search}&rdquo;
          </p>
        )}
      </form>

      {/* Cards grid */}
      <div className="card-grid">
        {memories.map(memory => (
          <CardRenderer key={memory.id} memory={memory} />
        ))}
      </div>

      {/* Empty state */}
      {!initialLoad && memories.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 48, fontStyle: 'italic' }}>
          {search ? (
            <>No letters found for &ldquo;{search}&rdquo;. <button onClick={clearSearch} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', font: 'inherit' }}>Clear search</button></>
          ) : (
            <>No letters yet. Be the first to <Link href="/write">write one</Link>.</>
          )}
        </p>
      )}

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} style={{ height: 1 }} />

      {/* Loading indicator (Fix 5: subtle, premium) */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div className="loading-dots" aria-label="Loading more letters">
            <span /><span /><span />
          </div>
        </div>
      )}

      {/* End state */}
      {!hasMore && memories.length > 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px 0 20px' }}>
          <p style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontSize: '0.85rem' }}>
            You&apos;ve reached the end.
          </p>
        </div>
      )}
    </>
  );
}
