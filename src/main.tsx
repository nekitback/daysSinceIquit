import React from 'react'
import ReactDOM from 'react-dom/client'
import '@rainbow-me/rainbowkit/styles.css'
import './index.css'
import App from './App'

import { 
  getDefaultConfig, 
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { injected } from 'wagmi/connectors'

const config = getDefaultConfig({
  appName: 'Days Since I Quit',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '72248be74feba112a1293cb62a84618b',
  chains: [baseSepolia],
  ssr: false,
  
  wallets: [],
})


config.connectors.unshift(
  injected({
    target: 'metaMask',
  })
)

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