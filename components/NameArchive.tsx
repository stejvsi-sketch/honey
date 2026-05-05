'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import CardRenderer from '@/components/cards/CardRenderer';
import Link from 'next/link';
import type { Memory } from '@/lib/types';

const PAGE_SIZE = 10;

export default function NameArchive({ nameSlug, displayName, initialTotal }: {
  nameSlug: string;
  displayName: string;
  initialTotal: number;
}) {
  const storageKey = `hio:name:${nameSlug}`;
  const [memories, setMemories] = useState<Memory[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [restored, setRestored] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);

  const hasMore = memories.length < total;

  // Restore state from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.memories?.length > 0) {
          setMemories(saved.memories);
          setPage(saved.page);
          setTotal(saved.total);
          setInitialLoad(false);
          setRestored(true);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              window.scrollTo(0, saved.scrollY || 0);
            });
          });
          return;
        }
      }
    } catch { /* non-fatal */ }
    setRestored(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLetters = useCallback(async (pageNum: number, append: boolean) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: PAGE_SIZE.toString(),
        search: displayName,
      });
      const res = await fetch(`/api/letters?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMemories(prev => append ? [...prev, ...data.memories] : data.memories);
        setTotal(data.total);
      }
    } catch (e) {
      console.error('Failed to fetch:', e);
    }
    setLoading(false);
    setInitialLoad(false);
    fetchingRef.current = false;
  }, [displayName]);

  // Initial fetch — skip if restored
  useEffect(() => {
    if (!restored) return;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.memories?.length > 0) return;
      }
    } catch { /* non-fatal */ }
    fetchLetters(1, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restored]);

  // Save state before navigating away
  useEffect(() => {
    function handleBeforeNav() {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify({
          memories, page, total, scrollY: window.scrollY,
        }));
      } catch { /* non-fatal */ }
    }
    window.addEventListener('beforeunload', handleBeforeNav);
    document.addEventListener('click', handleBeforeNav, { capture: true });
    return () => {
      window.removeEventListener('beforeunload', handleBeforeNav);
      document.removeEventListener('click', handleBeforeNav, { capture: true });
    };
  }, [memories, page, total, storageKey]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current || !restored) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !fetchingRef.current) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchLetters(nextPage, true);
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, page, fetchLetters, restored]);

  return (
    <>
      <div className="card-grid">
        {memories.map(memory => (
          <CardRenderer key={memory.id} memory={memory} />
        ))}
      </div>

      {!initialLoad && memories.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 48, fontStyle: 'italic' }}>
          No letters to {displayName} yet. <Link href="/write">Write the first one</Link>.
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
