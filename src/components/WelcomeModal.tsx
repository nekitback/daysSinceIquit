import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Zap, Trophy, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

type SlideData = {
  icon?: typeof Shield
  useLogo?: boolean
  iconBg: string
  title: string
  subtitle: string
  description: string
  highlight: string
}

const slides: SlideData[] = [
  {
    useLogo: true,
    iconBg: '',
    title: 'Welcome to Days Since I Quit',
    subtitle: 'Track your journey. Break free from bad habits.',
    description: 'Create counters for habits you want to quit — smoking, alcohol, sugar, social media, or anything else. Watch your progress grow day by day.',
    highlight: 'Your progress is stored permanently on the blockchain.',
  },
  {
    icon: Shield,
    iconBg: 'bg-purple-500',
    title: 'Why Blockchain?',
    subtitle: "Your data, your rules.",
    description: "Unlike traditional apps, your progress can't be deleted, lost, or manipulated. No company controls your data — it's truly yours forever.",
    highlight: 'No accounts. No passwords. Just connect your wallet.',
  },
  {
    icon: Zap,
    iconBg: 'bg-blue-500',
    title: 'Built on Base',
    subtitle: 'Fast, secure, seamless.',
    description: 'Powered by Base — the fastest Ethereum L2. Your actions confirm in seconds with a smooth, gas-optimized experience.',
    highlight: 'The future of apps, today.',
  },
  {
    icon: Trophy,
    iconBg: 'bg-amber-500',
    title: "Ready to Start?",
    subtitle: 'Every journey begins with day one.',
    description: 'Create your first counter and start tracking. Reset if you slip — your longest streak is always saved to remind you what you\'re capable of.',
    highlight: 'Progress, not perfection. 💪',
  },
]

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const isLastSlide = currentSlide === slides.length - 1
  const slide = slides[currentSlide]
  const Icon = slide.icon || null

  const handleNext = () => {
    if (isLastSlide) {
      onClose()
    } else {
      setCurrentSlide(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    onClose()
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
            className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Skip button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8 pt-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="text-center"
                  >
                    {/* Icon or Logo */}
                    {slide.useLogo ? (
                      <div className="w-20 h-20 mx-auto mb-6">
                        <img 
                          src="/Logo.png" 
                          alt="Days Since I Quit" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : Icon ? (
                      <div className={`w-16 h-16 ${slide.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    ) : null}

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {slide.title}
                    </h2>
                    
                    {/* Subtitle */}
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                      {slide.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {slide.description}
                    </p>

                    {/* Highlight */}
                    <div className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/30">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {slide.highlight}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-8 pb-8">
                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-6">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'w-6 bg-blue-500' 
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  {!isLastSlide && (
                    <button
                      onClick={handleSkip}
                      className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Skip
                    </button>
                  )}
                  
                  <button
                    onClick={handleNext}
                    className={`flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                      isLastSlide ? 'w-full' : ''
                    }`}
                  >
                    {isLastSlide ? (
                      "Let's Go!"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
