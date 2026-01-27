import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css'
import '@coinbase/onchainkit/styles.css'
import App from './App'

import { 
  RainbowKitProvider,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit'
import { 
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { OnchainKitProvider } from '@coinbase/onchainkit'

// Extract API key from Paymaster URL
const PAYMASTER_URL = import.meta.env.VITE_PAYMASTER_URL || ''
const CDP_API_KEY = PAYMASTER_URL.split('/').pop() || ''

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended for Base',
      wallets: [
        coinbaseWallet,  
        metaMaskWallet,
      ],
    },
    {
      groupName: 'Other',
      wallets: [
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'Days Since I Quit',
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '72248be74feba112a1293cb62a84618b',
  }
)

const config = createConfig({
  connectors,
  chains: [base],
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
          config={{
            appearance: {
              mode: 'auto',
            },
          }}
        >
          <RainbowKitProvider modalSize="compact">
            <App />
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
