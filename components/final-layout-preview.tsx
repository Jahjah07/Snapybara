'use client';

import Image from 'next/image';
import type { Design, LayoutId } from '@/lib/photobooth';
import { getLayoutOption } from '@/lib/photobooth';
import type { CapturedPhoto } from '@/lib/store';

type FinalLayoutPreviewProps = {
  layoutId: LayoutId;
  photos: CapturedPhoto[];
  design: Design;
  tileClassName?: string;
};

export function FinalLayoutPreview({
  layoutId,
  photos,
  design,
  tileClassName = 'aspect-square min-h-32',
}: FinalLayoutPreviewProps) {
  const layout = getLayoutOption(layoutId);

  if (!layout) {
    return null;
  }

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

      {design.elements.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3 text-3xl">
          {design.elements.map((element) => (
            <span key={element.id}>{element.value}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
