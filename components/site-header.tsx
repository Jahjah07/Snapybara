'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'About', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Contact', href: '/contact' },
  { label: 'Buy us Ko-fi', href: '/buy-us-coffee' },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 overflow-visible border-b border-black/60 bg-[#e6ccb3] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-1 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-visible">
          <div className="relative h-16 w-16 flex-none overflow-visible sm:h-20 sm:w-20 lg:h-24 lg:w-24">
            <Image
              src="/Capy_Logo.png"
              alt="Snapybara logo"
              fill
              priority
              sizes="96px"
              className="translate-y-1 object-contain drop-shadow-[0_20px_24px_rgba(15,23,42,0.25)] sm:translate-y-3"
            />
          </div>
          <div>
            <p className="font-fun text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              Snapybara
            </p>
            <p className="font-fun text-xs tracking-[0.14em] text-slate-600 sm:text-sm sm:tracking-[0.18em]">
              Photobooth
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white/40 text-slate-900 transition hover:bg-white/60 lg:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="font-fun flex flex-wrap items-center justify-end gap-2 text-base font-medium text-slate-700">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="rounded-full px-4 py-2 text-center transition hover:bg-amber-100 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {menuOpen ? (
        <nav aria-label="Mobile primary" className="border-t border-black/10 px-4 pb-4 lg:hidden">
          <ul className="font-fun flex flex-col gap-2 pt-3 text-base font-medium text-slate-800">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl bg-white/40 px-4 py-3 transition hover:bg-white/60"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
