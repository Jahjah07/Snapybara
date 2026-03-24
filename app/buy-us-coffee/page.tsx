import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Us',
  description:
    'Support Snapybara and help us keep building fun, flexible photobooth experiences on the web.',
};

export default function BuyUsCoffeePage() {
  const supportReasons = [
    'Help us improve layouts, design tools, and export quality',
    'Support bug fixes, mobile polish, and new photobooth features',
    'Keep Snapybara fun, lightweight, and easy to use in the browser',
  ];

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
          Buy us Coffee
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Support the people behind Snapybara.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          If Snapybara made your photobooth moments a little more fun, a little
          easier, or a little more creative, supporting the project helps us
          keep building and improving the experience.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {supportReasons.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-4 text-sm font-medium leading-6 text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              What your support helps with
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                Donations help us continue refining the app, adding new creative
                tools, and making the photobooth flow smoother across devices.
              </p>
              <p>
                It also gives us room to keep improving little details that make
                Snapybara more fun to use, from better customization to a more
                polished download experience.
              </p>
            </div>
          </section>

          <section className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300">
              Support link
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Add your real donation link here later, like Ko-fi, Buy Me a
              Coffee, or another support page.
            </p>
            <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-sm text-slate-200">
              Example: `https://ko-fi.com/yourname`
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
