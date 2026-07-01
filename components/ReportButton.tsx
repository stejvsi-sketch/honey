'use client';

import { useCallback } from 'react';

/**
 * Renders a "Report this letter" / "Request removal" link on letter pages.
 * Opens the contact page with the letter URL pre-filled as a query parameter.
 */
export default function ReportButton({ letterUrl }: { letterUrl: string }) {
  const handleClick = useCallback(() => {
    const contactUrl = `/contact?subject=${encodeURIComponent('Letter Report / Removal Request')}&ref=${encodeURIComponent(letterUrl)}`;
    window.location.href = contactUrl;
  }, [letterUrl]);

  return (
    <button
      onClick={handleClick}
      className="report-btn"
      style={{
        background: 'none',
        border: 'none',
        padding: '8px 0',
        fontSize: '0.8rem',
        color: 'var(--text-light)',
        cursor: 'pointer',
        textDecoration: 'underline',
        textUnderlineOffset: '2px',
        textDecorationColor: 'var(--border-light)',
        opacity: 0.7,
        transition: 'opacity 0.2s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
      aria-label="Report this letter or request removal"
    >
      Report this letter · Request removal
    </button>
  );
}
