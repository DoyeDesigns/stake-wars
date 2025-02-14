'use client'

import React from 'react'
import Image from 'next/image'
import PlayerStatistics from './features/PlayerStatistics';
import ConnectButton from '@/components/ConnectButton';
import { useAppKitAccount } from "@reown/appkit/react";

export default function Profile() {
    const {address} = useAppKitAccount();
  return (
    <main className='h-screen overflow-auto bg-background flex flex-col justify-between'>
        <div>
        <div className='flex gap-5 justify-center pt-6 pb-8'>
            <div>
                <div className="avatar mt-2">
                    <div className="ring-[#f0b803] ring-offset-background w-[94px] h-[94px] rounded-full ring ring-offset-2">
                        <img src="/avater.jpg" />
                    </div>
                </div>
            </div>

            <div className='text-white'>
                <span className='inline-flex items-center text-[15px] font-normal uppercase mt-2 mb-[14px]'><span className={`${address ? 'w-[150px] truncate ...' : ''}`}>{address ? address : "ID: 0A45R1AO"}</span> <button className='p-0 bg-transparent mt-px ml-2'><Image src='/copy.png' alt='copy' width={20} height={20} /></button></span>
                <ConnectButton />
            </div>
        </div>
        <div className="h-px bg-[#6A6868]"></div>
        <PlayerStatistics/>
        </div>
    </main>
  )
}
