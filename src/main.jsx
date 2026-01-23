import React from "react";
import ReactDOM from "react-dom/client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./app/App";
import "./styles/globals.css";

// 1️⃣ Query client (обязательно)
const queryClient = new QueryClient();

// 2️⃣ Wagmi config
const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <App />
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
