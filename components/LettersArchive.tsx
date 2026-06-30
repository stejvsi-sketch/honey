'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import VirtualizedCardGrid from '@/components/cards/VirtualizedCardGrid';
import CardRenderer from '@/components/cards/CardRenderer';
import { AdResponsiveBanner } from '@/components/ads/AdBanner';
import AdBanner from '@/components/ads/AdBanner';
import type { Memory } from '@/lib/types';

function deduplicateMemories(memories: Memory[]): Memory[] {
  const seen = new Set<string>();
  return memories.filter(m => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

const PAGE_SIZE = 10;
const STORAGE_KEY = 'hio:letters';
const IN_FEED_AD_AFTER = 9; // Show in-feed ad after this many cards

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
  } catch {
    // Storage quota errors are non-fatal.
  }
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

export default function LettersArchive({
  initialMemories,
  initialTotal,
}: {
  initialMemories?: Memory[];
  initialTotal?: number;
}) {
  const [memories, setMemories] = useState<Memory[]>(() => deduplicateMemories(initialMemories || []));
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

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      // A ?search= URL parameter (e.g. from the sitelinks search box) takes
      // priority over any previously saved scroll/restore state.
      const urlSearch = (new URLSearchParams(window.location.search).get('search') || '').trim();
      if (urlSearch) {
        setSearch(urlSearch);
        setSearchInput(urlSearch);
        setRestored(true);
        return;
      }

      const saved = loadState();
      if (saved && saved.memories.length > 0) {
        setMemories(deduplicateMemories(saved.memories));
        setPage(saved.page);
        setTotal(saved.total);
        setSearch(saved.search);
        setSearchInput(saved.search);
        setInitialLoad(false);
        setRestored(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, saved.scrollY);
          });
        });
      } else {
        setRestored(true);
      }
    });

    return () => {
      cancelled = true;
    };
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
        setMemories(prev => {
          if (!append) return deduplicateMemories(data.memories);
          const existingIds = new Set(prev.map(m => m.id));
          const newMemories = data.memories.filter((m: Memory) => !existingIds.has(m.id));
          return [...prev, ...newMemories];
        });
        setTotal(data.total);
      }
    } catch (e) {
      console.error('Failed to fetch letters:', e);
    }

    setLoading(false);
    setInitialLoad(false);
    fetchingRef.current = false;
  }, []);

  useEffect(() => {
    if (!restored) return;
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const saved = loadState();
      if (saved && saved.memories.length > 0 && !search) {
        return;
      }

      setPage(1);
      void fetchLetters(1, search, false);
    });

    return () => {
      cancelled = true;
    };
  }, [search, restored, fetchLetters]);

  useEffect(() => {
    function handleBeforeNav() {
      saveState({ memories, page, total, search, scrollY: window.scrollY });
    }

    window.addEventListener('beforeunload', handleBeforeNav);
    document.addEventListener('click', handleBeforeNav, { capture: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeNav);
      document.removeEventListener('click', handleBeforeNav, { capture: true });
    };
  }, [memories, page, total, search]);

  useEffect(() => {
    if (!loaderRef.current || !restored) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !fetchingRef.current) {
          const nextPage = page + 1;
          setPage(nextPage);
          void fetchLetters(nextPage, search, true);
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
              &times;
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

      <AdResponsiveBanner />

      {/* First batch of cards (plain grid — always visible, no virtualization needed) */}
      {memories.length > 0 && (
        <div className="card-grid">
          {memories.slice(0, IN_FEED_AD_AFTER).map(memory => (
            <CardRenderer key={memory.id} memory={memory} animate={true} />
          ))}
        </div>
      )}

      {/* In-feed ad after first batch */}
      {memories.length > IN_FEED_AD_AFTER && (
        <AdBanner variant="rectangle" />
      )}

      {/* Remaining cards (virtualized for performance) */}
      {memories.length > IN_FEED_AD_AFTER && (
        <VirtualizedCardGrid memories={memories.slice(IN_FEED_AD_AFTER)} />
      )}

      {!initialLoad && memories.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 48, fontStyle: 'italic' }}>
          {search ? (
            <>
              No letters found for &ldquo;{search}&rdquo;.
              {' '}
              <button
                onClick={clearSearch}
                style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', font: 'inherit' }}
              >
                Clear search
              </button>
            </>
          ) : (
            <>No letters yet. Be the first to <Link href="/write">write one</Link>.</>
          )}
        </p>
      )}

      <div ref={loaderRef} style={{ height: 1 }} />

      {loading && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div className="loading-dots" aria-label="Loading more letters">
            <span /><span /><span />
          </div>
        </div>
      )}

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
