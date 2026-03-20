import type { Metadata, Viewport } from 'next';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

export const metadata: Metadata = {
  applicationName: 'Snapybara Photobooth',
  title: {
    default: 'Snapybara Photobooth',
    template: '%s | Snapybara Photobooth',
  },
  description:
    'A playful photobooth web app with layout selection, live camera capture, photo curation, design customization, and downloadable exports.',
  keywords: [
    'photobooth',
    'snapybara',
    'camera app',
    'event photos',
    'photo layout',
  ],
  icons: {
    icon: '/Capy_Logo.png',
    shortcut: '/Capy_Logo.png',
    apple: '/Capy_Logo.png',
  },
  openGraph: {
    title: 'Snapybara Photobooth',
    description:
      'Capture, curate, design, and download your photobooth sessions in one playful flow.',
    images: ['/Capy_Logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Snapybara Photobooth',
    description:
      'Capture, curate, design, and download your photobooth sessions in one playful flow.',
    images: ['/Capy_Logo.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#e6ccb3',
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
