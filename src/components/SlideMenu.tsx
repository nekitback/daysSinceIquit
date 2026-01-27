import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, Settings, LogOut, Heart, AlertCircle, ExternalLink, MessageCircle, ChevronRight } from 'lucide-react'
import DonationModal from './DonationModal'
import AboutModal from './AboutModal'
import Toast from './Toast'
import SettingsComponent from './Settings'
import { Identity, Name, Avatar, Badge } from '@coinbase/onchainkit/identity'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SlideMenu({ isOpen, onClose }: Props) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const [showDonation, setShowDonation] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  
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
              className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
            />

            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 z-50 shadow-2xl"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                {/* User Identity Card - OnchainKit */}
                {address && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4">
                    <Identity
                      address={address}
                      schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                      className="!bg-transparent !p-0 !gap-3"
                    >
                      <Avatar className="!w-12 !h-12 !rounded-full !border-2 !border-blue-300 dark:!border-blue-500" />
                      <div className="flex flex-col min-w-0">
                        <Name className="!font-bold !text-gray-900 dark:!text-white !text-base truncate">
                          <Badge />
                        </Name>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                          {address.slice(0, 6)}...{address.slice(-4)}
                        </p>
                        <a 
                          href="https://www.base.org/names" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                        >
                          Get your Basename
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </Identity>
                  </div>
                )}
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {/* About Button */}
                <button
                  onClick={() => {
                    setShowAbout(true)
                    onClose()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <Info className="w-5 h-5 text-gray-700 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-200">About</span>
                </button>
                
                {/* Settings Button */}
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-blue-500" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">Settings</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Theme & preferences</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </button>

                {/* Support Section */}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 mb-3 px-4">SUPPORT</p>
                  
                  {/* Donate Button */}
                  <button
                    onClick={() => {
                      setShowDonation(true)
                      onClose()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-100 to-red-100 dark:from-pink-500/20 dark:to-red-500/20 hover:from-pink-200 hover:to-red-200 dark:hover:from-pink-500/30 dark:hover:to-red-500/30 border-2 border-pink-300 dark:border-pink-500/30 rounded-xl transition-all group"
                  >
                    <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-pink-700 dark:text-pink-300">Support the Project</span>
                  </button>

                  {/* Contact on Base */}
                  <a
                    href={baseProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 px-4 py-3 mt-2 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-xl transition-all group"
                  >
                    <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        Contact me on Base
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400">nba0x.base.eth</p>
                    </div>
                  </a>
                </div>

                {/* Medical Disclaimer */}
                <div className="mt-6 p-4 bg-amber-50 dark:bg-yellow-500/10 border border-amber-200 dark:border-yellow-500/30 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-amber-800 dark:text-yellow-300 mb-1">
                        Medical Disclaimer
                      </p>
                      <p className="text-xs text-amber-700 dark:text-yellow-200/80 leading-relaxed">
                        This app is for tracking purposes only and does not provide medical advice. 
                        Consult healthcare professionals for addiction treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </nav>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    disconnect()
                    onClose()
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-400 rounded-xl font-semibold transition-colors border border-red-300 dark:border-red-500/30"
                >
                  <LogOut className="w-5 h-5" />
                  Disconnect
                </button>
                
                <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
                  Built on <span className="font-semibold text-blue-600 dark:text-blue-400">Base</span> 
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

      {/* Settings Modal */}
      {settingsOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 dark:bg-black/50 z-50"
            onClick={() => setSettingsOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 z-50 shadow-2xl transform transition-transform">
            <SettingsComponent />
          </div>
        </>
      )}
    </>
  )
}