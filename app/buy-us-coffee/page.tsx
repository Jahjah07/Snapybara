import Link from 'next/link';

export default function BuyUsCoffeePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
          Buy us Coffee
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Support page placeholder
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          This page can later link to your donation page, tip jar, Ko-fi, or other
          support platform.
        </p>

        <div className="mt-8 rounded-[1.5rem] bg-slate-950 p-6 text-white">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-300">
            Future integration
          </p>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Add a real payment or support link here once your team is ready. For now,
            this page keeps the navigation complete and ready for content.
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
