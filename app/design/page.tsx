'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FinalLayoutPreview } from '@/components/final-layout-preview';
import {
  STICKER_OPTIONS,
  THEME_PRESETS,
  getLayoutOption,
  getThemePreset,
} from '@/lib/photobooth';
import { usePhotoboothStore } from '@/lib/store';

export default function DesignPage() {
  const router = useRouter();
  const {
    selectedLayout,
    capturedPhotos,
    selectedPhotoIds,
    design,
    setTheme,
    setBackgroundColor,
    toggleSticker,
    setSessionStage,
  } = usePhotoboothStore();
  const layout = getLayoutOption(selectedLayout);

  const selectedPhotos = useMemo(
    () => capturedPhotos.filter((photo) => selectedPhotoIds.includes(photo.id)),
    [capturedPhotos, selectedPhotoIds]
  );

  useEffect(() => {
    if (!layout || selectedPhotos.length !== layout.slots) {
      router.replace('/selection');
      return;
    }

    setSessionStage('design');
  }, [layout, router, selectedPhotos.length, setSessionStage]);

  if (!layout) {
    return null;
  }

  const currentTheme = getThemePreset(design.themeId);

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
            Step 4
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950">Design the final layout</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Your team can replace these placeholders later with polished assets, but the
            state and flow for themes, colors, and stickers are ready now.
          </p>

          <div className="mt-8">
            <FinalLayoutPreview layoutId={layout.id} photos={selectedPhotos} design={design} />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-white/85 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-950">Themes</h2>
            <div className="mt-4 space-y-3">
              {THEME_PRESETS.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    if (theme.id !== 'custom') {
                      setBackgroundColor(theme.backgroundColor);
                    }
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                    design.themeId === theme.id
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-950">{theme.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{theme.backgroundColor}</p>
                  </div>
                  <span
                    className="h-10 w-10 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.backgroundColor }}
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white/85 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-950">Background color</h2>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="color"
                value={design.backgroundColor}
                onChange={(event) => {
                  setTheme('custom');
                  setBackgroundColor(event.target.value);
                }}
                className="h-14 w-16 cursor-pointer rounded-xl border border-slate-200"
              />
              <input
                value={design.backgroundColor}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  if (/^#[0-9A-Fa-f]{6}$/.test(nextValue)) {
                    setTheme('custom');
                    setBackgroundColor(nextValue);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm text-slate-700"
              />
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Current theme accent:{' '}
              <span style={{ color: currentTheme.accentColor }}>{currentTheme.label}</span>
            </p>
          </section>

          <section className="rounded-[2rem] bg-white/85 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-950">Stickers</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {STICKER_OPTIONS.map((sticker) => {
                const selected = design.elements.some((element) => element.value === sticker);

                return (
                  <button
                    key={sticker}
                    onClick={() => toggleSticker(sticker)}
                    className={`rounded-2xl border px-4 py-4 text-3xl transition ${
                      selected
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {sticker}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/selection')}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to selection
            </button>
            <button
              onClick={() => router.push('/download')}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Continue to download
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
