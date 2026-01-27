import { motion, AnimatePresence } from 'framer-motion'
import { X, BarChart3, TrendingUp, Calendar, Target, RotateCcw, Clock } from 'lucide-react'
import { useGetActiveCounters } from '../hooks/useContract'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface CounterStats {
  id: number
  category: string
  color: string
  currentStreak: number
  longestStreak: number
  totalResets: number
  startedAt: number
  isPaused: boolean
}

// Donut Chart Component
function DonutChart({ data, size = 120 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) return null
  
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  
  let currentOffset = 0
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = item.value / total
          const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`
          const strokeDashoffset = -currentOffset
          currentOffset += circumference * percentage
          
          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{total}</span>
      </div>
    </div>
  )
}

// Bar Chart Component
function BarChart({ data, maxValue }: { data: { label: string; current: number; best: number; color: string }[]; maxValue: number }) {
  if (data.length === 0) return null
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[120px]">
              {item.label}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {item.current}d / {item.best}d
            </span>
          </div>
          <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {/* Best streak (background) */}
            <div
              className="absolute h-full rounded-full opacity-30"
              style={{
                width: `${(item.best / maxValue) * 100}%`,
                backgroundColor: item.color,
              }}
            />
            {/* Current streak (foreground) */}
            <div
              className="absolute h-full rounded-full transition-all duration-500"
              style={{
                width: `${(item.current / maxValue) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Progress Ring Component
function ProgressRing({ progress, size = 80, strokeWidth = 8, color = '#3b82f6' }: { progress: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, subValue, color }: { icon: any; label: string; value: string | number; subValue?: string; color: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
          {subValue && <p className="text-xs text-gray-500 dark:text-gray-400">{subValue}</p>}
        </div>
      </div>
    </div>
  )
}

export default function StatisticsModal({ isOpen, onClose }: Props) {
  const { address } = useAccount()
  const { counters: activeCounters } = useGetActiveCounters()

  // Process counter data
  const stats = useMemo(() => {
    if (!activeCounters || !address) {
      return {
        counters: [] as CounterStats[],
        totalDays: 0,
        totalResets: 0,
        averageStreak: 0,
        longestEver: 0,
        categoryDistribution: [] as { label: string; value: number; color: string }[],
        oldestCounter: null as number | null,
      }
    }

    const [ids, counterData] = activeCounters as [bigint[], any[]]
    const now = Math.floor(Date.now() / 1000)
    
    const counters: CounterStats[] = ids.map((id, index) => {
      const data = counterData[index]
      const startedAt = Number(data.startedAt)
      const pausedAt = Number(data.pausedAt)
      const totalPausedTime = Number(data.totalPausedTime)
      const longestStreak = Number(data.longestStreak)
      
      let currentStreak: number
      if (pausedAt > 0) {
        currentStreak = pausedAt - startedAt - totalPausedTime
      } else {
        currentStreak = now - startedAt - totalPausedTime
      }
      
      // Fix: If longestStreak is 0 (contract bug with custom date), use currentStreak
      const displayLongestStreak = longestStreak > 0 ? longestStreak : currentStreak
      
      return {
        id: Number(id),
        category: data.category,
        color: data.color,
        currentStreak: Math.floor(currentStreak / 86400),
        longestStreak: Math.floor(displayLongestStreak / 86400),
        totalResets: Number(data.totalResets),
        startedAt,
        isPaused: pausedAt > 0,
      }
    })

    // Calculate totals
    const totalDays = counters.reduce((sum, c) => sum + c.currentStreak, 0)
    const totalResets = counters.reduce((sum, c) => sum + c.totalResets, 0)
    const averageStreak = counters.length > 0 ? Math.round(totalDays / counters.length) : 0
    const longestEver = Math.max(...counters.map(c => Math.max(c.currentStreak, c.longestStreak)), 0)
    
    // Category distribution
    const categoryCount: Record<string, { count: number; color: string }> = {}
    counters.forEach(c => {
      if (!categoryCount[c.category]) {
        categoryCount[c.category] = { count: 0, color: c.color }
      }
      categoryCount[c.category].count++
    })
    
    const categoryDistribution = Object.entries(categoryCount).map(([label, data]) => ({
      label,
      value: data.count,
      color: data.color,
    }))

    // Oldest counter
    const oldestCounter = counters.length > 0 
      ? Math.min(...counters.map(c => c.startedAt))
      : null

    return {
      counters,
      totalDays,
      totalResets,
      averageStreak,
      longestEver,
      categoryDistribution,
      oldestCounter,
    }
  }, [activeCounters, address])

  // Next achievement progress
  const nextAchievement = useMemo(() => {
    const milestones = [7, 30, 60, 90, 120, 180, 365]
    const maxStreak = stats.longestEver
    
    const nextMilestone = milestones.find(m => m > maxStreak) || milestones[milestones.length - 1]
    const prevMilestone = milestones.filter(m => m <= maxStreak).pop() || 0
    
    const progress = prevMilestone === nextMilestone 
      ? 100 
      : ((maxStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
    
    return {
      current: maxStreak,
      target: nextMilestone,
      progress: Math.min(100, Math.max(0, progress)),
    }
  }, [stats.longestEver])

  // Bar chart data
  const barChartData = stats.counters.slice(0, 5).map(c => ({
    label: c.category,
    current: c.currentStreak,
    best: c.longestStreak,
    color: c.color,
  }))
  
  const maxBarValue = Math.max(
    ...stats.counters.map(c => Math.max(c.currentStreak, c.longestStreak)),
    1
  )

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

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
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] pointer-events-auto overflow-hidden border border-gray-200 dark:border-gray-700">
              
              {/* Header */}
              <div className="relative overflow-hidden">
                <div
                  className="absolute inset-0 animate-gradient-x block dark:hidden"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(59,130,246,0.25), rgba(255,255,255,0.95), rgba(59,130,246,0.25))',
                    backgroundSize: '300% 100%',
                  }}
                />
                <div
                  className="absolute inset-0 animate-gradient-x hidden dark:block"
                  style={{
                    background: 'linear-gradient(90deg, rgba(17,24,39,0.98), rgba(59,130,246,0.12), rgba(17,24,39,0.98), rgba(59,130,246,0.12))',
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
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Statistics</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your progress overview
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[65vh]">
                
                {stats.counters.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No data yet. Create a counter to see statistics.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Summary Stats */}
                    <section>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Overview
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <StatCard
                          icon={Calendar}
                          label="Total Days Free"
                          value={stats.totalDays}
                          subValue="across all counters"
                          color="bg-green-500"
                        />
                        <StatCard
                          icon={Target}
                          label="Longest Streak"
                          value={`${stats.longestEver}d`}
                          subValue="personal best"
                          color="bg-blue-500"
                        />
                        <StatCard
                          icon={RotateCcw}
                          label="Total Resets"
                          value={stats.totalResets}
                          subValue="keep going!"
                          color="bg-amber-500"
                        />
                        <StatCard
                          icon={Clock}
                          label="Average Streak"
                          value={`${stats.averageStreak}d`}
                          subValue="per counter"
                          color="bg-purple-500"
                        />
                      </div>
                    </section>

                    {/* Next Achievement Progress */}
                    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl p-4 border border-blue-200 dark:border-blue-500/30">
                      <div className="flex items-center gap-4">
                        <ProgressRing 
                          progress={nextAchievement.progress} 
                          color="#3b82f6"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Next Achievement
                          </p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {nextAchievement.target} days
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {nextAchievement.target - nextAchievement.current} days to go
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Category Distribution */}
                    {stats.categoryDistribution.length > 1 && (
                      <section>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Counters by Category
                        </h3>
                        <div className="flex items-center gap-6">
                          <DonutChart data={stats.categoryDistribution} />
                          <div className="flex-1 space-y-2">
                            {stats.categoryDistribution.map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                  {item.label}
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {item.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Streak Comparison */}
                    <section>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Current vs Best Streak
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <BarChart data={barChartData} maxValue={maxBarValue} />
                        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-gray-600 dark:text-gray-400">Current</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500 opacity-30" />
                            <span className="text-gray-600 dark:text-gray-400">Best</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Timeline */}
                    {stats.oldestCounter && (
                      <section>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Your Journey
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Started tracking</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {formatDate(stats.oldestCounter)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Active counters</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {stats.counters.length}
                              </p>
                            </div>
                          </div>
                          
                          {/* Mini timeline */}
                          <div className="mt-4 relative">
                            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300 dark:bg-gray-600 -translate-y-1/2" />
                            <div className="flex justify-between relative">
                              {stats.counters.slice(0, 5).map((counter) => (
                                <div 
                                  key={counter.id}
                                  className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-900"
                                  style={{ backgroundColor: counter.color }}
                                  title={`${counter.category}: ${formatDate(counter.startedAt)}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </section>
                    )}
                  </>
                )}
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
