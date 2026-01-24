import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StoreState, Counter } from '../types'

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      counters: [],
      selectedColor: '#EF4444',
      selectedCategory: 'smoking',
      customName: '',
      
      setSelectedColor: (color) => set({ selectedColor: color }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setCustomName: (name) => set({ customName: name }),
      
      addCounter: (counter) =>
        set((state) => ({ counters: [...state.counters, counter] })),
      
      removeCounter: (id) =>
        set((state) => ({
          counters: state.counters.filter((c) => c.id !== id),
        })),
      
      updateCounter: (id, updates) =>
        set((state) => ({
          counters: state.counters.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
    }),
    {
      name: 'days-since-quit-storage',
    }
  )
)