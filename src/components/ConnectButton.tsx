'use client'

import { useAppKit } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';
import '@reown/appkit-wallet-button/react'

const compactHash = (hash: string) => {
  return hash.slice(0, 7) + '...' + hash.slice(-5)
}

export default function ConnectButton() {
  const { open } = useAppKit();
  const account = useAppKitAccount();
;
  // const compactAddress = compactHash(account.address || '');

  return (
    <div className="flex items-center gap-2">
      {/* <span className="text-black truncate ...">Address: {compactAddress}</span> */}
      <button onClick={() => open()}>Connect Wallet</button>
      <button onClick={() => open({ view: 'Networks' })}>Select Network</button>
    </div>
  )
}