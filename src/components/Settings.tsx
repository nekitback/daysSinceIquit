import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

interface Props {
  onClose: () => void
}

export default function Settings({ onClose }: Props) {
  const { theme, toggleTheme } = useTheme()

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
          className="w-full flex items-center justify-between p-4 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-800 group"
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

        {/* More settings can be added here */}
      </div>
    </div>
  )
}