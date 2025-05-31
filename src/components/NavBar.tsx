'use client'

import React from 'react'
import ConnectButton from './ConnectButton'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserProfile from './UserProfile'
import { useAppKitAccount } from '@reown/appkit/react'
import SearchDialog from './SearchDialog'


export default function NavBar() {
  const path = usePathname();
  const { isConnected } = useAppKitAccount();

    
  // if (path === '/game-play' || path ==='/' || path === `/game-play/${roomId}`) return;
  return (
        <div className="flex justify-between items-center pt-4 lg:pt-10 mb-6 lg:mb-12 px-5 lg:px-14">
        <div className='hidden sm:block'>
        {path === '/' ? <SearchDialog /> : <Link href={'/'}><img src="/stake-wars-logo.png" alt="stake wars logo" className="size-[113px] lg:size-[132px]"/></Link>}
        </div>
        <div className='block sm:hidden'>
          <Link href={'/'}><img src="/stake-wars-logo.png" alt="stake wars logo" className="size-[113px] lg:size-[132px]"/></Link>
        </div>
        
        <div className='flex items-center gap-3 lg:gap-7 '>
          <div className='sm:hidden'>
            <SearchDialog />
          </div>
          <div className={`${isConnected ? 'block' : 'hidden'}`}>
            <UserProfile />
          </div>
          <div className={`hidden sm:block ${isConnected ? 'hidden' : 'block'}`}>
            <ConnectButton />
          </div>
        </div>
      </div>
  )
}

