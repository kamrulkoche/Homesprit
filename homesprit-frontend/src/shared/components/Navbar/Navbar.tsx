'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/helpers/utils/utils';
import { Logo } from '../Logo';
import { ThemeToggle } from '../ThemeToggle';

/**
 * Public site navigation.
 *
 * `/admin` is deliberately NOT in this list — the hgs-frontend rule. Staff
 * reach the dashboard from the footer's "Agent sign in".
 */
const NAV_LINKS = [
  { href: '/properties?listing_type=sale', label: 'Buy' },
  { href: '/properties?listing_type=rent', label: 'Rent' },
  { href: '/properties', label: 'All homes' },
  { href: '/contact', label: 'Contact' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    const path = href.split('?')[0];
    return path === '/' ? pathname === '/' : pathname.startsWith(path) && href === path;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-sand/85 backdrop-blur-md dark:border-white/[0.06] dark:bg-ink/85">
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold text-ink-body transition-colors hover:bg-ink/5 dark:text-slate-300 dark:hover:bg-white/10',
                  isActive(link.href) && 'bg-ink/5 text-ink dark:bg-white/10 dark:text-white'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link href="/properties" className="btn-primary hidden sm:inline-flex">
            Find a home
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ink/5 dark:text-white dark:hover:bg-white/10 md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <ul id="mobile-nav" className="container-page space-y-1 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                // Closing on the click that navigates, not in a pathname
                // effect — hgs-frontend's AdminShell does the same.
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 font-semibold text-ink hover:bg-ink/5 dark:text-white dark:hover:bg-white/10"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
