import React from 'react'
import ReactDOM from 'react-dom/client'
import '@rainbow-me/rainbowkit/styles.css'
import './index.css'
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
import { baseSepolia } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

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
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
