'use client'

import { wagmiAdapter, solanaWeb3JsAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { mainnet, solana } from '@reown/appkit/networks'

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
  defaultNetwork: mainnet,
  networks,
  metadata,
  featuredWalletIds: [
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0'
  ],
  themeMode: 'dark',
  features: {
    analytics: true,
    onramp: true
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
