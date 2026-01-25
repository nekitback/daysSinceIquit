import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { formatAddress } from '../utils/formatAddress'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, Settings, LogOut, Heart, AlertCircle, ExternalLink, MessageCircle } from 'lucide-react'
import DonationModal from './DonationModal'
import AboutModal from './AboutModal'
import Toast from './Toast'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SlideMenu({ isOpen, onClose }: Props) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const [showDonation, setShowDonation] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  
  const [toast, setToast] = useState<{
    isOpen: boolean
    message: string
    type: 'success' | 'error' | 'info'
  }>({
    isOpen: false,
    message: '',
    type: 'success',
  })

  const handleDonationSuccess = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      isOpen: true,
      message,
      type
    })
  }

  const baseProfileUrl = 'https://base.app/profile/0x585207f9B4C1FB59c5FC819411E0aCC60BdfFe69'

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 shadow-2xl flex flex-col border-r border-gray-700"
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Menu</h2>
                  <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-300" />
                  </button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                  <p className="text-xs font-medium text-gray-400 mb-1">Wallet</p>
                  <p className="text-sm font-mono font-bold text-blue-400">
                    {formatAddress(address || '')}
                  </p>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {/* About Button */}
                <button
                  onClick={() => {
                    setShowAbout(true)
                    onClose()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <Info className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-200">About</span>
                </button>
                
                {/* Settings Button */}
                <button
                  onClick={() => {
                    onClose()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-xl transition-colors opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-200">Settings</span>
                  <span className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded text-gray-400">Soon</span>
                </button>

                {/* Support Section */}
                <div className="pt-4 mt-4 border-t border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 mb-3 px-4">SUPPORT</p>
                  
                  {/* Donate Button */}
                  <button
                    onClick={() => {
                      setShowDonation(true)
                      onClose()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-500/20 to-red-500/20 hover:from-pink-500/30 hover:to-red-500/30 border-2 border-pink-500/30 rounded-xl transition-all group"
                  >
                    <Heart className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-pink-300">Support the Project</span>
                  </button>

                  {/* Contact on Base */}
                  <a
                    href={baseProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 px-4 py-3 mt-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all group"
                  >
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-blue-300 flex items-center gap-1">
                        Contact me on Base
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-blue-400">nba0x.base.eth</p>
                    </div>
                  </a>
                </div>

                {/* Medical Disclaimer */}
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-yellow-300 mb-1">
                        Medical Disclaimer
                      </p>
                      <p className="text-xs text-yellow-200/80 leading-relaxed">
                        This app is for tracking purposes only and does not provide medical advice. 
                        Consult healthcare professionals for addiction treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </nav>

              <div className="p-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    disconnect()
                    onClose()
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-semibold transition-colors border border-red-500/30"
                >
                  <LogOut className="w-5 h-5" />
                  Disconnect
                </button>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  Built on <span className="font-semibold text-blue-400">Base</span> 
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <DonationModal 
        isOpen={showDonation} 
        onClose={() => setShowDonation(false)}
        onDonationSuccess={handleDonationSuccess}
      />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </>
  )
}

