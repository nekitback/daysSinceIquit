export const PRESET_CATEGORIES = [
    { id: 'smoking', label: 'Smoking 🚬', emoji: '🚬' },
    { id: 'alcohol', label: 'Alcohol 🍺', emoji: '🍺' },
    { id: 'sugar', label: 'Sugar 🍰', emoji: '🍰' },
    { id: 'social-media', label: 'Social Media 📱', emoji: '📱' },
    { id: 'gaming', label: 'Gaming 🎮', emoji: '🎮' },
    { id: 'custom', label: 'Custom ✏️', emoji: '✏️' },
  ] as const
  
  export const DEFAULT_COLORS = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // green
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
  ] as const