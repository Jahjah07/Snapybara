import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
          About
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Snapybara is a photobooth web app prototype for events and creative booths.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          This space can later explain your team, your product story, booth experience,
          and what makes your setup different. For now, it works as a clean placeholder
          while the rest of the product is still being designed.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            'Layout-first guest flow',
            'Camera to design pipeline',
            'Download-ready output packaging',
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700"
            >
              {item}
            </div>
          ))}
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
