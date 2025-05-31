import { cookieStorage, createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { mainnet, solana } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { HuobiWalletAdapter, SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { defineChain } from '@reown/appkit/networks';


export const projectId = process.env.PROJECT_ID || "b56e18d47c72ab683b10814fe9495694"

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Define the custom network
export const customNetwork = defineChain({
  id: 10143,
  caipNetworkId: 'eip155:123456789',
  chainNamespace: 'eip155',
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Testnet MON Token',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz/'],
      webSocket: ['WS_RPC_URL'],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Testnet explorer', url: 'https://testnet.monadexplorer.com/' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 251449,
    },
  },
  testnet: true,
})

export const networks = [customNetwork, mainnet, solana] as [AppKitNetwork, ...AppKitNetwork[]]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new HuobiWalletAdapter(), new SolflareWalletAdapter(), new PhantomWalletAdapter()],
})

export const config = wagmiAdapter.wagmiConfig