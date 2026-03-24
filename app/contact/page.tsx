import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Snapybara for support, feedback, feature suggestions, or event inquiries.',
};

export default function ContactPage() {
  const contactMethods = [
    { label: 'Email', value: 'hello@snapybara.com' },
    { label: 'Instagram', value: '@snapybara' },
    { label: 'Facebook', value: 'Snapybara Photobooth' },
  ];

  const reasonsToReachOut = [
    'Technical issues or bugs',
    'Camera and permission problems',
    'Questions about layouts, stickers, or customization',
    'Feedback and feature suggestions',
    'Event, booth, or collaboration inquiries',
  ];

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Let&apos;s stay in touch.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Whether you need help with camera access, downloading your photo
          strip, customizing your design, or just want to share feedback,
          Snapybara is always open to hearing from you.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {contactMethods.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.3fr_0.9fr]">
          <section className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              What you can contact us about
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              {reasonsToReachOut.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Good to know
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                We usually reply within 1 to 3 business days.
              </p>
              <p>
                If you&apos;re reporting a problem, you can describe what happened
                without sending personal photos.
              </p>
              <p>
                Snapybara is built to keep your images on your device, so your
                privacy stays protected while we help.
              </p>
            </div>
          </section>
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
