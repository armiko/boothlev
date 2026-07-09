import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      photos: [],
      templateId: null,
      stickers: [],
      bgColor: "",
      
      setTemplate: (id) => set({ templateId: id }),
      
      addPhoto: (dataUrl) => set((state) => ({ 
        photos: [...state.photos, dataUrl] 
      })),
      
      setPhotos: (photos) => set({ photos }),
      
      clearPhotos: () => set({ photos: [] }),
      
      replacePhoto: (index, dataUrl) => set((state) => {
        const newPhotos = [...state.photos];
        newPhotos[index] = dataUrl;
        return { photos: newPhotos };
      }),

      setStickers: (stickersUpdater) => set((state) => ({
        stickers: typeof stickersUpdater === 'function' ? stickersUpdater(state.stickers) : stickersUpdater
      })),

      setBgColor: (bgColor) => set({ bgColor }),
      
      resetSession: () => set({ photos: [], templateId: null, stickers: [], bgColor: "" }),
    }),
    {
      name: 'boothlev-storage', // saves to localStorage
    }
  )
);
