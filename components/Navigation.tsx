'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/letters', label: 'Letters' },
  { href: '/write', label: 'Write' },
];

const MORE_LINKS = [
  { href: '/about', label: 'How It Works' },
  { href: '/journal', label: 'Journal' },
  { href: '/archive', label: 'Name Archive' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/cookies', label: 'Cookies' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeMoreLink = MORE_LINKS.find(link => pathname === link.href || pathname.startsWith(link.href + '/'));
  const dropdownLabel = activeMoreLink ? activeMoreLink.label : 'More';

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav__inner">
        <Link href="/" className="nav__logo">
          Honey, <span>If Only</span>
        </Link>

        <ul className="nav__links">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setDropdownOpen(false)}
                className={`nav__link ${pathname === link.href ? 'nav__link--active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <div className={`dropdown ${dropdownOpen ? 'dropdown--open' : ''}`} ref={dropdownRef}>
              <button
                className={`dropdown__trigger nav__link ${activeMoreLink ? 'nav__link--active' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {dropdownLabel}
                <span className="dropdown__chevron" aria-hidden="true" />
              </button>
              <div className="dropdown__menu">
                {MORE_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="dropdown__item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
