import { useState, useEffect } from 'react'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { Menu, ExternalLink, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet'
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
import WelcomeModal from './components/WelcomeModal'
import { useTheme, applyTheme } from './hooks/useTheme'
import SunRaysBackground from './components/SunRaysBackground'
import StarfieldBackground from './components/StarfieldBackground'
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
import { useStore } from './store/useStore'
import { useSound, useGlobalButtonSounds } from './hooks/useSound'
import type { Counter } from './types'

type PendingTx = {
  hash: `0x${string}`
  type: 'create' | 'pause' | 'resume' | 'reset' | 'delete'
  counterId?: number
  category?: string
  color?: string
  customStartDate?: number | null
}

function App() {
  const { isConnected, address } = useAccount()

  const { theme } = useTheme()
  
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const [menuOpen, setMenuOpen] = useState(false)
  const { 
    selectedColor, 
    selectedCategory, 
    customName,
    addCustomDateCounter,
  } = useStore()
  const { play: playSound } = useSound()
  
  // Enable click sounds on ALL buttons globally
  useGlobalButtonSounds()

  const { startCounter, isPending } = useStartCounter()

  const { 
    startCounterWithCustomTime, 
    isPending: isPendingCustom, 
  } = useStartCounterWithCustomTime()

  const { resetCounter } = useResetCounter()
  const { pauseCounter } = usePauseCounter()
  const { resumeCounter } = useResumeCounter()
  const { deleteCounter } = useDeleteCounter()
  const { counters: activeCounters, refetch } = useGetActiveCounters()

  const [pendingTxs, setPendingTxs] = useState<PendingTx[]>([])
  const [displayCounters, setDisplayCounters] = useState<Counter[]>([])
  const [customStartDate, setCustomStartDate] = useState<number | null>(null)

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

  const [toast, setToast] = useState<{
    isOpen: boolean
    message: string
    type: 'success' | 'error' | 'info'
  }>({
    isOpen: false,
    message: '',
    type: 'success',
  })

  // Welcome modal - show on first visit
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Check if user has seen the welcome modal
    const hasSeenWelcome = localStorage.getItem('dsiq-welcome-seen')
    if (!hasSeenWelcome && isConnected) {
      setShowWelcome(true)
    }
  }, [isConnected])

  const handleCloseWelcome = () => {
    setShowWelcome(false)
    localStorage.setItem('dsiq-welcome-seen', 'true')
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ isOpen: true, message, type })
    // Play sound based on toast type
    if (type === 'success') playSound('success')
    else if (type === 'error') playSound('error')
  }

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
    
    // Process pending custom date counters
    const pendingCustomDates = JSON.parse(localStorage.getItem('dsiq-pending-custom-dates') || '[]') as number[]
    if (pendingCustomDates.length > 0) {
      const remainingPending: number[] = []
      
      pendingCustomDates.forEach((customDate) => {
        // Find counter with matching startedAt
        const matchingCounter = merged.find(c => c.startedAt === customDate)
        if (matchingCounter) {
          // Mark this counter as created with custom date
          addCustomDateCounter(matchingCounter.id)
        } else {
          // Keep in pending if not found yet
          remainingPending.push(customDate)
        }
      })
      
      // Update localStorage with remaining pending
      if (remainingPending.length > 0) {
        localStorage.setItem('dsiq-pending-custom-dates', JSON.stringify(remainingPending))
      } else {
        localStorage.removeItem('dsiq-pending-custom-dates')
      }
    }
  }, [activeCounters, address, addCustomDateCounter])

  useEffect(() => {
    if (!isConnected) {
      setCustomStartDate(null)
      setDisplayCounters([])
      setPendingTxs([])
    }
  }, [isConnected])

  const checkDuplicateCategory = (categoryName: string): boolean => {
    const normalizedNew = categoryName.toLowerCase().trim()
    
    const hasDuplicate = displayCounters.some(counter => 
      counter.category.toLowerCase().trim() === normalizedNew
    )
    
    const hasPendingDuplicate = pendingTxs.some(tx => 
      tx.type === 'create' && tx.category?.toLowerCase().trim() === normalizedNew
    )
    
    return hasDuplicate || hasPendingDuplicate
  }

  const handleQuit = async () => {
    if (selectedCategory === 'custom' && !customName.trim()) {
      showToast('Please enter a custom habit name', 'error')
      return
    }

    const category = PRESET_CATEGORIES.find(c => c.id === selectedCategory)
    const categoryName = selectedCategory === 'custom' 
      ? customName 
      : category?.label.replace(/[🚬🍺🍰📱🎮✏️]/g, '').trim() || 'Unknown'

    if (checkDuplicateCategory(categoryName)) {
      showToast(`❌ You already have a "${categoryName}" counter`, 'error')
      return
    }

    try {
      let hash: `0x${string}` | undefined
      
      if (customStartDate) {
        hash = await startCounterWithCustomTime(categoryName, selectedColor, customStartDate)
      } else {
        hash = await startCounter(categoryName, selectedColor)
      }
      
      if (hash) {
        setPendingTxs(prev => [...prev, {
          hash,
          type: 'create',
          category: categoryName,
          color: selectedColor,
          customStartDate: customStartDate
        }])
      }
      
      setCustomStartDate(null)

    } catch (error: any) {
      if (error.code === 4001 || error.message?.includes('User rejected')) {
        showToast('Transaction cancelled', 'info')
      } else if (error.message?.includes('insufficient funds')) {
        showToast('❌ Insufficient funds', 'error')
      } else {
        showToast('❌ Transaction failed', 'error')
      }
    }
  }

  const handleReset = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Counter?',
      message: "Your current streak will be saved if it's your longest!",
      confirmColor: 'red',
      onConfirm: async () => {
        try {
          const hash = await resetCounter(id)
          
          if (hash) {
            setPendingTxs(prev => [...prev, {
              hash,
              type: 'reset',
              counterId: id
            }])
          }
        } catch (error: any) {
          if (error.code === 4001 || error.message?.includes('User rejected')) {
            showToast('Reset cancelled', 'info')
          } else {
            showToast('❌ Reset failed', 'error')
          }
        }
      },
    })
  }

  const handlePause = async (id: number) => {
    try {
      const hash = await pauseCounter(id)
      
      if (hash) {
        setPendingTxs(prev => [...prev, {
          hash,
          type: 'pause',
          counterId: id
        }])
      }
    } catch (error: any) {
      if (error.code === 4001 || error.message?.includes('User rejected')) {
        showToast('Pause cancelled', 'info')
      } else {
        showToast('❌ Pause failed', 'error')
      }
    }
  }

  const handleResume = async (id: number) => {
    try {
      const hash = await resumeCounter(id)
      
      if (hash) {
        setPendingTxs(prev => [...prev, {
          hash,
          type: 'resume',
          counterId: id
        }])
      }
    } catch (error: any) {
      if (error.code === 4001 || error.message?.includes('User rejected')) {
        showToast('Resume cancelled', 'info')
      } else {
        showToast('❌ Resume failed', 'error')
      }
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
          const hash = await deleteCounter(id)
          
          if (hash) {
            setDisplayCounters(prev => prev.filter(c => c.id !== id))
            
            setPendingTxs(prev => [...prev, {
              hash,
              type: 'delete',
              counterId: id
            }])
          }
        } catch (error: any) {
          if (error.code === 4001 || error.message?.includes('User rejected')) {
            showToast('Delete cancelled', 'info')
          } else {
            showToast('❌ Delete failed', 'error')
          }
        }
      },
    })
  }

  const PendingTransaction = ({ tx }: { tx: PendingTx }) => {
    const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
      hash: tx.hash,
    })

    useEffect(() => {
      if (isSuccess) {
        // If this was a create with custom date, mark the counter as ineligible for achievements
        if (tx.type === 'create' && tx.customStartDate) {
          // After refetch, find the counter with matching startedAt and mark it
          refetch().then(() => {
            // We need to find the newly created counter by its startedAt matching customStartDate
            // This will be handled by watching activeCounters changes
            const pendingCustomDate = tx.customStartDate
            if (pendingCustomDate) {
              // Store in localStorage for post-refetch processing
              const pending = JSON.parse(localStorage.getItem('dsiq-pending-custom-dates') || '[]')
              pending.push(pendingCustomDate)
              localStorage.setItem('dsiq-pending-custom-dates', JSON.stringify(pending))
            }
          })
        } else {
          refetch()
        }
        
        setPendingTxs(prev => prev.filter(t => t.hash !== tx.hash))
        
        if (tx.type === 'create') {
          showToast('✅ Counter created!', 'success')
        } else if (tx.type === 'delete') {
          showToast('✅ Counter deleted!', 'success')
        } else if (tx.type === 'pause') {
          showToast('✅ Counter paused!', 'success')
        } else if (tx.type === 'resume') {
          showToast('✅ Counter resumed!', 'success')
        } else if (tx.type === 'reset') {
          showToast('✅ Counter reset!', 'success')
        }
      }
      
      if (isError) {
        console.error('Transaction failed:', tx.hash)
        setPendingTxs(prev => prev.filter(t => t.hash !== tx.hash))
        showToast('❌ Transaction failed', 'error')
        
        if (tx.type === 'delete' && tx.counterId !== undefined) {
          refetch()
        }
      }
    }, [isSuccess, isError])

    if (tx.type === 'create') {
      return (
        <PendingCounterCard
          category={tx.category!}
          color={tx.color!}
          customStartDate={tx.customStartDate ?? null}
          txHash={tx.hash}
          status={isLoading ? 'pending' : isSuccess ? 'success' : isError ? 'error' : 'pending'}
        />
      )
    }

    const counter = displayCounters.find(c => c.id === tx.counterId)
    if (!counter) return null

    return (
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
        {isLoading && <Loader2 className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-spin flex-shrink-0" />}
        {isSuccess && <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />}
        {isError && <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />}
        
        <div className="flex-1">
          <p className="font-semibold text-gray-900 dark:text-white">
            {tx.type === 'pause' && 'Pausing counter...'}
            {tx.type === 'resume' && 'Resuming counter...'}
            {tx.type === 'reset' && 'Resetting counter...'}
            {tx.type === 'delete' && 'Deleting counter...'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            {counter.category}
          </p>
        </div>
        
        <a
          href={`https://basescan.org/tx/${tx.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 text-sm font-medium min-h-[44px] px-2"
        >
          View
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-100 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center px-4 relative overflow-hidden">
        <StarfieldBackground />
        {theme === 'light' && <SunRaysBackground />}
        <div className="text-center max-w-md w-full relative" style={{ zIndex: 10 }}>
          <div className="flex justify-center mb-8">
            <Logo size="large" showText={false} />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Days Since I Quit
          </h1>
          <p className="text-gray-700 dark:text-gray-400 mb-8 text-lg">
            Track your journey onchain.<br />
            Built on <span className="text-blue-500 font-semibold">Base</span>.
          </p>
          
          <div className="flex justify-center">
            <Wallet>
              <ConnectWallet className="!px-6 !py-3 !text-lg !font-semibold !rounded-xl" />
            </Wallet>
          </div>
          
          <p className="text-gray-500 dark:text-gray-600 text-sm mt-6">
            Powered by Base
          </p>
        </div>
      </div>
    )
  }

  const createPendingTx = pendingTxs.find(tx => tx.type === 'create')
  const operationPendingTxs = pendingTxs.filter(tx => tx.type !== 'create')

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-100 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center px-4 relative overflow-hidden">
      <StarfieldBackground /> 
      {theme === 'light' && <SunRaysBackground />}
      
      <div className="relative" style={{ zIndex: 10 }}>
        <header className="relative sticky top-0 z-30 overflow-hidden">
          {/* Animated gradient background - Light theme */}
          <div 
            className="absolute inset-0 animate-gradient-x block dark:hidden"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(59,130,246,0.25), rgba(255,255,255,0.95), rgba(59,130,246,0.25))',
              backgroundSize: '300% 100%',
            }}
          />
          {/* Animated gradient background - Dark theme */}
          <div 
            className="absolute inset-0 animate-gradient-x hidden dark:block"
            style={{
              background: 'linear-gradient(90deg, rgba(17,24,39,0.98), rgba(59,130,246,0.12), rgba(17,24,39,0.98), rgba(59,130,246,0.12))',
              backgroundSize: '300% 100%',
            }}
          />
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <button
                onClick={() => setMenuOpen(true)}
                className="p-3 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>

              {/* Center - можно добавить статистику */}
              <div className="flex-1" />

              <div className="w-10" /> {/* Spacer for balance */}
            </div>
          </div>
        </header>

        <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <section 
              className={`relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all ${
                createPendingTx ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div 
                className="px-8 py-6 transition-colors duration-300"
                style={{ 
                  background: `linear-gradient(to right, ${selectedColor}22, transparent)`,
                  borderBottom: `2px solid ${selectedColor}44`
                }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
                  Start a New Counter
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
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
                    isPendingCustom ||
                    createPendingTx !== undefined
                  }
                  className="w-full px-6 min-h-[52px] rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-white"
                  style={{
                    background: `linear-gradient(to right, ${selectedColor}, ${selectedColor}dd)`,
                  }}
                >
                  {(isPending || isPendingCustom) ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Confirm in wallet...</span>
                    </div>
                  ) : createPendingTx ? (
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

            {operationPendingTxs.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Transactions</h3>
                {operationPendingTxs.map(tx => (
                  <PendingTransaction key={tx.hash} tx={tx} />
                ))}
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  Your Counters
                  {(displayCounters.length > 0 || createPendingTx) && (
                    <span className="text-base px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full font-semibold border border-blue-500/30">
                      {displayCounters.length + (createPendingTx ? 1 : 0)}
                    </span>
                  )}
                </h2>
              </div>
              
              {(displayCounters.length > 0 || createPendingTx) ? (
                <div className="grid gap-6">
                  {createPendingTx && (
                    <PendingTransaction tx={createPendingTx} />
                  )}
                  
                  {displayCounters.map((counter) => {
                    const hasPendingOp = operationPendingTxs.some(tx => tx.counterId === counter.id)
                    
                    return (
                      <CounterCard 
                        key={counter.id} 
                        counter={counter}
                        isLoading={hasPendingOp}
                        onReset={handleReset}
                        onPause={handlePause}
                        onResume={handleResume}
                        onDelete={handleDelete}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No counters yet
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start your journey by creating your first counter!
                  </p>
                </div>
              )}
            </section>
          </div>
        </main>

        <Footer />
      </div>

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

      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleCloseWelcome}
      />
    </div>
  )
}

export default App