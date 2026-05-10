import Link from 'next/link';
import type { ReactNode } from 'react';

export type TrustHighlight = {
  label: string;
  value: string;
  detail?: string;
};

export type TrustSection = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

export type TrustLink = {
  href: string;
  label: string;
  description: string;
};

type TrustPageProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  updated?: string;
  highlights?: TrustHighlight[];
  sections: TrustSection[];
  relatedLinks?: TrustLink[];
};

export default function TrustPage({
  eyebrow,
  title,
  subtitle,
  updated,
  highlights = [],
  sections,
  relatedLinks = [],
}: TrustPageProps) {
  return (
    <div className="trust-page">
      <header className="trust-hero" aria-labelledby="trust-title">
        <div>
          <p className="trust-hero__eyebrow">{eyebrow}</p>
          <h1 id="trust-title" className="trust-hero__title">{title}</h1>
          <p className="trust-hero__subtitle">{subtitle}</p>
        </div>
        <div className="trust-hero__stamp" aria-label="Page status">
          <span>Trust center</span>
          <strong>{updated ? `Updated ${updated}` : 'Always available'}</strong>
          <p>Clear navigation, transparent policies, and moderated user-generated content.</p>
        </div>
      </header>

      <div className="trust-layout">
        {highlights.length > 0 && (
          <aside className="trust-sidebar" aria-label="Key page details">
            {highlights.map((highlight) => (
              <div key={highlight.label} className="trust-signal">
                <span className="trust-signal__label">{highlight.label}</span>
                <strong>{highlight.value}</strong>
                {highlight.detail && <p>{highlight.detail}</p>}
              </div>
            ))}
          </aside>
        )}

        <div className="trust-content">
          {sections.map((section, index) => (
            <section key={section.title} className="trust-section">
              <div className="trust-section__index">{String(index + 1).padStart(2, '0')}</div>
              <div>
                {section.eyebrow && <p className="trust-section__eyebrow">{section.eyebrow}</p>}
                <h2>{section.title}</h2>
                <div className="trust-section__body">{section.children}</div>
              </div>
            </section>
          ))}

          {relatedLinks.length > 0 && (
            <nav className="trust-related" aria-label="Related trust pages">
              {relatedLinks.map((relatedLink) => (
                <Link key={relatedLink.href} href={relatedLink.href} className="trust-related__link">
                  <span>{relatedLink.label}</span>
                  <p>{relatedLink.description}</p>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
