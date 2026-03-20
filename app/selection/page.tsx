'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLayoutOption } from '@/lib/photobooth';
import { usePhotoboothStore } from '@/lib/store';

export default function SelectionPage() {
  const router = useRouter();
  const {
    selectedLayout,
    capturedPhotos,
    selectedPhotoIds,
    setSelectedPhotoIds,
    beginPhotoRetake,
    clearRetake,
    removePhotoById,
    setSessionStage,
  } = usePhotoboothStore();
  const layout = getLayoutOption(selectedLayout);
  const defaultSelectionIds = useMemo(
    () =>
      selectedPhotoIds.length > 0
        ? [
            ...selectedPhotoIds,
            ...Array.from({
              length: Math.max((layout?.slots ?? 0) - selectedPhotoIds.length, 0),
            }).map(() => null),
          ]
        : [
            ...capturedPhotos
              .filter((photo) => !photo.isDeleted)
              .slice(0, layout?.slots ?? 0)
              .map((photo) => photo.id),
            ...Array.from({
              length: Math.max(
                (layout?.slots ?? 0) -
                  capturedPhotos.filter((photo) => !photo.isDeleted).slice(
                    0,
                    layout?.slots ?? 0
                  ).length,
                0
              ),
            }).map(() => null),
          ],
    [capturedPhotos, layout?.slots, selectedPhotoIds]
  );
  const [orderedSelectionIds, setOrderedSelectionIds] =
    useState<Array<string | null>>(defaultSelectionIds);

  useEffect(() => {
    if (!layout || capturedPhotos.length < layout.slots) {
      router.replace('/camera');
      return;
    }

    setSessionStage('selection');
    clearRetake();
  }, [capturedPhotos.length, clearRetake, layout, router, setSessionStage]);

  useEffect(() => {
    setOrderedSelectionIds(defaultSelectionIds);
  }, [defaultSelectionIds]);

  const orderedPhotos = useMemo(
    () =>
      capturedPhotos.map((photo, index) => ({
        ...photo,
        shotLabel: `Shot ${index + 1}`,
      })),
    [capturedPhotos]
  );

  const selectedPhotosBySlot = useMemo(
    () =>
      orderedSelectionIds.map((photoId) =>
        capturedPhotos.find((photo) => photo.id === photoId && !photo.isDeleted)
      ),
    [capturedPhotos, orderedSelectionIds]
  );

  if (!layout) {
    return null;
  }

  const filledSelectionCount = orderedSelectionIds.filter(Boolean).length;

  const togglePhoto = (photoId: string) => {
    setOrderedSelectionIds((current) => {
      const existingIndex = current.indexOf(photoId);

      if (existingIndex >= 0) {
        return current.map((id, index) => (index === existingIndex ? null : id));
      }

      const nextOpenIndex = current.findIndex((id) => id === null);

      if (nextOpenIndex === -1) {
        return current;
      }

      return current.map((id, index) => (index === nextOpenIndex ? photoId : id));
    });
  };

  const continueToDesign = () => {
    if (orderedSelectionIds.some((selectionId) => selectionId === null)) {
      return;
    }

    setSelectedPhotoIds(
      orderedSelectionIds.filter(
        (selectionId): selectionId is string => selectionId !== null
      )
    );
    router.push('/design');
  };

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-7xl rounded-[2rem] bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
              Step 3
            </p>
            <h1 className="text-4xl font-semibold text-slate-950">Pick the final photos</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            The layout preview is on the left, so each selected photo fills a visible
            position in order.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-slate-950 px-4 py-2 text-white">
            {filledSelectionCount} / {layout.slots} selected
          </span>
          <span className="rounded-full bg-amber-100 px-4 py-2 text-amber-900">
            {capturedPhotos.length} shots available
          </span>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-slate-50/80 p-6">
            <div className="mb-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
                Layout Preview
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Slot 1 is filled first, then Slot 2, and so on.
              </p>
            </div>

            <div
              className="grid gap-3 rounded-[1.75rem] bg-slate-950 p-4"
              style={{
                gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
              }}
            >
              {layout.cells.map((cell, index) => {
                const photo = selectedPhotosBySlot[index];

                return (
                  <div
                    key={`${cell.col}-${cell.row}-${index}`}
                    className="relative overflow-hidden rounded-[1.25rem] bg-white/15"
                    style={{
                      gridColumn: `${cell.col} / span ${cell.colSpan ?? 1}`,
                      gridRow: `${cell.row} / span ${cell.rowSpan ?? 1}`,
                      aspectRatio: `${cell.colSpan ?? 1} / ${cell.rowSpan ?? 1}`,
                    }}
                  >
                    {photo ? (
                      <>
                        <Image
                          src={photo.dataUrl}
                          alt={`Selected slot ${index + 1}`}
                          fill
                          unoptimized
                          sizes="(min-width: 1280px) 35vw, 100vw"
                          className="object-cover"
                        />
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          router.push('/camera');
                        }}
                        className="flex h-full min-h-28 w-full cursor-default flex-col items-center justify-center gap-2 bg-white/8 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/70"
                      >
                        <span className="text-3xl">📷</span>
                        <span>Empty slot</span>
                      </button>
                    )}

                    <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                      Slot {index + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
                Captured Photos
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Click a photo to place it in the next open slot. Click again to remove it.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {orderedPhotos.map((photo) => {
                const selectedIndex = orderedSelectionIds.indexOf(photo.id);
                const selected = selectedIndex >= 0 && !photo.isDeleted;

                return (
                  <button
                    key={photo.id}
                    onClick={() => {
                      if (photo.isDeleted) {
                        beginPhotoRetake(photo.id);
                        router.push('/camera');
                        return;
                      }

                      togglePhoto(photo.id);
                    }}
                    className={`overflow-hidden rounded-[1.5rem] border text-left transition ${
                      selected
                        ? 'border-emerald-500 shadow-[0_18px_40px_rgba(16,185,129,0.22)]'
                        : 'border-slate-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]'
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                      {photo.isDeleted ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-slate-900 text-center text-white">
                          <span className="text-4xl">📷</span>
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                            Tap to retake
                          </span>
                        </div>
                      ) : (
                        <>
                          <Image
                            src={photo.dataUrl}
                            alt={photo.shotLabel}
                            fill
                            unoptimized
                            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                          />
                          <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
                            {photo.shotLabel}
                          </div>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              removePhotoById(photo.id);
                              setOrderedSelectionIds((current) =>
                                current.map((selectionId) =>
                                  selectionId === photo.id ? null : selectionId
                                )
                              );
                            }}
                            className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-lg text-white shadow-[0_8px_18px_rgba(239,68,68,0.35)] transition hover:bg-rose-400"
                            aria-label={`Delete ${photo.shotLabel}`}
                          >
                            ×
                          </button>
                        </>
                      )}
                      {selected ? (
                        <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                          Slot {selectedIndex + 1}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-600">
                      <span>{new Date(photo.takenAt).toLocaleTimeString()}</span>
                      <span className="font-medium uppercase">{photo.filterId}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <button
            onClick={() => router.push('/camera')}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Retake
          </button>
          <button
            onClick={continueToDesign}
            disabled={filledSelectionCount !== layout.slots}
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Continue to design
          </button>
        </div>
      </div>
    </main>
  );
}
