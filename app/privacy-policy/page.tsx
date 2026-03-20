import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
          Privacy Policy
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Placeholder privacy policy page
        </h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
          <p>
            This page is ready for your actual privacy policy. Later, you can describe
            how captured photos are stored, how long they are kept, whether they are
            shared, and how guests can request deletion.
          </p>
          <p>
            Since this app works with camera input and downloadable images, it is a good
            place to document consent, device usage, and data retention clearly.
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
