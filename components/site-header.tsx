import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'About', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Contact', href: '/contact' },
  { label: 'Buy us Ko-fi', href: '/buy-us-coffee' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 overflow-visible border-b border-black/60 bg-[#e6ccb3] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/dashboard" className="flex items-center gap-4 overflow-visible">
          <div className="relative h-24 w-24 flex-none overflow-visible">
            <Image
              src="/Capy_Logo.png"
              alt="Snapybara logo"
              fill
              priority
              sizes="96px"
              className="translate-y-2 object-contain drop-shadow-[0_20px_24px_rgba(15,23,42,0.25)]"
            />
          </div>
          <div>
            <p className="font-fun text-2xl font-semibold tracking-tight text-slate-950">
              Snapybara
            </p>
            <p className="font-fun text-sm tracking-[0.18em] text-slate-600">
              Photobooth
            </p>
          </div>
        </Link>

        <nav aria-label="Primary">
          <ul className="font-fun flex flex-wrap items-center justify-end gap-2 text-base font-medium text-slate-700">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="rounded-full px-4 py-2 transition hover:bg-amber-100 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
