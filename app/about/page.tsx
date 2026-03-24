import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn what Snapybara offers, how to use it, and what makes the photobooth experience flexible across devices.',
};

export default function AboutPage() {
  const highlights = [
    'Browser-based photobooth with no installation required',
    'Custom layouts, colors, stickers, captions, and themes',
    'High-resolution photo strips saved straight to your device',
  ];

  const faqs = [
    {
      question: 'How do I use this site?',
      answer:
        'Choose your preferred layout, allow camera access, and pose for each shot. After capturing your photos, pick your favorites for the strip, then customize the final design with colors, stickers, captions, dates, and themes before downloading.',
    },
    {
      question: 'Can I use this on mobile?',
      answer:
        'Yes. Snapybara is designed to work on mobile devices in both portrait and landscape mode, so you can create photo strips wherever you are.',
    },
    {
      question: 'Can I customize the photobooth strip?',
      answer:
        'Absolutely. You can change border colors, use custom color choices, add playful stickers, include a date, and update the caption so each strip feels personal.',
    },
    {
      question: 'Can I choose my preferred layout?',
      answer:
        'Yes. You can select from different photo layouts to match the style you want, whether you prefer something classic, playful, or more compact.',
    },
    {
      question: 'Why is the screen black even after allowing camera access?',
      answer:
        'This usually means camera permissions are still blocked by your device or browser settings. On Windows, check Settings > Privacy & Security > Camera, then make sure both app and desktop camera access are enabled.',
    },
    {
      question: 'Do you store my photos or data?',
      answer:
        'No. Your photos stay on your device and are not uploaded or stored by Snapybara, so you stay in control of your images from capture to download.',
    },
  ];

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
          About
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          A playful online photobooth you can use anytime, right in your browser.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Snapybara makes it easy to take photobooth-style photos without
          downloads, accounts, or setup headaches. Capture images instantly,
          build your strip with the layout you like, customize it with colors,
          stickers, captions, and themes, then save a high-resolution version
          directly to your device.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-4 text-sm font-medium leading-6 text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">FAQ</h2>
          <div className="mt-5 space-y-4">
            {faqs.map((item) => (
              <section
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-5"
              >
                <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
              </section>
            ))}
          </div>
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
