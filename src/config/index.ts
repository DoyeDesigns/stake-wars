import {cookieStorage, createStorage} from 'wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  AppKitNetwork,
  arbitrum,
  mainnet,
  optimism,
  polygon,
  solana,
  solanaDevnet,
  solanaTestnet
} from '@reown/appkit/networks'
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
  useDisconnect,
  useWalletInfo
} from '@reown/appkit/react'

export const projectId = 'b56e18d47c72ab683b10814fe9495694'//process.env.PROJECT_ID; 
if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [
  mainnet,
  polygon,
  arbitrum,
  optimism,
  solana,
  solanaDevnet,
  solanaTestnet
] as [AppKitNetwork, ...AppKitNetwork[]]

// Setup wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage}),
  ssr: true,
  networks,
  projectId
})

export const solanaAdapter = new SolanaAdapter({})

// Create modal
const modal = createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks,
  metadata: {
    name: 'AppKit Next.js Wagmi Solana',
    description: 'AppKit Next.js App Router with Wagmi Solana Adapters',
    url: 'https://reown.com/appkit',
    icons: ['https://avatars.githubusercontent.com/u/179229932?s=200&v=4']
  },
  projectId,
  themeMode: 'dark',
  features: {
    analytics: true
  }
})

export {
  modal,
  useAppKit,
  useAppKitState,
  useAppKitTheme,
  useAppKitEvents,
  useAppKitAccount,
  useWalletInfo,
  useAppKitNetwork,
  useDisconnect
}