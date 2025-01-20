'use client'

import { useAccount } from 'wagmi';
import { useAppKit, useWalletInfo } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';
import '@reown/appkit-wallet-button/react'

const compactHash = (hash: string) => {
  return hash.slice(0, 7) + '...' + hash.slice(-5)
}

export default function ConnectButton() {
  const { open } = useAppKit();
  const wagmiAccount = useAccount()
  const account = useAppKitAccount()
  const { walletInfo } = useWalletInfo()

  console.log('walletInfo', walletInfo)
;
  const compactAddress = compactHash(account.address || '')
  const compactAddressWagmi = compactHash(wagmiAccount.address || '')

  return (
    <>
        <span className="text-black">useAppKitAccount: {compactAddress}</span>
        <span className="text-black">useAccount (wagmi): {compactAddressWagmi}</span>
      <button onClick={() => open({ view: 'Account' })}>Open Connect Modal</button>
      <button onClick={() => open({ view: 'Networks' })}>Open Network Modal</button>
    </>
  )
}