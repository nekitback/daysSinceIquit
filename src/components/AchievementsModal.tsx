import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Lock, Info } from 'lucide-react'
import { useGetActiveCounters } from '../hooks/useContract'
import { useStore } from '../store/useStore'
import { useAccount } from 'wagmi'

interface Props {
  isOpen: boolean
  onClose: () => void
}

// Achievement milestones in days
const ACHIEVEMENTS = [
  { days: 7, title: '1 Week', description: 'First week completed!' },
  { days: 30, title: '1 Month', description: 'One month strong!' },
  { days: 60, title: '2 Months', description: 'Two months of progress!' },
  { days: 90, title: '3 Months', description: 'Quarter year milestone!' },
  { days: 120, title: '4 Months', description: 'Four months achieved!' },
  { days: 180, title: '6 Months', description: 'Half year champion!' },
  { days: 365, title: '1 Year', description: 'One year free! Legend!' },
]

export default function AchievementsModal({ isOpen, onClose }: Props) {
  const { address } = useAccount()
  const { counters: activeCounters } = useGetActiveCounters()
  const customDateCounterIds = useStore((state) => state.customDateCounterIds)

  // Calculate unlocked achievements based on eligible counters
  const getUnlockedDays = (): Set<number> => {
    const unlocked = new Set<number>()
    
    if (!activeCounters || !address) return unlocked
    
    const [ids, counterData] = activeCounters as [bigint[], any[]]
    
    ids.forEach((id, index) => {
      const counterId = Number(id)
      const data = counterData[index]
      
      // Skip counters created with custom date
      if (customDateCounterIds.includes(counterId)) return
      
      // Skip inactive counters
      if (!data.active) return
      
      // Calculate current streak in days
      const startedAt = Number(data.startedAt)
      const pausedAt = Number(data.pausedAt)
      const totalPausedTime = Number(data.totalPausedTime)
      const longestStreak = Number(data.longestStreak)
      
      const now = Math.floor(Date.now() / 1000)
      let currentStreak: number
      
      if (pausedAt > 0) {
        // Counter is paused
        currentStreak = pausedAt - startedAt - totalPausedTime
      } else {
        // Counter is running
        currentStreak = now - startedAt - totalPausedTime
      }
      
      const currentDays = Math.floor(currentStreak / 86400) // seconds to days
      const longestDays = Math.floor(longestStreak / 86400)
      
      // Use the maximum of current and longest streak
      const maxDays = Math.max(currentDays, longestDays)
      
      // Check each achievement
      ACHIEVEMENTS.forEach((achievement) => {
        if (maxDays >= achievement.days) {
          unlocked.add(achievement.days)
        }
      })
    })
    
    return unlocked
  }

  const unlockedDays = getUnlockedDays()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] pointer-events-auto overflow-hidden border border-gray-200 dark:border-gray-700">
              
              {/* Header */}
              <div className="relative overflow-hidden">
                <div
                  className="absolute inset-0 animate-gradient-x block dark:hidden"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(251,191,36,0.25), rgba(255,255,255,0.95), rgba(251,191,36,0.25))',
                    backgroundSize: '300% 100%',
                  }}
                />
                <div
                  className="absolute inset-0 animate-gradient-x hidden dark:block"
                  style={{
                    background: 'linear-gradient(90deg, rgba(17,24,39,0.98), rgba(251,191,36,0.12), rgba(17,24,39,0.98), rgba(251,191,36,0.12))',
                    backgroundSize: '300% 100%',
                  }}
                />

                <div className="relative px-6 py-5">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {unlockedDays.size} / {ACHIEVEMENTS.length} unlocked
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
                {/* Achievement Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = unlockedDays.has(achievement.days)
                    
                    return (
                      <div
                        key={achievement.days}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10 border-amber-300 dark:border-amber-500/50'
                            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
                        }`}
                      >
                        {/* Badge Image */}
                        <div className="flex justify-center mb-2">
                          <div className={`relative w-16 h-16 ${!isUnlocked ? 'grayscale' : ''}`}>
                            <img
                              src={`/badges/badge_${achievement.days}.png`}
                              alt={achievement.title}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                // Fallback if image doesn't exist
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                target.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                            {/* Fallback icon */}
                            <div className={`hidden absolute inset-0 flex items-center justify-center rounded-full ${
                              isUnlocked 
                                ? 'bg-gradient-to-br from-amber-400 to-yellow-500' 
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}>
                              {isUnlocked ? (
                                <Trophy className="w-8 h-8 text-white" />
                              ) : (
                                <Lock className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          {/* Lock overlay for locked achievements */}
                          {!isUnlocked && (
                            <div className="absolute top-4 right-4">
                              <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Text */}
                        <div className="text-center">
                          <p className={`font-bold text-sm ${
                            isUnlocked 
                              ? 'text-amber-700 dark:text-amber-400' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {achievement.title}
                          </p>
                          <p className={`text-xs mt-0.5 ${
                            isUnlocked 
                              ? 'text-amber-600 dark:text-amber-300' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {achievement.days} days
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Info Notice */}
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">
                        How achievements work
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-200/80 leading-relaxed">
                        Achievements are only awarded for counters created <strong>without a custom start date</strong>. 
                        This ensures that badges represent real progress made since you started tracking in the app.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
