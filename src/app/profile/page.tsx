'use client'

import React from 'react'
import Image from 'next/image'
import { useUser } from '@/context/telegram-context'
import PlayerStatistics from './features/PlayerStatistics';
import ConnectButton from '@/components/ConnectButton';

export default function Profile() {
    const { user } = useUser();
  return (
    <main className='h-screen overflow-auto bg-background flex flex-col justify-between'>
        <div>
        <div className='flex gap-5 justify-center pt-6 pb-8'>
            <div>
                <div className="avatar mt-2">
                    <div className="ring-[#f0b803] ring-offset-background w-[94px] h-[94px] rounded-full ring ring-offset-2">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                </div>
            </div>

            <div className='text-white'>
                <span className='block text-xl font-bold'>{user?.username ?? user?.first_name ?? user?.last_name ?? user?.id}</span>
                <span className='inline-flex items-center text-[15px] font-normal uppercase mt-2 mb-[14px]'>{user ? user?.id : "ID: 0A45R1AO"}  <button className='p-0 bg-transparent mt-px ml-2'><Image src='/copy.png' alt='copy' width={20} height={20} /></button></span>
                <ConnectButton />
            </div>
        </div>
        <div className="h-px bg-[#6A6868]"></div>
        <PlayerStatistics user={user} />
        </div>
    </main>
  )
}
