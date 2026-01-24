import { useState, useEffect, useRef } from 'react'
import { useAccount, useWatchContractEvent } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Menu } from 'lucide-react'
import PendingCounterCard from './components/PendingCounterCard'
import CounterCard from './components/CounterCard'
import ColorPicker from './components/ColorPicker'
import CategorySelector from './components/CategorySelector'
import SlideMenu from './components/SlideMenu'
import CustomStartDate from './components/CustomStartDate'
import ConfirmModal from './components/ConfirmModal'
import Toast from './components/Toast'
import Logo from './components/Logo'
import Footer from './components/Footer'
import { 
  useStartCounter, 
  useResetCounter, 
  useStartCounterWithCustomTime,
  usePauseCounter,
  useResumeCounter,
  useDeleteCounter,
  useGetActiveCounters 
} from './hooks/useContract'
import { PRESET_CATEGORIES } from './constants/categories'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants/contract'
import { useStore } from './store/useStore'
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
  const { 
    startCounterWithCustomTime, 
    isPending: isPendingCustom, 
    isConfirming: isConfirmingCustom,
    isSuccess: isSuccessCustom
  } = useStartCounterWithCustomTime()
  const { resetCounter } = useResetCounter()
  const { pauseCounter } = usePauseCounter()
  const { resumeCounter } = useResumeCounter()
  const { deleteCounter } = useDeleteCounter()
  const { counters: activeCounters, refetch } = useGetActiveCounters()

  // Local state
  const [displayCounters, setDisplayCounters] = useState<Counter[]>([])
  const [loadingCounters, setLoadingCounters] = useState<Set<number>>(new Set())
  const [customStartDate, setCustomStartDate] = useState<number | null>(null)

  // ✅ useRef для хранения timeout ID - предотвращает утечки
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Modal states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    confirmColor?: 'red' | 'blue' | 'green'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  // Toast states
  const [toast, setToast] = useState<{
    isOpen: boolean
    message: string
    type: 'success' | 'error' | 'info'
  }>({
    isOpen: false,
    message: '',
    type: 'success',
  })

  const [pendingCounter, setPendingCounter] = useState<{
    category: string
    color: string
    customStartDate: number | null
  } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ isOpen: true, message, type })
  }

  // ✅ Функция для очистки timeout
  const clearPendingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // ✅ Cleanup при unmount
  useEffect(() => {
    return () => {
      clearPendingTimeout()
    }
  }, [])

  // Load counters from contract
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
        category: onchainData.category,
        color: onchainData.color,
      }
    })

    setDisplayCounters(merged)
  }, [activeCounters, address])

  // ✅ Сброс состояния при disconnect
  useEffect(() => {
    if (!isConnected) {
      setPendingCounter(null)
      setCustomStartDate(null)
      setDisplayCounters([])
      setLoadingCounters(new Set())
      clearPendingTimeout()
    }
  }, [isConnected])

  // ✅ ИСПРАВЛЕНО: Event listeners с проверкой адреса и без setTimeout
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CounterStarted',
    onLogs(logs) {
      const eventUser = logs[0]?.args?.user
      if (eventUser?.toLowerCase() === address?.toLowerCase()) {
        clearPendingTimeout()
        setPendingCounter(null)
        refetch()
        showToast('✅ Counter created onchain!', 'success')
      }
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CounterPaused',
    onLogs(logs) {
      const eventUser = logs[0]?.args?.user
      const id = Number(logs[0]?.args?.id)
      
      if (eventUser?.toLowerCase() === address?.toLowerCase()) {
        setLoadingCounters(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        refetch()
      }
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CounterResumed',
    onLogs(logs) {
      const eventUser = logs[0]?.args?.user
      const id = Number(logs[0]?.args?.id)
      
      if (eventUser?.toLowerCase() === address?.toLowerCase()) {
        setLoadingCounters(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        refetch()
      }
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CounterReset',
    onLogs(logs) {
      const eventUser = logs[0]?.args?.user
      const id = Number(logs[0]?.args?.id)
      
      if (eventUser?.toLowerCase() === address?.toLowerCase()) {
        setLoadingCounters(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        refetch()
      }
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CounterDeleted',
    onLogs(logs) {
      const eventUser = logs[0]?.args?.user
      const id = Number(logs[0]?.args?.id)
      
      if (eventUser?.toLowerCase() === address?.toLowerCase()) {
        setLoadingCounters(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        refetch()
      }
    },
  })

  // ✅ ПОЛНОСТЬЮ ПЕРЕПИСАН handleQuit
  const handleQuit = async () => {
    if (pendingCounter !== null) {
      showToast('⏳ Please wait for current transaction', 'info')
      return
    }

    if (selectedCategory === 'custom' && !customName.trim()) {
      showToast('Please enter a custom habit name', 'error')
      return
    }

    const category = PRESET_CATEGORIES.find(c => c.id === selectedCategory)
    const categoryName = selectedCategory === 'custom' 
      ? customName 
      : category?.label.replace(/[🚬🍺🍰📱🎮✏️]/g, '').trim() || 'Unknown'

    try {
      // Вызываем контракт СНАЧАЛА (чтобы catch сработал при отмене)
      let txPromise: Promise<any>
      
      if (customStartDate) {
        txPromise = startCounterWithCustomTime(categoryName, selectedColor, customStartDate)
      } else {
        txPromise = startCounter(categoryName, selectedColor)
      }

      // Только ПОСЛЕ успешной отправки показываем фантом
      await txPromise
      
      // Транзакция отправлена успешно!
      setPendingCounter({
        category: categoryName,
        color: selectedColor,
        customStartDate: customStartDate
      })

      // Таймаут на случай если event не сработает
      clearPendingTimeout()
      timeoutRef.current = setTimeout(() => {
        console.warn('Transaction timeout')
        setPendingCounter(null)
        refetch() // Попытка обновить на всякий случай
        showToast('⚠️ Taking longer than expected. Refreshing...', 'info')
      }, 30000) // 30 секунд

      setCustomStartDate(null)

    } catch (error: any) {
      console.error('Transaction error:', error)
      
      // Очищаем все
      clearPendingTimeout()
      setPendingCounter(null)
      
      // Обработка ошибок
      if (error.code === 4001 || error.message?.includes('User rejected')) {
        showToast('Transaction cancelled', 'info')
      } else if (error.message?.includes('insufficient funds')) {
        showToast('❌ Insufficient funds', 'error')
      } else {
        showToast('❌ Transaction failed', 'error')
      }
    }
  }

  // ✅ УПРОЩЕННЫЕ обработчики операций
  const handleReset = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Counter?',
      message: "Are you sure? Your current streak will be saved if it's your longest!",
      confirmColor: 'red',
      onConfirm: async () => {
        try {
          setLoadingCounters(prev => new Set(prev).add(id))
          await resetCounter(id)
          // Event listener уберет loading и обновит данные
        } catch (error) {
          setLoadingCounters(prev => {
            const newSet = new Set(prev)
            newSet.delete(id)
            return newSet
          })
          showToast('❌ Reset failed', 'error')
        }
      },
    })
  }

  const handlePause = async (id: number) => {
    try {
      setLoadingCounters(prev => new Set(prev).add(id))
      await pauseCounter(id)
      // Event listener уберет loading
    } catch (error) {
      setLoadingCounters(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      showToast('❌ Pause failed', 'error')
    }
  }

  const handleResume = async (id: number) => {
    try {
      setLoadingCounters(prev => new Set(prev).add(id))
      await resumeCounter(id)
      // Event listener уберет loading
    } catch (error) {
      setLoadingCounters(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      showToast('❌ Resume failed', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Counter?',
      message: 'Permanently delete this counter? This cannot be undone.',
      confirmColor: 'red',
      onConfirm: async () => {
        try {
          setLoadingCounters(prev => new Set(prev).add(id))
          await deleteCounter(id)
          // Event listener уберет loading и обновит
        } catch (error) {
          setLoadingCounters(prev => {
            const newSet = new Set(prev)
            newSet.delete(id)
            return newSet
          })
          showToast('❌ Delete failed', 'error')
        }
      },
    })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="flex justify-center mb-8">
            <Logo size="large" showText={false} />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-3">
            Days Since I Quit
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Track your journey onchain.<br />
            Built on <span className="text-blue-500 font-semibold">Base</span>.
          </p>
          
          <div className="flex justify-center">
            <ConnectButton />
          </div>
          
          <p className="text-gray-600 text-sm mt-6">
            Powered by Base Sepolia
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              
              <Logo size="small" showText={true} />
            </div>

            <ConnectButton />
          </div>
        </div>
      </header>

      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Create Counter Card */}
          <section 
            className={`relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all ${
              pendingCounter ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {pendingCounter && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lg font-semibold text-gray-900">Creating counter...</p>
                  <p className="text-sm text-gray-600 mt-1">Waiting for confirmation</p>
                </div>
              </div>
            )}
            
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
              <CustomStartDate 
                selectedDate={customStartDate}
                onDateChange={setCustomStartDate}
              />
              
              <button
                onClick={handleQuit}
                disabled={
                  isPending || 
                  isConfirming || 
                  isPendingCustom ||
                  isConfirmingCustom ||
                  pendingCounter !== null
                }
                className="w-full px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-white"
                style={{
                  background: `linear-gradient(to right, ${selectedColor}, ${selectedColor}dd)`,
                }}
              >
                {(isPending || isPendingCustom) ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Confirm in wallet...</span>
                  </div>
                ) : (isConfirming || isConfirmingCustom || pendingCounter) ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'I Quit! 🚀'
                )}
              </button>
            </div>
          </section>

          {/* Counters List */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                Your Counters
                {(displayCounters.length > 0 || pendingCounter) && (
                  <span className="text-base px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-semibold">
                    {displayCounters.length + (pendingCounter ? 1 : 0)}
                  </span>
                )}
              </h2>
            </div>
            
            {(displayCounters.length > 0 || pendingCounter) ? (
              <div className="grid gap-6">
                {pendingCounter && (
                  <PendingCounterCard
                    category={pendingCounter.category}
                    color={pendingCounter.color}
                    customStartDate={pendingCounter.customStartDate}
                  />
                )}
                
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

      <Footer />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmColor={confirmModal.confirmColor}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  )
}

export default App
