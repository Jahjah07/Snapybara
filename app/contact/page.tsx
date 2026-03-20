import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Contact page placeholder
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          You can replace this with your real contact details, inquiry form, or booking
          workflow for events and activations.
        </p>

        <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-semibold text-slate-950">Suggested content</p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            <p>Email: `hello@yourbrand.com`</p>
            <p>Instagram or Facebook links</p>
            <p>Event inquiry form or booth booking details</p>
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
