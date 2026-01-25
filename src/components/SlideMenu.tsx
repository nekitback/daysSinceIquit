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
              className="fixed inset-0 bg-black/40 z-40"
            />

            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs font-medium text-gray-600 mb-1">Wallet</p>
                  <p className="text-sm font-mono font-bold text-blue-600">
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
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Info className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">About</span>
                </button>
                
                {/* Settings Button - TODO: Add functionality later */}
                <button
                  onClick={() => {
                    // TODO: Add settings modal in next phase
                    onClose()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl transition-colors opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Settings</span>
                  <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded">Soon</span>
                </button>

                {/* Support Section */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-3 px-4">SUPPORT</p>
                  
                  {/* Donate Button */}
                  <button
                    onClick={() => {
                      setShowDonation(true)
                      onClose()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-50 to-red-50 hover:from-pink-100 hover:to-red-100 border-2 border-pink-200 rounded-xl transition-all group"
                  >
                    <Heart className="w-5 h-5 text-pink-600 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-pink-700">Support the Project</span>
                  </button>

                  {/* Contact on Base */}
                  <a
                    href={baseProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 px-4 py-3 mt-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all group"
                  >
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-blue-700 flex items-center gap-1">
                        Contact me on Base
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-blue-600">nba0x.base.eth</p>
                    </div>
                  </a>
                </div>

                {/* Medical Disclaimer */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-yellow-900 mb-1">
                        Medical Disclaimer
                      </p>
                      <p className="text-xs text-yellow-800 leading-relaxed">
                        This app is for tracking purposes only and does not provide medical advice. 
                        Consult healthcare professionals for addiction treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </nav>

              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    disconnect()
                    onClose()
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Disconnect
                </button>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  Built on <span className="font-semibold text-blue-600">Base</span> Sepolia
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
      
      {/* TOAST */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </>
  )
}

