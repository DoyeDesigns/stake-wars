'use client'

import React from 'react'
import Link from 'next/link'
import GameRoomSearch from './features/GameRoomSearch'
import UserGameRooms from './features/UserRooms'
import HowToPlay from '@/components/HowToPlay'

export default function Play() {
  return (
    <div className='h-screen overflow-auto bg-background flex flex-col justify-center px-4'>
        <div className='h-full'>
            <div className='flex items-center justify-between my-5'>
              <h1 className='font-bold text-white m-0'>Find Game</h1>
              <HowToPlay iconSize={12}  textSize='text-sm'/>
            </div>
            <GameRoomSearch />
            <div className='flex flex-col items-center gap-4'>
                <Link href='/create-game' className='btn h-12  border-none !bg-[#6832AE] w-full text-white hover:bg-[#6832AE]/80 hover:no-underline'>Create Game</Link>
                <Link href='/open-games' className='btn h-12  border-none bg-secondary w-full text-black hover:bg-secondary/80 hover:no-underline'>Explore available games</Link>
            </div>
            <UserGameRooms />
        </div>
    </div>
  )
}
