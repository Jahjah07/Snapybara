'use client';

import JSZip from 'jszip';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FinalLayoutPreview } from '@/components/final-layout-preview';
import { getLayoutOption } from '@/lib/photobooth';
import { renderLayoutToCanvas } from '@/lib/render-layout';
import { usePhotoboothStore } from '@/lib/store';

export default function DownloadPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    selectedLayout,
    capturedPhotos,
    selectedPhotoIds,
    design,
    startedAt,
    reset,
    setSessionStage,
  } = usePhotoboothStore();
  const layout = getLayoutOption(selectedLayout);
  const selectedPhotos = useMemo(
    () => capturedPhotos.filter((photo) => selectedPhotoIds.includes(photo.id)),
    [capturedPhotos, selectedPhotoIds]
  );

  useEffect(() => {
    if (!layout || selectedPhotos.length !== layout.slots) {
      router.replace('/design');
      return;
    }

    setSessionStage('download');
  }, [layout, router, selectedPhotos.length, setSessionStage]);

  if (!layout) {
    return null;
  }

  const handleDownload = async () => {
    if (!canvasRef.current) {
      return;
    }

    setIsGenerating(true);

    try {
      const finalLayoutDataUrl = await renderLayoutToCanvas({
        canvas: canvasRef.current,
        layoutId: layout.id,
        photos: selectedPhotos,
        design,
      });

      const zip = new JSZip();
      const originalsFolder = zip.folder('original-photos');
      const selectedFolder = zip.folder('selected-photos');
      const timelapseFolder = zip.folder('timelapse-frames');

      capturedPhotos.forEach((photo, index) => {
        originalsFolder?.file(
          `photo_${String(index + 1).padStart(3, '0')}.jpg`,
          photo.dataUrl.split(',')[1],
          { base64: true }
        );

        timelapseFolder?.file(
          `frame_${String(index + 1).padStart(3, '0')}.jpg`,
          photo.dataUrl.split(',')[1],
          { base64: true }
        );
      });

      selectedPhotos.forEach((photo, index) => {
        selectedFolder?.file(
          `selected_${String(index + 1).padStart(3, '0')}.jpg`,
          photo.dataUrl.split(',')[1],
          { base64: true }
        );
      });

      zip.file('final-layout.png', finalLayoutDataUrl.split(',')[1], { base64: true });
      zip.file(
        'session.json',
        JSON.stringify(
          {
            app: 'Snapybara',
            startedAt,
            layout: layout.id,
            captureTarget: layout.captureTarget,
            selectedCount: selectedPhotos.length,
            design,
            note: 'timelapse-frames is a scaffold for future video export',
          },
          null,
          2
        )
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `snapybara-${layout.id}.zip`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Unable to generate the ZIP package.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-8">
      <canvas ref={canvasRef} className="hidden" />

      <div className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
            Step 5
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950">Download package</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            The ZIP already bundles original captures, selected photos, the final designed
            layout, and timelapse-ready frame exports.
          </p>

          <div className="mt-8">
            <FinalLayoutPreview
              layoutId={layout.id}
              photos={selectedPhotos}
              design={design}
              tileClassName="aspect-square min-h-28"
            />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
            <h2 className="text-lg font-semibold">Included in the ZIP</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <p>{capturedPhotos.length} original captures</p>
              <p>{selectedPhotos.length} selected layout photos</p>
              <p>1 rendered final layout PNG</p>
              <p>Timelapse frame folder for future video generation</p>
              <p>Session metadata JSON for debugging or print pipeline setup</p>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white/85 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isGenerating ? 'Generating ZIP...' : 'Download ZIP package'}
              </button>
              <button
                onClick={() => router.push('/design')}
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to design
              </button>
              <button
                onClick={() => {
                  reset();
                  router.push('/dashboard');
                }}
                className="rounded-full border border-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                Start new session
              </button>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
