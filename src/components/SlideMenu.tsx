import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { formatAddress } from '../utils/formatAddress'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, Settings, LogOut, Heart, AlertCircle } from 'lucide-react'
import DonationModal from './DonationModal'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SlideMenu({ isOpen, onClose }: Props) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const [showDonation, setShowDonation] = useState(false)

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
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl transition-colors">
                  <Info className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">About</span>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Settings</span>
                </button>

                {/* Support Button */}
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

      {/* Donation Modal */}
      <DonationModal isOpen={showDonation} onClose={() => setShowDonation(false)} />
    </>
  )
}