import type { FontFamilyId, LayoutId, LayoutOrientation } from '@/lib/photobooth';
import { FONT_OPTIONS, getLayoutOption } from '@/lib/photobooth';
import type { Design } from '@/lib/photobooth';
import type { CapturedPhoto } from '@/lib/store';

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const drawRoundedRectPath = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const boundedRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + boundedRadius, y);
  context.lineTo(x + width - boundedRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + boundedRadius);
  context.lineTo(x + width, y + height - boundedRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - boundedRadius, y + height);
  context.lineTo(x + boundedRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - boundedRadius);
  context.lineTo(x, y + boundedRadius);
  context.quadraticCurveTo(x, y, x + boundedRadius, y);
  context.closePath();
};

const getCoverCrop = (
  imageWidth: number,
  imageHeight: number,
  targetWidth: number,
  targetHeight: number,
) => {
  const imageAspectRatio = imageWidth / imageHeight;
  const targetAspectRatio = targetWidth / targetHeight;

  if (imageAspectRatio > targetAspectRatio) {
    const cropWidth = imageHeight * targetAspectRatio;
    const offsetX = (imageWidth - cropWidth) / 2;

    return {
      sx: offsetX,
      sy: 0,
      sw: cropWidth,
      sh: imageHeight,
    };
  }

  const cropHeight = imageWidth / targetAspectRatio;
  const offsetY = (imageHeight - cropHeight) / 2;

  return {
    sx: 0,
    sy: offsetY,
    sw: imageWidth,
    sh: cropHeight,
  };
};

export const renderLayoutToCanvas = async ({
  canvas,
  layoutId,
  layoutOrientation = 'portrait',
  photos,
  design,
}: {
  canvas: HTMLCanvasElement;
  layoutId: LayoutId;
  layoutOrientation?: LayoutOrientation;
  photos: CapturedPhoto[];
  design: Design;
}) => {
  const layout = getLayoutOption(layoutId, layoutOrientation);
  const context = canvas.getContext('2d');

  if (!layout || !context) {
    throw new Error('Unable to render final layout.');
  }

  const tileSize = 420;
  const gridGap = 12;
  const padding = 28;
  const stickerBandHeight = 110;
  const tileRadius = 36;

  canvas.width = layout.cols * tileSize + Math.max(layout.cols - 1, 0) * gridGap + padding * 2;
  canvas.height =
    layout.rows * tileSize + Math.max(layout.rows - 1, 0) * gridGap + padding * 2 + stickerBandHeight;

  context.fillStyle = design.backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < photos.length; index += 1) {
    const photo = photos[index];
    const cell = layout.cells[index];
    const image = await loadImage(photo.dataUrl);
    const colSpan = cell.colSpan ?? 1;
    const rowSpan = cell.rowSpan ?? 1;
    const x = padding + (cell.col - 1) * (tileSize + gridGap);
    const y = padding + (cell.row - 1) * (tileSize + gridGap);
    const drawWidth = tileSize * colSpan + gridGap * Math.max(colSpan - 1, 0);
    const drawHeight = tileSize * rowSpan + gridGap * Math.max(rowSpan - 1, 0);
    const crop = getCoverCrop(image.width, image.height, drawWidth, drawHeight);

    context.save();
    drawRoundedRectPath(context, x, y, drawWidth, drawHeight, tileRadius);
    context.clip();
    context.fillStyle = 'rgba(255,255,255,0.7)';
    context.fillRect(x, y, drawWidth, drawHeight);
    context.drawImage(
      image,
      crop.sx,
      crop.sy,
      crop.sw,
      crop.sh,
      x,
      y,
      drawWidth,
      drawHeight,
    );
    context.restore();
  }

  context.save();
  context.textBaseline = 'middle';

  const stickerElements = design.elements.filter((element) => element.type === 'sticker');
  const captionElement = design.elements.find((element) => element.id === 'caption-text');

  if (captionElement) {
    const fontFamily =
      FONT_OPTIONS.find((option) => option.id === (captionElement.fontFamily as FontFamilyId))
        ?.family ?? 'sans-serif';
    context.fillStyle = captionElement.color ?? '#ffffff';
    context.font = `700 ${captionElement.fontSize ?? 56}px ${fontFamily}`;
    context.textAlign = 'center';
    context.fillText(captionElement.value, canvas.width / 2, canvas.height - 60);
  }

  context.font = '56px sans-serif';
  context.textAlign = 'left';

  stickerElements.forEach((element, index) => {
    context.fillText(element.value, padding + 20 + index * 72, canvas.height - 60);
  });

  context.restore();

  return canvas.toDataURL('image/png');
};
