import { useStore } from '../store/useStore'

const COLORS = [
  { id: 'blue', value: '#3b82f6', label: 'Blue' },
  { id: 'purple', value: '#8b5cf6', label: 'Purple' },
  { id: 'pink', value: '#ec4899', label: 'Pink' },
  { id: 'red', value: '#ef4444', label: 'Red' },
  { id: 'orange', value: '#f97316', label: 'Orange' },
  { id: 'green', value: '#10b981', label: 'Green' },
  { id: 'teal', value: '#14b8a6', label: 'Teal' },
  { id: 'cyan', value: '#06b6d4', label: 'Cyan' },
]

export default function ColorPicker() {
  const { selectedColor, setSelectedColor } = useStore()

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-300">
        Choose a Color
      </label>
      <div className="grid grid-cols-4 gap-3">
        {COLORS.map((color) => (
          <button
            key={color.id}
            onClick={() => setSelectedColor(color.value)}
            className={`group relative h-12 rounded-xl transition-all ${
              selectedColor === color.value
                ? 'ring-2 ring-offset-2 ring-offset-gray-900 scale-105'
                : 'hover:scale-105 bg-gray-800/50 border border-gray-700'
            }`}
            style={{
              background: selectedColor === color.value 
                ? `linear-gradient(135deg, ${color.value}, ${color.value}dd)`
                : undefined,
              ringColor: selectedColor === color.value ? color.value : undefined,
            }}
          >
            {selectedColor !== color.value && (
              <div 
                className="absolute inset-0 rounded-xl opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${color.value}44, ${color.value}22)`,
                }}
              />
            )}
            <span className={`relative text-xs font-medium ${
              selectedColor === color.value ? 'text-white' : 'text-gray-400'
            }`}>
              {color.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}