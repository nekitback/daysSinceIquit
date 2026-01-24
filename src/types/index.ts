export interface Counter {
    id: number
    startedAt: number
    pausedAt: number
    totalPausedTime: number
    longestStreak: number
    totalResets: number
    active: boolean
    category: string
    color: string
    customName?: string
  }
  
  export interface CounterMetadata {
    color: string
    category: string
    customName?: string
  }
  
  export interface CounterCardProps {
    counter: Counter
    isLoading?: boolean
    onReset: (id: number) => void
    onPause: (id: number) => void
    onResume: (id: number) => void
    onDelete: (id: number) => void
  }
  
  export interface StoreState {
    counters: Counter[]
    selectedColor: string
    selectedCategory: string
    customName: string
    setSelectedColor: (color: string) => void
    setSelectedCategory: (category: string) => void
    setCustomName: (name: string) => void
    addCounter: (counter: Counter) => void
    removeCounter: (id: number) => void
    updateCounter: (id: number, updates: Partial<Counter>) => void
  }
  
  export interface RelapseHistoryItem {
    timestamp: number
    date: string
  }