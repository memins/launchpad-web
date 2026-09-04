'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { KIT_NAME, KIT_PRICE } from '@/lib/site';
import ThemeToggle from '@/components/marketing/ThemeToggle';

const NAV_LINKS = [
  { href: '#included', label: 'What’s included' },
  { href: '#audience', label: 'Who it’s for' },
  { href: '#stack', label: 'Stack' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
] as const;

interface MarketingHeaderProps {
  gumroadUrl: string;
  headerExtra?: ReactNode;
}

const MarketingHeader = ({ gumroadUrl, headerExtra }: MarketingHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {KIT_NAME}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Marketing">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {headerExtra}
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="hidden rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-muted sm:inline-flex"
          >
            Demo login
          </Link>
          <a
            href={gumroadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Buy · {KIT_PRICE}
          </a>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            aria-expanded={isOpen}
            aria-controls="marketing-mobile-nav"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="marketing-mobile-nav"
          className="border-t border-border bg-background px-4 py-3 lg:hidden"
          aria-label="Marketing mobile"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleClose}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/auth/login"
              onClick={handleClose}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground sm:hidden"
            >
              Demo login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default MarketingHeader;
