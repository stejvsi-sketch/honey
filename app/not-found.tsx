import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page page--narrow" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: 12, color: 'var(--text-light)' }}>
        404
      </h1>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: 8, fontStyle: 'italic' }}>
        This letter was never written.
      </p>
      <p style={{ color: 'var(--text-light)', marginBottom: 32 }}>
        Maybe it&apos;s one of those things that was better left unsaid.
      </p>
      <Link href="/" className="btn" style={{ width: 'auto', display: 'inline-flex' }}>
        Go Home
      </Link>
    </div>
  );
}
