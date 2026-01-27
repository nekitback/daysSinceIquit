import { Sun, Moon, Volume2, VolumeX } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useStore } from '../store/useStore'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const soundEnabled = useStore((state) => state.soundEnabled)
  const setSoundEnabled = useStore((state) => state.setSoundEnabled)

  // Global button sounds handle the click sound automatically

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Customize your experience
        </p>
      </div>

      {/* Settings Options */}
      <div className="space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-4 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-800 group min-h-[60px]"
        >
          <div className="flex items-center gap-3">
            {theme === 'light' ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-blue-400" />
            )}
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white">
                Theme
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </p>
            </div>
          </div>
          
          {/* Toggle Switch */}
          <div className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors">
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                theme === 'light' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </div>
        </button>

        {/* Sound Effects Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-full flex items-center justify-between p-4 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-800 group min-h-[60px]"
        >
          <div className="flex items-center gap-3">
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-green-500" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white">
                Sound Effects
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {soundEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
          
          {/* Toggle Switch */}
          <div className={`relative w-14 h-7 rounded-full transition-colors ${
            soundEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
          }`}>
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                soundEnabled ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  )
}