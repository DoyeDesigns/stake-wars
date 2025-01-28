'use client'

import { useAppKit } from '@reown/appkit/react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import Image from 'next/image';

const compactHash = (hash: string) => {
  return hash.slice(0, 7) + '...' + hash.slice(-5)
}

export default function ConnectButton() {
  const { open } = useAppKit();
  const {address, isConnected} = useAppKitAccount();
  const {caipNetwork} = useAppKitNetwork();
;
  const compactAddress = compactHash(address || '');

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center gap-2">
      <button className='btn flex items-center hover:rounded-xl hover:bg-primary/95 items-center border-none bg-accent h-10 w-[201px] text-white font-bold' onClick={() => open()}><span className='flex items-center gap-2'><Image className='inline-block' src='/wallet.png' alt='wallet' width={20} height={20}/> {isConnected ? <span className='truncate ...'>{compactAddress}</span> : 'Connect Wallet'}</span></button>
      <button className='btn flex justify-center hover:rounded-xl hover:bg-primary/95 items-center border-none bg-accent h-10 w-[201px] text-white font-bold' onClick={() => open({ view: 'Networks' })}>Select Network: {caipNetwork?.name === 'Solana' ? 'Solana-mainnet' : caipNetwork?.name}</button>
    </div>
  )
}