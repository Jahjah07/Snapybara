export type LayoutId = '1x2' | 'hero-3' | 'hero-5' | '2x2' | '2x3' | '3x3';
export type LayoutOrientation = 'portrait' | 'landscape';
export type FilterId = 'original' | 'bw' | 'sepia' | 'cool';
export type ThemeId = 'clean' | 'midnight' | 'birthday' | 'custom';
export type FontFamilyId =
  | 'fun'
  | 'marker'
  | 'classic'
  | 'mono'
  | 'impact'
  | 'rounded'
  | 'elegant'
  | 'handwritten'
  | 'clean'
  | 'poster';

export type LayoutOption = {
  id: LayoutId;
  label: string;
  rows: number;
  cols: number;
  slots: number;
  captureTarget: number;
  description: string;
  cells: LayoutCell[];
  orientation: LayoutOrientation;
  canRotate: boolean;
};

export type LayoutCell = {
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
};

export type FilterPreset = {
  id: FilterId;
  label: string;
  previewClassName: string;
  canvasFilter: string;
};

export type ThemePreset = {
  id: ThemeId;
  label: string;
  backgroundColor: string;
  accentColor: string;
};

export type DesignElement = {
  id: string;
  type: 'sticker' | 'text';
  value: string;
  fontFamily?: FontFamilyId;
  fontSize?: number;
  color?: string;
};

export type Design = {
  backgroundColor: string;
  themeId: ThemeId;
  elements: DesignElement[];
};

export const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: '1x2',
    label: '1 x 2',
    rows: 1,
    cols: 2,
    slots: 2,
    captureTarget: 4,
    description: 'Two-photo strip for quick sessions and simple prints.',
    cells: [
      { col: 1, row: 1 },
      { col: 2, row: 1 },
    ],
    orientation: 'portrait',
    canRotate: true,
  },
  {
    id: 'hero-3',
    label: '3 Photo Hero',
    rows: 2,
    cols: 3,
    slots: 3,
    captureTarget: 5,
    description: 'One featured square photo on the left, two stacked shots on the right.',
    cells: [
      { col: 1, row: 1, colSpan: 2, rowSpan: 2 },
      { col: 3, row: 1 },
      { col: 3, row: 2 },
    ],
    orientation: 'portrait',
    canRotate: true,
  },
  {
    id: 'hero-5',
    label: '5 Photo Hero',
    rows: 2,
    cols: 4,
    slots: 5,
    captureTarget: 7,
    description: 'One featured square photo on the left with four smaller shots on the right.',
    cells: [
      { col: 1, row: 1, colSpan: 2, rowSpan: 2 },
      { col: 3, row: 1 },
      { col: 4, row: 1 },
      { col: 3, row: 2 },
      { col: 4, row: 2 },
    ],
    orientation: 'portrait',
    canRotate: true,
  },
  {
    id: '2x2',
    label: '2 x 2',
    rows: 2,
    cols: 2,
    slots: 4,
    captureTarget: 6,
    description: 'Four final frames with two extra shots for selection.',
    cells: [
      { col: 1, row: 1 },
      { col: 2, row: 1 },
      { col: 1, row: 2 },
      { col: 2, row: 2 },
    ],
    orientation: 'portrait',
    canRotate: false,
  },
  {
    id: '2x3',
    label: '2 x 3',
    rows: 2,
    cols: 3,
    slots: 6,
    captureTarget: 8,
    description: 'Classic event strip with room to choose your favorites.',
    cells: [
      { col: 1, row: 1 },
      { col: 2, row: 1 },
      { col: 3, row: 1 },
      { col: 1, row: 2 },
      { col: 2, row: 2 },
      { col: 3, row: 2 },
    ],
    orientation: 'portrait',
    canRotate: true,
  },
  {
    id: '3x3',
    label: '3 x 3',
    rows: 3,
    cols: 3,
    slots: 9,
    captureTarget: 12,
    description: 'Full collage mode for bigger groups and more variety.',
    cells: [
      { col: 1, row: 1 },
      { col: 2, row: 1 },
      { col: 3, row: 1 },
      { col: 1, row: 2 },
      { col: 2, row: 2 },
      { col: 3, row: 2 },
      { col: 1, row: 3 },
      { col: 2, row: 3 },
      { col: 3, row: 3 },
    ],
    orientation: 'portrait',
    canRotate: false,
  },
];

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'original',
    label: 'Original',
    previewClassName: '',
    canvasFilter: 'none',
  },
  {
    id: 'bw',
    label: 'B&W',
    previewClassName: 'grayscale',
    canvasFilter: 'grayscale(1)',
  },
  {
    id: 'sepia',
    label: 'Sepia',
    previewClassName: 'sepia',
    canvasFilter: 'sepia(1)',
  },
  {
    id: 'cool',
    label: 'Cool',
    previewClassName: 'saturate-125 hue-rotate-15',
    canvasFilter: 'saturate(1.25) hue-rotate(15deg)',
  },
];

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'clean',
    label: 'Clean Studio',
    backgroundColor: '#fffaf0',
    accentColor: '#d97706',
  },
  {
    id: 'midnight',
    label: 'Midnight Pop',
    backgroundColor: '#111827',
    accentColor: '#38bdf8',
  },
  {
    id: 'birthday',
    label: 'Party Confetti',
    backgroundColor: '#ffe4e6',
    accentColor: '#db2777',
  },
  {
    id: 'custom',
    label: 'Custom',
    backgroundColor: '#ffffff',
    accentColor: '#111827',
  },
];

export const STICKER_OPTIONS = ['🎉', '✨', '📸', '💖', '🎂', '⭐'];
export const TEXT_EMOJI_OPTIONS = ['✨', '🎉', '💖', '📸', '🎂', '🥳'];
export const FONT_OPTIONS: Array<{ id: FontFamilyId; label: string; family: string }> = [
  { id: 'fun', label: 'Fun', family: '"Comic Sans MS", "Marker Felt", cursive' },
  { id: 'marker', label: 'Marker', family: '"Trebuchet MS", "Avenir Next", sans-serif' },
  { id: 'classic', label: 'Classic', family: '"Georgia", serif' },
  { id: 'mono', label: 'Mono', family: '"IBM Plex Mono", "Consolas", monospace' },
  { id: 'impact', label: 'Impact', family: '"Impact", "Arial Black", sans-serif' },
  {
    id: 'rounded',
    label: 'Rounded',
    family: '"Arial Rounded MT Bold", "Trebuchet MS", sans-serif',
  },
  { id: 'elegant', label: 'Elegant', family: '"Palatino Linotype", "Book Antiqua", serif' },
  {
    id: 'handwritten',
    label: 'Handwritten',
    family: '"Bradley Hand", "Comic Sans MS", "Marker Felt", cursive',
  },
  { id: 'clean', label: 'Clean', family: '"Verdana", "Geneva", sans-serif' },
  { id: 'poster', label: 'Poster', family: '"Gill Sans", "Trebuchet MS", sans-serif' },
];

export const DEFAULT_FILTER_ID: FilterId = 'original';
export const DEFAULT_THEME_ID: ThemeId = 'clean';
export const DEFAULT_DESIGN: Design = {
  backgroundColor:
    THEME_PRESETS.find((theme) => theme.id === DEFAULT_THEME_ID)?.backgroundColor ??
    '#fffaf0',
  themeId: DEFAULT_THEME_ID,
  elements: [],
};

const LANDSCAPE_LAYOUT_OPTIONS: Record<LayoutId, LayoutOption> = Object.fromEntries(
  LAYOUT_OPTIONS.filter((layout) => layout.canRotate).map((layout) => [
    layout.id,
    {
      ...layout,
      rows: layout.cols,
      cols: layout.rows,
      cells: layout.cells.map((cell) => ({
        col: cell.row,
        row: cell.col,
        colSpan: cell.rowSpan,
        rowSpan: cell.colSpan,
      })),
      orientation: 'landscape' as const,
    },
  ])
) as Record<LayoutId, LayoutOption>;

export const getLayoutOption = (
  layoutId: LayoutId | null,
  orientation: LayoutOrientation = 'portrait'
) => {
  const baseLayout = LAYOUT_OPTIONS.find((layout) => layout.id === layoutId);

  if (!baseLayout) {
    return null;
  }

  if (orientation === 'portrait' || !baseLayout.canRotate) {
    return baseLayout;
  }

  return LANDSCAPE_LAYOUT_OPTIONS[baseLayout.id] ?? baseLayout;
};

export const getFilterPreset = (filterId: FilterId) =>
  FILTER_PRESETS.find((filter) => filter.id === filterId) ?? FILTER_PRESETS[0];

export const getThemePreset = (themeId: ThemeId) =>
  THEME_PRESETS.find((theme) => theme.id === themeId) ?? THEME_PRESETS[0];
