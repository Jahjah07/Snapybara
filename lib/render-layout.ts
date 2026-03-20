import type { LayoutId } from '@/lib/photobooth';
import { getLayoutOption } from '@/lib/photobooth';
import type { Design } from '@/lib/photobooth';
import type { CapturedPhoto } from '@/lib/store';

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

export const renderLayoutToCanvas = async ({
  canvas,
  layoutId,
  photos,
  design,
}: {
  canvas: HTMLCanvasElement;
  layoutId: LayoutId;
  photos: CapturedPhoto[];
  design: Design;
}) => {
  const layout = getLayoutOption(layoutId);
  const context = canvas.getContext('2d');

  if (!layout || !context) {
    throw new Error('Unable to render final layout.');
  }

  const tileSize = 420;
  const padding = 28;
  const stickerBandHeight = 110;

  canvas.width = layout.cols * tileSize + padding * 2;
  canvas.height = layout.rows * tileSize + padding * 2 + stickerBandHeight;

  context.fillStyle = design.backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < photos.length; index += 1) {
    const photo = photos[index];
    const cell = layout.cells[index];
    const image = await loadImage(photo.dataUrl);
    const x = padding + (cell.col - 1) * tileSize;
    const y = padding + (cell.row - 1) * tileSize;
    const drawWidth = tileSize * (cell.colSpan ?? 1) - 12;
    const drawHeight = tileSize * (cell.rowSpan ?? 1) - 12;

    context.save();
    context.fillStyle = 'rgba(255,255,255,0.7)';
    context.fillRect(x, y, drawWidth, drawHeight);
    context.drawImage(image, x, y, drawWidth, drawHeight);
    context.restore();
  }

  context.save();
  context.font = '56px sans-serif';
  context.textBaseline = 'middle';

  design.elements.forEach((element, index) => {
    context.fillText(
      element.value,
      padding + 20 + index * 72,
      canvas.height - stickerBandHeight / 2
    );
  });

  context.restore();

  return canvas.toDataURL('image/png');
};
