'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { UNSENT_MEMORIES, UnsentMemory } from '@/lib/unsent-data';

interface UnsentArchiveProps {
  memories: UnsentMemory[];
  currentPage: number;
  totalPages: number;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function MemoryCard({ memory }: { memory: UnsentMemory }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = memory.message.length > 150;
  const preview = isLong && !expanded
    ? memory.message.slice(0, 150).trimEnd() + '…'
    : memory.message;

  return (
    <article className="unsent-card" id={`memory-${memory.id}`}>
      <div className="unsent-card__inner">
        <div className="unsent-card__meta-row">
          <div className="unsent-card__names">
            <span className="unsent-card__to">
              <span className="unsent-card__label">To</span>
              <strong>{memory.to || 'Someone'}</strong>
            </span>
            {memory.from && (
              <span className="unsent-card__from">
                <span className="unsent-card__label">From</span>
                <em>{memory.from}</em>
              </span>
            )}
          </div>
          <time className="unsent-card__date" dateTime={memory.created_at}>
            {formatDate(memory.created_at)}
          </time>
        </div>
        <div className="unsent-card__body">
          <p className="unsent-card__message">
            {preview.split('\n').map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
          {isLong && (
            <button
              className="unsent-card__toggle"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              {expanded ? '← Show less' : 'Read more →'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function PaginationControls({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const getHref = (page: number) => page === 1 ? '/unsent' : `/unsent/${page}`;

  return (
    <nav className="pagination" aria-label="Unsent archive pagination">
      {currentPage > 1 && (
        <Link href={getHref(currentPage - 1)} className="pagination__btn" rel="prev">
          ← Prev
        </Link>
      )}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="pagination__ellipsis">…</span>
        ) : (
          <Link
            key={page}
            href={getHref(page)}
            className={`pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}`}
            {...(page === currentPage ? { 'aria-current': 'page' as const } : {})}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={getHref(currentPage + 1)} className="pagination__btn" rel="next">
          Next →
        </Link>
      )}
    </nav>
  );
}

const SEARCH_PAGE_SIZE = 30;

function SearchBar({ onSearch, query }: { onSearch: (q: string) => void; query: string }) {
  const [value, setValue] = useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form className="unsent-search" onSubmit={handleSubmit} role="search">
      <div className="unsent-search__inner">
        <input
          type="text"
          className="unsent-search__input"
          placeholder="Search by name or keyword…"
          value={value}
          onChange={e => setValue(e.target.value)}
          aria-label="Search unsent messages"
        />
        {value && (
          <button type="button" className="unsent-search__clear" onClick={handleClear} aria-label="Clear search">
            ✕
          </button>
        )}
        <button type="submit" className="unsent-search__btn">
          Search
        </button>
      </div>
    </form>
  );
}

export default function UnsentArchive({ memories, currentPage, totalPages }: UnsentArchiveProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPage, setSearchPage] = useState(1);

  // Search across ALL 1,486 memories, not just the current page
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return UNSENT_MEMORIES.filter(
      m =>
        m.to.toLowerCase().includes(q) ||
        m.from.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const isSearching = searchQuery.length > 0;

  // Paginate search results client-side
  const searchTotalPages = Math.ceil(searchResults.length / SEARCH_PAGE_SIZE);
  const visibleSearchResults = isSearching
    ? searchResults.slice((searchPage - 1) * SEARCH_PAGE_SIZE, searchPage * SEARCH_PAGE_SIZE)
    : [];

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setSearchPage(1);
  };

  return (
    <section className="unsent-archive">
      {/* Merge banner */}
      <div className="unsent-merge-banner">
        <div className="unsent-merge-banner__icon">⟶</div>
        <p>
          <strong>If Only I Sent This</strong> has been merged into <strong>Honey, If Only</strong>.
          All 1,486 messages from the original archive are preserved here.
        </p>
      </div>

      <div className="unsent-archive__header">
        <div className="unsent-archive__badge">From the vault</div>
        <h1 className="unsent-archive__title">The Unsent Archive <span className="unsent-archive__formerly">Formerly If Only I Sent This</span></h1>
        <p className="unsent-archive__subtitle">
          1,486 unsent messages from a merged archive — raw, unfiltered, and preserved.
          These are the longer confessions that didn&apos;t fit into 25 words.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} query={searchQuery} />

      {!isSearching && (
        <>
          <div className="unsent-archive__stats">
            <span className="unsent-archive__stat">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <span className="unsent-archive__stat unsent-archive__stat--muted">
              Showing {(currentPage - 1) * 30 + 1}–{Math.min(currentPage * 30, 1486)} of 1,486
            </span>
          </div>

          <div className="unsent-archive__list">
            {memories.map(memory => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>

          <PaginationControls currentPage={currentPage} totalPages={totalPages} />
        </>
      )}

      {isSearching && (
        <>
          <div className="unsent-archive__stats">
            <span className="unsent-archive__stat">
              Found <strong>{searchResults.length}</strong> {searchResults.length === 1 ? 'result' : 'results'} for &ldquo;{searchQuery}&rdquo;
              {searchResults.length > SEARCH_PAGE_SIZE && (
                <> — page {searchPage} of {searchTotalPages}</>
              )}
            </span>
          </div>

          <div className="unsent-archive__list">
            {visibleSearchResults.length === 0 ? (
              <div className="unsent-archive__empty">
                <p>No messages found matching &ldquo;{searchQuery}&rdquo;</p>
                <button className="unsent-card__toggle" onClick={() => handleSearch('')}>
                  Clear search
                </button>
              </div>
            ) : (
              visibleSearchResults.map(memory => (
                <MemoryCard key={memory.id} memory={memory} />
              ))
            )}
          </div>

          {searchResults.length > SEARCH_PAGE_SIZE && (
            <div className="pagination">
              {searchPage > 1 && (
                <button className="pagination__btn" onClick={() => setSearchPage(p => p - 1)}>
                  ← Prev
                </button>
              )}
              {Array.from({ length: Math.min(searchTotalPages, 7) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    className={`pagination__btn ${page === searchPage ? 'pagination__btn--active' : ''}`}
                    onClick={() => setSearchPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
              {searchTotalPages > 7 && searchPage < searchTotalPages && (
                <span className="pagination__ellipsis">…</span>
              )}
              {searchPage < searchTotalPages && (
                <button className="pagination__btn" onClick={() => setSearchPage(p => p + 1)}>
                  Next →
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Internal linking section */}
      <div className="unsent-archive__links">
        <h2 className="unsent-archive__links-title">Explore More</h2>
        <div className="unsent-archive__links-grid">
          <Link href="/letters" className="unsent-archive__link-card">
            <span>Letters</span>
            <p>Browse our main collection of unsent letters, each distilled into 25 words.</p>
          </Link>
          <Link href="/write" className="unsent-archive__link-card">
            <span>Write a Letter</span>
            <p>Have something unsaid? Write your own anonymous letter in 25 words or fewer.</p>
          </Link>
          <Link href="/journal" className="unsent-archive__link-card">
            <span>Journal</span>
            <p>Stories, reflections, and essays exploring the things we leave unsaid.</p>
          </Link>
          <Link href="/stories" className="unsent-archive__link-card">
            <span>Stories</span>
            <p>Fictional narratives inspired by the real unsent letters in our archive.</p>
          </Link>
          <Link href="/archive" className="unsent-archive__link-card">
            <span>Name Archive</span>
            <p>Find letters by recipient name — see who&apos;s been written to the most.</p>
          </Link>
          <Link href="/" className="unsent-archive__link-card">
            <span>Home</span>
            <p>Return to Honey, If Only — where every unsent word finds a place.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
