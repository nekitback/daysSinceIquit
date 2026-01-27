import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@coinbase/onchainkit/styles.css'
import App from './App'

import { OnchainKitProvider } from '@coinbase/onchainkit'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { coinbaseWallet } from 'wagmi/connectors'

// CDP API Key from Paymaster URL
const PAYMASTER_URL = import.meta.env.VITE_PAYMASTER_URL || ''
const CDP_API_KEY = PAYMASTER_URL.split('/').pop() || ''

const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'Days Since I Quit',
      preference: 'smartWalletOnly', // Forces Smart Wallet for sponsored transactions
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={CDP_API_KEY}
          chain={base}
        >
          <App />
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
