'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LAYOUT_OPTIONS, getLayoutOption } from '@/lib/photobooth';
import { usePhotoboothStore } from '@/lib/store';

export default function Dashboard() {
  const router = useRouter();
  const { startSession, selectedLayout } = usePhotoboothStore();
  const [pendingLayout, setPendingLayout] = useState<
    (typeof LAYOUT_OPTIONS)[number]['id'] | null
  >(selectedLayout);

  const handleContinue = () => {
    if (!pendingLayout) {
      return;
    }

    startSession(pendingLayout);
    router.push('/camera');
  };

  const activeLayout = getLayoutOption(pendingLayout);

  return (
    <main className="min-h-screen px-6 py-10 pb-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="px-4 py-10 text-center md:px-12 md:py-16">
          <h1 className="font-fun text-outline-soft mx-auto mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            Welcome to Snapybara Photobooth
          </h1>
          <p className="mx-auto mt-5 max-w-2xl rounded-[1.5rem] bg-white/45 px-6 py-4 text-lg leading-8 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm">
            Choose your layout to begin. After that, you’ll move through camera capture,
            photo selection, design, and download.
          </p>
        </section>

        <section className="rounded-[2rem] bg-white/72 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
                Step 1
              </p>
              <h2 className="text-3xl font-semibold text-slate-950">Choose a layout</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Select a layout first. The continue button will appear once you’ve chosen
              one.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {LAYOUT_OPTIONS.map((layout) => (
              <button
                key={layout.id}
                onClick={() => setPendingLayout(layout.id)}
                className={`group rounded-[2rem] border p-6 text-left shadow-[0_16px_36px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(217,119,6,0.16)] ${
                  pendingLayout === layout.id
                    ? 'border-amber-400 bg-amber-50/90 ring-2 ring-amber-200'
                    : 'border-slate-200 bg-gradient-to-b from-white to-amber-50/50 hover:border-amber-300'
                }`}
              >
                <LayoutPreview layoutId={layout.id} />
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-slate-950">{layout.label}</h3>
                    {pendingLayout === layout.id ? (
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white">
                        Selected
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
                        {layout.slots} slots
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{layout.description}</p>
                  <p className="mt-4 text-sm font-medium text-amber-700">
                    Captures {layout.captureTarget} shots before selection
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {pendingLayout ? (
        <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center px-6">
          <button
            onClick={handleContinue}
            className="rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.28)] transition hover:bg-slate-800"
          >
            Continue with {activeLayout?.label}
          </button>
        </div>
      ) : null}
    </main>
  );
}

function LayoutPreview({
  layoutId,
}: {
  layoutId: (typeof LAYOUT_OPTIONS)[number]['id'];
}) {
  const layout = getLayoutOption(layoutId);

  if (!layout) {
    return null;
  }

  return (
    <div
      className="grid gap-2 rounded-[1.5rem] bg-slate-950 p-4"
      style={{
        gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
      }}
    >
      {layout.cells.map((cell, index) => (
        <div
          key={index}
          className="aspect-square rounded-xl bg-gradient-to-br from-amber-200 to-orange-300"
          style={{
            gridColumn: `${cell.col} / span ${cell.colSpan ?? 1}`,
            gridRow: `${cell.row} / span ${cell.rowSpan ?? 1}`,
            aspectRatio: `${cell.colSpan ?? 1} / ${cell.rowSpan ?? 1}`,
          }}
        />
      ))}
    </div>
  );
}
