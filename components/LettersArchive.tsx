'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import CardRenderer from '@/components/cards/CardRenderer';
import Link from 'next/link';
import type { Memory } from '@/lib/types';

const PAGE_SIZE = 10;

export default function LettersArchive() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const hasMore = memories.length < total;

  const fetchLetters = useCallback(async (pageNum: number, searchQuery: string, append: boolean) => {
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
  }, []);

  // Initial load + search changes
  useEffect(() => {
    setPage(1);
    fetchLetters(1, search, false);
  }, [search, fetchLetters]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchLetters(nextPage, search, true);
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, page, search, fetchLetters]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput('');
    setSearch('');
  }

  return (
    <>
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

      {/* Loading indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <p style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.9rem' }}>
            Loading more letters...
          </p>
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
