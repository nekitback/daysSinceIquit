import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StoreState } from '../types'

interface ExtendedStoreState extends StoreState {
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  // Track counters created with custom start date (not eligible for achievements)
  customDateCounterIds: number[]
  addCustomDateCounter: (id: number) => void
  removeCustomDateCounter: (id: number) => void
  // Store tx hashes for counters (counterId -> txHash)
  counterTxHashes: Record<number, string>
  setCounterTxHash: (counterId: number, txHash: string) => void
}

export const useStore = create<ExtendedStoreState>()(
  persist(
    (set) => ({
      counters: [],
      selectedColor: '#3b82f6',
      selectedCategory: 'smoking',
      customName: '',
      soundEnabled: true, // Sound effects enabled by default
      customDateCounterIds: [], // IDs of counters created with custom date
      counterTxHashes: {}, // Map of counterId -> creation tx hash
      
      setSelectedColor: (color) => set({ selectedColor: color }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setCustomName: (name) => set({ customName: name }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      
      addCustomDateCounter: (id) =>
        set((state) => ({
          customDateCounterIds: [...state.customDateCounterIds, id],
        })),
      
      removeCustomDateCounter: (id) =>
        set((state) => ({
          customDateCounterIds: state.customDateCounterIds.filter((i) => i !== id),
        })),
      
      setCounterTxHash: (counterId, txHash) =>
        set((state) => ({
          counterTxHashes: { ...state.counterTxHashes, [counterId]: txHash },
        })),
      
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