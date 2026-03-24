import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how Snapybara handles camera access and why your photos stay on your device.',
};

export default function PrivacyPolicyPage() {
  const privacyPoints = [
    'Your photos are not uploaded to our servers.',
    'We do not collect personal information from your photobooth session.',
    'Camera permission is only used so you can take photos inside the app.',
  ];

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
          Privacy Policy
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Your privacy comes first.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Snapybara is designed to keep the photobooth experience personal. Your
          photos and camera activity stay on your device, so the moments you
          capture remain in your hands.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {privacyPoints.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-4 text-sm font-medium leading-6 text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-5 text-base leading-8 text-slate-600">
          <p>
            We do not collect, store, or share your photos or personal data.
            There are no hidden uploads, no background syncing, and no tracking
            tied to the images you take through the app.
          </p>
          <p>
            The app only requests camera access when you choose to use the
            camera experience. That permission is used solely to let you preview
            and capture photos inside Snapybara.
          </p>
          <p>
            Once a photo is taken, it stays with you as part of your local
            session and export flow. In short: your images are yours, and
            Snapybara is built to respect that.
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/dashboard"
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
