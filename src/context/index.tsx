'use client'

import { solanaWeb3JsAdapter, projectId, networks } from '@/config'
import { solana } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'

const metadata = {
  name: 'Stake Wars',
  description: 'PvP betting game',
  url: 'https://stake-wars.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const modal = createAppKit({
  adapters: [solanaWeb3JsAdapter],
  projectId,
  defaultNetwork: solana,
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
  themeVariables: {
    '--w3m-accent': '#ffffff',
  }
})

function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  )
}

export default ContextProvider
