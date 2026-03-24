'use client';

import Image from 'next/image';
import type { Design, FontFamilyId, LayoutId, LayoutOrientation } from '@/lib/photobooth';
import { FONT_OPTIONS, getLayoutOption } from '@/lib/photobooth';
import type { CapturedPhoto } from '@/lib/store';

type FinalLayoutPreviewProps = {
  layoutId: LayoutId;
  layoutOrientation?: LayoutOrientation;
  photos: CapturedPhoto[];
  design: Design;
  tileClassName?: string;
};

export function FinalLayoutPreview({
  layoutId,
  layoutOrientation = 'portrait',
  photos,
  design,
  tileClassName = 'aspect-square min-h-32',
}: FinalLayoutPreviewProps) {
  const layout = getLayoutOption(layoutId, layoutOrientation);

  if (!layout) {
    return null;
  }

  const stickerElements = design.elements.filter((element) => element.type === 'sticker');
  const captionElement = design.elements.find((element) => element.id === 'caption-text');
  const fontFamily =
    FONT_OPTIONS.find((option) => option.id === (captionElement?.fontFamily as FontFamilyId))
      ?.family ?? FONT_OPTIONS[0].family;

  return (
    <div
      className="rounded-[2rem] border border-black/10 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
      style={{ backgroundColor: design.backgroundColor }}
    >
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
        }}
      >
        {photos.map((photo, index) => {
          const cell = layout.cells[index];

          return (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-[1.5rem] bg-white/70 ${tileClassName}`}
              style={{
                gridColumn: `${cell.col} / span ${cell.colSpan ?? 1}`,
                gridRow: `${cell.row} / span ${cell.rowSpan ?? 1}`,
              }}
            >
              <Image
                src={photo.dataUrl}
                alt="Selected photobooth shot"
                fill
                unoptimized
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 45vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>

      {captionElement ? (
        <div
          className="mt-4 text-center font-semibold"
          style={{
            color: captionElement.color ?? '#ffffff',
            fontFamily,
            fontSize: `${captionElement.fontSize ?? 36}px`,
          }}
        >
          {captionElement.value}
        </div>
      ) : null}

      {stickerElements.length > 0 ? (
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-3xl">
          {stickerElements.map((element) => (
            <span key={element.id}>{element.value}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
