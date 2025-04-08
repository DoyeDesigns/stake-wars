'use client'

import { useAppKit } from '@reown/appkit/react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import Image from 'next/image';

export const compactHash = (hash: string | null | undefined) => {
  if (!hash || typeof hash !== 'string' || hash.length < 12) return '';
  return `${hash.substring(0, 7)}...${hash.substring(hash.length - 5)}`;
}

export default function ConnectButton() {
  const { open } = useAppKit();
  const {address, isConnected} = useAppKitAccount();
;
  const compactAddress = compactHash(address || '');

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center gap-2">
      <button className='btn flex hover:rounded-xl hover:gradient-tracker items-center border-none gradient-tracker h-10 w-[201px] text-white font-bold' onClick={() => open()}><span className='flex items-center gap-2'><Image className='inline-block' src='/wallet.png' alt='wallet' width={20} height={20}/> {isConnected ? <span className='truncate ...'>{compactAddress}</span> : 'Connect Wallet'}</span></button>
    </div>
  )
}