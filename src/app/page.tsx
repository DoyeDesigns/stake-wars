import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import HowToPlay from '@/components/HowToPlay'

export default function Page() {
  return (
    <div className='bg-[url("/welcome-background.png")] bg-cover h-[100vh] flex flex-col bg-background  justify-center items-center'>
      <div className='flex flex-col justify-center items-center'>
        <Image src='/stake-wars-logo.png' alt='welcome-img' width={216} height={129}/>
        <p className='w-[300px] text-white text-center mt-[83px]'>Tip : “Sometimes taking damage early pays off later. Learn to play for the long game!”</p>
        <button className="btn !bg-primary border-none inline-flex items-center gap-2 text-sm font-bold !rounded-[5px] text-white w-[307px] h-[47px] mb-2 mt-[77px]">About StakeWars <Image src='/external-link.png' alt='external-link' width={24} height={24}/></button>
        <Link href="/play" className="btn border-none hover:no-underline bg-white text-sm font-bold rounded-[5px] test-sm text-primary w-[307px] h-[47px] mb-[72px]">Get Started</Link>
        <HowToPlay iconSize={24} textSize='text-base'/>
      </div>
    </div>
  )
}
