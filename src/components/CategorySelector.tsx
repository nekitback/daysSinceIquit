import { useStore } from '../store/useStore'
import { PRESET_CATEGORIES } from '../constants/categories'

export default function CategorySelector() {
  const { selectedCategory, setSelectedCategory, customName, setCustomName } = useStore()

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-300">
        What are you quitting?
      </label>
      <div className="grid grid-cols-2 gap-3">
        {PRESET_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 min-h-[48px] rounded-xl font-medium transition-all flex items-center justify-center ${
              selectedCategory === category.id
                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-2 border-blue-500/50 ring-2 ring-blue-500/30'
                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {selectedCategory === 'custom' && (
        <div className="mt-4">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            maxLength={30}
            placeholder="Enter habit name..."
            className="w-full px-4 min-h-[48px] bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
           <p className="text-xs text-gray-600 dark:text-blue-400 mt-2">
            {customName.length}/30 characters
          </p>
        </div>
      )}
    </div>
  )
}