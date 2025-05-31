'use client'

import { wagmiAdapter, solanaWeb3JsAdapter, projectId, networks, customNetwork } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
// import { mainnet, solana, solanaDevnet } from '@reown/appkit/networks'

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Then pass it to the AppKit
// createAppKit({
//     adapters: [...],
//     networks: [customNetwork],
//     chainImages: { // Customize networks' logos
//       123456789: '/custom-network-logo.png', // <chainId>: 'www.network.com/logo.png'
//     }
// })

const metadata = {
  name: 'Stake Wars',
  description: 'PvP betting game',
  url: 'https://stake-wars.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const modal = createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  projectId,
  defaultNetwork: customNetwork,
  networks,
  metadata,
  themeMode: 'dark',
  features: {
    analytics: true,
    onramp: true,
    socials: false,
    email: false,
    swaps: false
  },
  chainImages: {
    10143: '/monad.jpg',
  }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
