'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import VirtualizedCardGrid from '@/components/cards/VirtualizedCardGrid';
import type { Memory } from '@/lib/types';

const PAGE_SIZE = 10;

export default function NameArchive({
  nameSlug,
  displayName,
  initialTotal,
}: {
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

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

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
      } catch {
        // Session restore is a convenience, not a requirement.
      }

      setRestored(true);
    });

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

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
        setMemories(prev => {
          if (!append) return data.memories;
          const existingIds = new Set(prev.map(m => m.id));
          const newMemories = data.memories.filter((m: Memory) => !existingIds.has(m.id));
          return [...prev, ...newMemories];
        });
        setTotal(data.total);
      }
    } catch (e) {
      console.error('Failed to fetch:', e);
    }

    setLoading(false);
    setInitialLoad(false);
    fetchingRef.current = false;
  }, [displayName]);

  useEffect(() => {
    if (!restored) return;
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      try {
        const raw = sessionStorage.getItem(storageKey);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved?.memories?.length > 0) return;
        }
      } catch {
        // Non-fatal.
      }

      void fetchLetters(1, false);
    });

    return () => {
      cancelled = true;
    };
  }, [restored, storageKey, fetchLetters]);

  useEffect(() => {
    function handleBeforeNav() {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify({
          memories,
          page,
          total,
          scrollY: window.scrollY,
        }));
      } catch {
        // Non-fatal.
      }
    }

    window.addEventListener('beforeunload', handleBeforeNav);
    document.addEventListener('click', handleBeforeNav, { capture: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeNav);
      document.removeEventListener('click', handleBeforeNav, { capture: true });
    };
  }, [memories, page, total, storageKey]);

  useEffect(() => {
    if (!loaderRef.current || !restored) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !fetchingRef.current) {
          const nextPage = page + 1;
          setPage(nextPage);
          void fetchLetters(nextPage, true);
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, page, fetchLetters, restored]);

  return (
    <>
      <VirtualizedCardGrid memories={memories} />

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
