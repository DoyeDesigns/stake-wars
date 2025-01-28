'use client'

import React, { type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes';
import { type Config, WagmiProvider, cookieToInitialState } from 'wagmi'

import { mainnet } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'

import { networks, projectId, wagmiAdapter } from '@/config'

const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const appKitMetadata = {
  name: 'AppKit Next.js Wagmi',
  description: 'AppKit Next.js App Router Wagmi Example',
  url: 'https://github.com/0xonerb/next-reown-appkit-ssr', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: mainnet,
  metadata: appKitMetadata,
  themeMode: 'dark',
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'x', 'github', 'discord', 'farcaster'],
    emailShowWallets: true,
  },
  allWallets: 'SHOW',
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider