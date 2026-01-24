import { useState, useEffect } from 'react'
import { useAccount, useWatchContractEvent } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Menu } from 'lucide-react'
import SlideMenu from './components/SlideMenu'
import CounterCard from './components/CounterCard'
import ColorPicker from './components/ColorPicker'
import CategorySelector from './components/CategorySelector'
import { useStore } from './store/useStore'
import { 
  useStartCounter, 
  useResetCounter, 
  usePauseCounter,
  useResumeCounter,
  useDeleteCounter,
  useGetActiveCounters 
} from './hooks/useContract'
import { PRESET_CATEGORIES } from './constants/categories'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants/contract'
import type { Counter } from './types'

function App() {
  const { isConnected, address } = useAccount()
  const [menuOpen, setMenuOpen] = useState(false)
  const { 
    selectedColor, 
    selectedCategory, 
    customName,
  } = useStore()

  // Contract hooks
  const { startCounter, isPending, isConfirming, isSuccess } = useStartCounter()
  const { resetCounter } = useResetCounter()
  const { pauseCounter } = usePauseCounter()
  const { resumeCounter } = useResumeCounter()
  const { deleteCounter } = useDeleteCounter()
  const { counters: activeCounters, refetch } = useGetActiveCounters()

  // Local state
  const [displayCounters, setDisplayCounters] = useState<Counter[]>([])
  const [loadingCounters, setLoadingCounters] = useState<Set<number>>(new Set())

  // Load counters from contract (metadata now comes from blockchain!)
  useEffect(() => {
    if (!activeCounters || !address) return

    const [ids, counterData] = activeCounters as [bigint[], any[]]
    
    const merged: Counter[] = ids.map((id, index) => {
      const onchainData = counterData[index]
      
      return {
        id: Number(id),
        startedAt: Number(onchainData.startedAt),
        pausedAt: Number(onchainData.pausedAt),
        totalPausedTime: Number(onchainData.totalPausedTime),
        longestStreak: Number(onchainData.longestStreak),
        totalResets: Number(onchainData.totalResets),
        active: onchainData.active,
        category: onchainData.category,      // ← From blockchain!
        color: onchainData.color,            // ← From blockchain!
      }
    })

    setDisplayCounters(merged)
  }, [activeCounters, address])

  // Auto-reload on contract events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CounterStarted',
    onLogs() {
      setTimeout(() => refetch(), 1000)
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CounterPaused',
    onLogs(logs) {
      setTimeout(() => {
        refetch()
        const id = Number(logs[0].args.id)
        setLoadingCounters(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }, 500)
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CounterResumed',
    onLogs(logs) {
      setTimeout(() => {
        refetch()
        const id = Number(logs[0].args.id)
        setLoadingCounters(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }, 500)
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CounterReset',
    onLogs(logs) {
      setTimeout(() => {
        refetch()
        const id = Number(logs[0].args.id)
        setLoadingCounters(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }, 500)
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CounterDeleted',
    onLogs(logs) {
      setTimeout(() => {
        refetch()
        const id = Number(logs[0].args.id)
        setLoadingCounters(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }, 500)
    },
  })

  const handleQuit = async () => {
    if (selectedCategory === 'custom' && !customName.trim()) {
      alert('Please enter a custom habit name')
      return
    }

    const category = PRESET_CATEGORIES.find(c => c.id === selectedCategory)
    const categoryName = selectedCategory === 'custom' 
      ? customName 
      : category?.label.replace(/[🚬🍺🍰📱🎮✏️]/g, '').trim() || 'Unknown'

    // Now category and color go to the blockchain!
    await startCounter(categoryName, selectedColor)
  }

  const handleReset = async (id: number) => {
    if (confirm('Are you sure you want to reset this counter? Your current streak will be saved if it\'s your longest!')) {
      setLoadingCounters(prev => new Set(prev).add(id))
      await resetCounter(id)
      
      // Fallback timeout
      setTimeout(() => {
        setLoadingCounters(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        refetch()
      }, 10000)
    }
  }

  const handlePause = async (id: number) => {
    setLoadingCounters(prev => new Set(prev).add(id))
    await pauseCounter(id)
    
    setTimeout(() => {
      setLoadingCounters(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      refetch()
    }, 10000)
  }

  const handleResume = async (id: number) => {
    setLoadingCounters(prev => new Set(prev).add(id))
    await resumeCounter(id)
    
    setTimeout(() => {
      setLoadingCounters(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      refetch()
    }, 10000)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to permanently delete this counter?')) {
      setLoadingCounters(prev => new Set(prev).add(id))
      await deleteCounter(id)
      
      setTimeout(() => {
        setLoadingCounters(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        refetch()
      }, 10000)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-8 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-white rounded-lg"></div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-3">
            Days Since I Quit
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Track your journey onchain.<br />
            Built on <span className="text-blue-500 font-semibold">Base</span>.
          </p>
          
          <ConnectButton />
          
          <p className="text-gray-600 text-sm mt-6">
            Powered by Base Sepolia
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Days Since I Quit</h1>
                  <p className="text-xs text-gray-500">Track onchain</p>
                </div>
              </div>
            </div>

            <ConnectButton />
          </div>
        </div>
      </header>

      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Create Counter Card */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div 
              className="px-8 py-6 transition-colors duration-300"
              style={{ 
                background: `linear-gradient(to right, ${selectedColor}, ${selectedColor}dd)` 
              }}
            >
              <h2 className="text-2xl font-bold text-white drop-shadow-md">
                Start a New Counter
              </h2>
              <p className="text-white/90 text-sm mt-1">
                All data stored permanently onchain
              </p>
            </div>
            
            <div className="p-8 space-y-6">
              <ColorPicker />
              <CategorySelector />
              
              <button
                onClick={handleQuit}
                disabled={isPending || isConfirming}
                className="w-full px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-white"
                style={{
                  background: `linear-gradient(to right, ${selectedColor}, ${selectedColor}dd)`,
                }}
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Confirm in wallet...</span>
                  </div>
                ) : isConfirming ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'I Quit! 🚀'
                )}
              </button>

              {isSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl">
                  <p className="font-semibold">✅ Counter created onchain!</p>
                  <p className="text-xs mt-1">Category and color stored in blockchain</p>
                </div>
              )}
            </div>
          </section>

          {/* Counters List */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                Your Counters
                {displayCounters.length > 0 && (
                  <span className="text-base px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-semibold">
                    {displayCounters.length}
                  </span>
                )}
              </h2>
            </div>
            
            {displayCounters.length > 0 ? (
              <div className="grid gap-6">
                {displayCounters.map((counter) => (
                  <CounterCard 
                    key={counter.id} 
                    counter={counter}
                    isLoading={loadingCounters.has(counter.id)}
                    onReset={handleReset}
                    onPause={handlePause}
                    onResume={handleResume}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🎯</span>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  No counters yet
                </p>
                <p className="text-gray-500">
                  Start your journey by creating your first counter!
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App