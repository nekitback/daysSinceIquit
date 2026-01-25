import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Shield, TrendingUp, Users } from 'lucide-react'
import StarfieldBackground from './StarfieldBackground'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto"
          >
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full pointer-events-auto overflow-hidden my-8 border border-gray-700">
              {/* Cosmos */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <StarfieldBackground />
              </div>

              {/* Content */}
              <div className="relative" style={{ zIndex: 2 }}>
                {/* Header */}
                <div className="bg-gray-900/80 backdrop-blur-md border-t border-gray-800 -sm px-6 py-8 text-white relative border-b border-blue-500/30">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-4 mb-2">
                    {/* Logo */}
                    <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <img 
                        src="/Logo.png" 
                        alt="Days Since I Quit Logo" 
                        className="w-full h-full"
                        style={{
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">About Days Since I Quit</h2>
                      <p className="text-blue-100">Your journey, permanently on-chain</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* What is this */}
                  <section>
                    <h3 className="text-xl font-bold text-white mb-3">What is this?</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Days Since I Quit is a <strong className="text-blue-400">Web3 application</strong> built on <strong className="text-blue-400">Base</strong> that helps you track your journey of breaking free from bad habits. Unlike traditional apps, your progress is stored <strong className="text-blue-400">permanently on the blockchain</strong> - no company can delete it, no server can lose it, and it's truly yours forever.
                    </p>
                  </section>

                  {/* Our Values */}
                  <section>
                    <h3 className="text-xl font-bold text-white mb-4">Our Values</h3>
                    <div className="grid gap-4">
                      <div className="flex gap-3 items-start p-4 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-500/30">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white mb-1">Progress, Not Perfection</h4>
                          <p className="text-sm text-gray-300">
                            A reset doesn't mean failure. Every attempt is progress. Your longest streak is always saved, reminding you that you've done it before and can do it again.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start p-4 bg-purple-500/10 backdrop-blur-sm rounded-xl border border-purple-500/30">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white mb-1">True Ownership</h4>
                          <p className="text-sm text-gray-300">
                            Your data lives on the blockchain. You own your journey completely - no intermediaries, no data harvesting, no subscription fees to access your own history.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start p-4 bg-green-500/10 backdrop-blur-sm rounded-xl border border-green-500/30">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white mb-1">Transparent & Permanent</h4>
                          <p className="text-sm text-gray-300">
                            Every milestone is written to the blockchain. Your achievements are cryptographically verified and can never be lost or manipulated.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start p-4 bg-amber-500/10 backdrop-blur-sm rounded-xl border border-amber-500/30">
                        <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white mb-1">Community-Driven</h4>
                          <p className="text-sm text-gray-300">
                            Built for the Base community, by the Base community. Share your wins, support others, and grow together on-chain.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Why Web3 */}
                  <section className="p-5 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-500/30">
                    <h3 className="text-lg font-bold text-white mb-3">Why Web3?</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold mt-0.5">✓</span>
                        <span><strong className="text-white">No central authority:</strong> Your data can't be censored or deleted</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold mt-0.5">✓</span>
                        <span><strong className="text-white">Permanent record:</strong> Your achievements live forever on Base</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold mt-0.5">✓</span>
                        <span><strong className="text-white">Full transparency:</strong> You can verify everything on the blockchain</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold mt-0.5">✓</span>
                        <span><strong className="text-white">True ownership:</strong> Connect your wallet, own your journey</span>
                      </li>
                    </ul>
                  </section>

                  {/* Remember */}
                  <section className="p-5 bg-pink-500/10 backdrop-blur-sm rounded-xl border-2 border-pink-500/30">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-400" fill="currentColor" />
                      Remember
                    </h3>
                    <p className="text-gray-200 leading-relaxed italic">
                      "Every day is a new beginning. A reset isn't failure - it's proof you're still fighting. 
                      Your longest streak shows what you're capable of. Keep going. The blockchain never forgets your victories." 💪
                    </p>
                  </section>

                  {/* Built on Base */}
                  <section className="text-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
                    <p className="text-sm text-gray-400">
                      Built with ❤️ on <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-400 hover:text-blue-300">Base</a>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Smart contract deployed on Base
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}