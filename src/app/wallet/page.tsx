import React from 'react'
import Image from 'next/image'
import ConnectButton from '@/components/ConnectButton'

export default function Wallet() {
  return (
    <div className='h-screen overflow-auto bg-background flex flex-col text-center justify-center items-center'>
        <Image src='/stake-wars-logo.png' alt='img' width={135} height={76} />
        <h1 className='font-bold text-[24px] mt-7 text-white'>Connect your wallet</h1>
        <p className='mt-4 text-white'>Hey there Warrior!</p>
        <p className='mb-[91px] text-white'>Connect your wallet to get access to stake for battle</p>
        <ConnectButton />
    </div>
  )
}
