import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  DEFAULT_DESIGN,
  DEFAULT_FILTER_ID,
  type Design,
  type FilterId,
  type FontFamilyId,
  type LayoutId,
  type LayoutOrientation,
  type ThemeId,
} from '@/lib/photobooth';

export type CapturedPhoto = {
  id: string;
  dataUrl: string;
  filterId: FilterId;
  takenAt: string;
  isDeleted?: boolean;
};

type SessionStage =
  | 'dashboard'
  | 'camera'
  | 'selection'
  | 'design'
  | 'download';

interface PhotoboothStore {
  selectedLayout: LayoutId | null;
  selectedLayoutOrientation: LayoutOrientation;
  activeFilterId: FilterId;
  capturedPhotos: CapturedPhoto[];
  selectedPhotoIds: string[];
  retakePhotoId: string | null;
  design: Design;
  sessionStage: SessionStage;
  startedAt: string | null;
  startSession: (layout: LayoutId) => void;
  setSelectedLayoutOrientation: (orientation: LayoutOrientation) => void;
  setSessionStage: (stage: SessionStage) => void;
  setActiveFilterId: (filterId: FilterId) => void;
  addPhoto: (photo: { dataUrl: string; filterId: FilterId }) => string;
  removeLastPhoto: () => void;
  removePhotoById: (photoId: string) => void;
  setSelectedPhotoIds: (photoIds: string[]) => void;
  beginPhotoRetake: (photoId: string) => void;
  completePhotoRetake: (photo: { dataUrl: string; filterId: FilterId }) => void;
  clearRetake: () => void;
  setTheme: (themeId: ThemeId) => void;
  setBackgroundColor: (backgroundColor: string) => void;
  toggleSticker: (sticker: string) => void;
  setCaptionText: (text: string) => void;
  setCaptionStyle: (style: {
    fontFamily?: FontFamilyId;
    fontSize?: number;
    color?: string;
  }) => void;
  appendCaptionEmoji: (emoji: string) => void;
  reset: () => void;
}

const initialState = {
  selectedLayout: null as LayoutId | null,
  selectedLayoutOrientation: 'portrait' as LayoutOrientation,
  activeFilterId: DEFAULT_FILTER_ID,
  capturedPhotos: [] as CapturedPhoto[],
  selectedPhotoIds: [] as string[],
  retakePhotoId: null as string | null,
  design: DEFAULT_DESIGN,
  sessionStage: 'dashboard' as SessionStage,
  startedAt: null as string | null,
};

export const usePhotoboothStore = create<PhotoboothStore>()(
  persist(
    (set) => ({
      ...initialState,
      startSession: (layout) =>
        set({
          selectedLayout: layout,
          selectedLayoutOrientation: 'portrait',
          activeFilterId: DEFAULT_FILTER_ID,
          capturedPhotos: [],
          selectedPhotoIds: [],
          retakePhotoId: null,
          design: DEFAULT_DESIGN,
          sessionStage: 'camera',
          startedAt: new Date().toISOString(),
        }),
      setSelectedLayoutOrientation: (selectedLayoutOrientation) =>
        set({ selectedLayoutOrientation }),
      setSessionStage: (sessionStage) => set({ sessionStage }),
      setActiveFilterId: (activeFilterId) => set({ activeFilterId }),
      addPhoto: ({ dataUrl, filterId }) => {
        const photoId = crypto.randomUUID();

        set((state) => ({
          capturedPhotos: [
            ...state.capturedPhotos,
            {
              id: photoId,
              dataUrl,
              filterId,
              takenAt: new Date().toISOString(),
            },
          ],
        }));

        return photoId;
      },
      removeLastPhoto: () =>
        set((state) => {
          const capturedPhotos = state.capturedPhotos.slice(0, -1);
          const remainingIds = new Set(capturedPhotos.map((photo) => photo.id));

          return {
            capturedPhotos,
            selectedPhotoIds: state.selectedPhotoIds.filter((id) =>
              remainingIds.has(id)
            ),
          };
        }),
      removePhotoById: (photoId) =>
        set((state) => {
          const capturedPhotos = state.capturedPhotos.map((photo) =>
            photo.id === photoId
              ? {
                  ...photo,
                  isDeleted: true,
                }
              : photo
          );

          return {
            capturedPhotos,
          };
        }),
      setSelectedPhotoIds: (selectedPhotoIds) => set({ selectedPhotoIds }),
      beginPhotoRetake: (retakePhotoId) =>
        set({
          retakePhotoId,
        }),
      completePhotoRetake: ({ dataUrl, filterId }) =>
        set((state) => {
          if (!state.retakePhotoId) {
            return {};
          }

          return {
            capturedPhotos: state.capturedPhotos.map((photo) =>
              photo.id === state.retakePhotoId
                ? {
                    ...photo,
                    dataUrl,
                    filterId,
                    takenAt: new Date().toISOString(),
                    isDeleted: false,
                  }
                : photo
            ),
            retakePhotoId: null,
          };
        }),
      clearRetake: () =>
        set({
          retakePhotoId: null,
        }),
      setTheme: (themeId) =>
        set((state) => ({
          design: {
            ...state.design,
            themeId,
          },
        })),
      setBackgroundColor: (backgroundColor) =>
        set((state) => ({
          design: {
            ...state.design,
            backgroundColor,
          },
        })),
      toggleSticker: (sticker) =>
        set((state) => {
          const elementId = `sticker-${sticker}`;
          const exists = state.design.elements.some((element) => element.id === elementId);

          return {
            design: {
              ...state.design,
              elements: exists
                ? state.design.elements.filter((element) => element.id !== elementId)
                : [
                    ...state.design.elements,
                    {
                      id: elementId,
                      type: 'sticker',
                      value: sticker,
                    },
                  ],
            },
          };
        }),
      setCaptionText: (text) =>
        set((state) => {
          const hasVisibleText = text.trim().length > 0;
          const otherElements = state.design.elements.filter(
            (element) => element.id !== 'caption-text'
          );

          return {
            design: {
              ...state.design,
              elements: hasVisibleText
                ? [
                    ...otherElements,
                    {
                      id: 'caption-text',
                      type: 'text',
                      value: text,
                      fontFamily:
                        state.design.elements.find((element) => element.id === 'caption-text')
                          ?.fontFamily ?? 'fun',
                      fontSize:
                        state.design.elements.find((element) => element.id === 'caption-text')
                          ?.fontSize ?? 36,
                      color:
                        state.design.elements.find((element) => element.id === 'caption-text')
                          ?.color ?? '#ffffff',
                    },
                  ]
                : otherElements,
            },
          };
        }),
      setCaptionStyle: (style) =>
        set((state) => ({
          design: {
            ...state.design,
            elements: state.design.elements.map((element) =>
              element.id === 'caption-text'
                ? {
                    ...element,
                    ...style,
                  }
                : element
            ),
          },
        })),
      appendCaptionEmoji: (emoji) =>
        set((state) => {
          const caption = state.design.elements.find((element) => element.id === 'caption-text');

          if (!caption) {
            return {
              design: {
                ...state.design,
                elements: [
                  ...state.design.elements,
                  {
                    id: 'caption-text',
                    type: 'text',
                    value: emoji,
                    fontFamily: 'fun',
                    fontSize: 36,
                    color: '#ffffff',
                  },
                ],
              },
            };
          }

          return {
            design: {
              ...state.design,
              elements: state.design.elements.map((element) =>
                element.id === 'caption-text'
                  ? {
                      ...element,
                      value: `${element.value}${emoji}`,
                    }
                  : element
              ),
            },
          };
        }),
      reset: () => set(initialState),
    }),
    {
      name: 'snapybara-session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedLayout: state.selectedLayout,
        selectedLayoutOrientation: state.selectedLayoutOrientation,
        activeFilterId: state.activeFilterId,
        capturedPhotos: state.capturedPhotos,
        selectedPhotoIds: state.selectedPhotoIds,
        retakePhotoId: state.retakePhotoId,
        design: state.design,
        sessionStage: state.sessionStage,
        startedAt: state.startedAt,
      }),
    }
  )
);
