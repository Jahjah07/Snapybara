import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Snapybara Photobooth',
  description: 'Photobooth flow prototype for layout, camera, design, and downloads.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="app-shell min-h-full font-sans text-slate-900">
        <div className="app-background" aria-hidden="true" />
        <div className="relative z-10 flex min-h-full flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
