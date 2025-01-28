'use client'
import React, { useState } from 'react';
import Image from 'next/image';

interface HowToPlayProps {
  iconSize?: number;
  textSize?: string;
}

export default function HowToPlay({ iconSize = 24, textSize = "text-base" }: HowToPlayProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      content: (
        <>
          <h1 className='text-[#FFAC33] m-0 font-medium mb-4'>OBJECTIVES</h1>
          <p className='text-white mb-6'>Outlast your opponent by reducing their health bar to zero and claim the staked tokens.</p>
          
          <h1 className='text-[#FFAC33] m-0 font-medium mb-4'>SETUP</h1>
          <p className='text-white mb-2'>1. Choose your character (each with unique special abilities).</p>
          
          <h1 className='text-[#FFAC33] m-0 font-medium mb-4'>GAMEPLAY</h1>
          <p className='text-white mb-2'>2. Roll the Dice to Determine First Player</p>
          <ul className='list-disc pl-6 mb-4'>
            <li className='text-white'>The player with the highest number after both players have rolled the dice starts first.</li>
          </ul>

          <p className='text-white mb-2'>2. Roll the Dice</p>
          <ul className='list-disc pl-6 mb-4'>
            <li className='text-white'>Each number on the dice represents either an offensive move (damage) or defensive move (protection).</li>
          </ul>
          
          <p className='text-white mb-2'>3. Choose Your Action</p>
          <ul className='list-disc pl-6'>
            <li className='text-white mb-2'>Decide whether to defend yourself from opponent&apos;s attack or save defense points for later rounds. This work only if you have a defensive ability in your inventory.</li>
          </ul>
        </>
      )
    },
    {
      content: (
        <>
          <h1 className='text-[#FFAC33] m-0 font-medium mb-4'>GAMEPLAY</h1>
          <p className='text-white mb-2'>3. Controls</p>
          <ul className='list-disc pl-6 mb-4'>
            <li className='text-white'><span className='text-[#FFAC33]'>Reflect</span> - This reflects the damage to be taken back to the player that attacked.</li>
            <li className='text-white'><span className='text-[#FFAC33]'>Dodge</span> - This allows a player avoid any damage to be taken. The player dodging the attack plays his turn after dodging the attack.</li>
            <li className='text-white'><span className='text-[#FFAC33]'>Block</span> - This reduces the damage to be taken by a 50%. The player misses his turn after using block.</li>
          </ul>

          <p className='text-white mb-2'>4. Strategize</p>
          <ul className='list-disc pl-6 mb-6'>
            <li className='text-white'>Use strategy tips like baiting your opponent into wasting their defenses early or saving an attack for a critical moment.</li>
          </ul>
          
          <p className='text-white mb-2'>5. Winning</p>
          <ul className='list-disc pl-6'>
            <li className='text-white'>Reduce your opponent&apos;s health bar to zero before they do the same to you.</li>
          </ul>
          
          <div className='flex justify-center mt-[70px]'>
          <div className='bg-[#E1C17B] bg-[url("/health-bg.png")] bg-cover h-10 w-[250px] rounded-3xl flex gap-3 px-2 items-center '>
                <Image
                  src="/donald-pump.png"
                  alt="Donald pump"
                  width={45}
                  height={60}
                  className='rounded-[19px] mb-4'
                />
                <div className='flex gap-[6px] flex-col -mt-2'>
                  <span className='text-[10px] text-[#482007] font-bold'>
                    Donald Pump
                  </span>
                  <progress
                    className="progress progress-primary w-[163px] h-[9px] bg-white border-2 border-[#482007]"
                    value={10}
                    max="100"
                  ></progress>
                </div>
              </div>
          </div>
        </>
      )
    }
  ];

  return (
    <div>
      <button
        className={`flex p-0 bg-transparent items-center text-[#BFE528] hover:opacity-80 transition-opacity font-bold ${textSize}`}
        onClick={() => {
          const modal = document?.getElementById('my_modal_3');
          if (modal) {
            (modal as HTMLDialogElement).showModal();
          }
        }}
      >
        <Image src="/green-info.png" alt="info" width={iconSize} height={iconSize} />
        <span className="underline mb-1 ml-1">How to play</span>
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50" />
        <div className="modal-content fixed inset-0 bg-gradient-to-b from-[#482007] to-[#AE4D11]">
          <form method="dialog" className="absolute top-4 right-4">
            <button className="p-1 hover:opacity-70 transition-opacity">
              <Image src="/close-circle.png" alt="close" width={30} height={30} />
            </button>
          </form>

          <div className="flex flex-col bg-[url('/how-to-play-bg-img.png')] bg-center bg-cover bg-no-repeat h-full overflow-auto p-6">
            <h3 className="text-lg font-bold text-center drop-shadow-lg mt-5 text-[#FFAC33]">
              How to Play Stakewars
            </h3>
            <div className="h-[1px] bg-white my-[22px]"></div>

            <div className="flex-1 overflow-y-auto">
              {pages[currentPage].content}
            </div>

            <div className="h-[1px] bg-white my-[22px]"></div>

            <div className="mt-auto flex justify-between items-center pt-4">
              <button
                className={`p-2 bg-transparent ${currentPage === 0 ? 'invisible' : ''}`}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              >
                <Image src="/arrow-back.png" alt="Previous" width={24} height={24} />
              </button>

              <div className="flex gap-2 justify-center">
                {pages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentPage ? 'bg-[#BFE528]' : 'bg-white'
                    }`}
                  />
                ))}
              </div>

              <button
                className={`p-2 bg-transparent ${currentPage === pages.length - 1 ? 'invisible' : ''}`}
                onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))}
              >
                <Image src="/arrow-back.png" className='rotate-180' alt="Next" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}