import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">{SITE_NAME}</div>
        <ul className="footer__links">
          <li><Link href="/about" className="footer__link">How It Works</Link></li>
          <li><Link href="/letters" className="footer__link">Letters</Link></li>
          <li><Link href="/write" className="footer__link">Write a Letter</Link></li>
          <li><Link href="/journal" className="footer__link">Journal</Link></li>
          <li><Link href="/terms" className="footer__link">Terms</Link></li>
          <li><Link href="/privacy" className="footer__link">Privacy</Link></li>
          <li><Link href="/disclaimer" className="footer__link">Disclaimer</Link></li>
          <li><Link href="/contact" className="footer__link">Contact</Link></li>
        </ul>
        <p className="footer__copy">© {year} {SITE_NAME}. All letters belong to their authors.</p>
      </div>
    </footer>
  );
}
