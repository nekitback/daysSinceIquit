import { CONTRACT_ADDRESS } from '../constants/contract'
import { ExternalLink } from 'lucide-react'

export default function Footer() {
  const baseProfileUrl = 'https://base.app/profile/0x585207f9B4C1FB59c5FC819411E0aCC60BdfFe69'
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Medical Disclaimer */}
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-yellow-900 mb-1">
                Medical Disclaimer
              </h3>
              <p className="text-sm text-yellow-800 leading-relaxed">
                This application is designed for tracking and motivational purposes only. 
                It does not provide medical advice, diagnosis, or treatment. If you are 
                struggling with addiction or substance abuse, please consult qualified 
                healthcare professionals or contact a treatment center. This app is not 
                a substitute for professional medical care.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Main info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span>Built on</span>
              <a 
                href="https://base.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
              >
                Base
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <span className="text-gray-500">
                Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Made with ❤️ by</span>
              <a
                href={baseProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1 group"
              >
                nba0x.base.eth
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Secondary info */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Open source • On-chain forever • Built for the Base community
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}