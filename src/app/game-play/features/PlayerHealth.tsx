import Image from 'next/image'
import { GameRoomDocument } from '@/store/online-game-store';

export default function PlayerHealth({ gameState }: {
  gameState?: GameRoomDocument['gameState']
}) {
  const currentPlayer = gameState?.player1
 
  const healthPercentage = currentPlayer?.currentHealth
    ? Math.max(0, Math.min(100, (currentPlayer.currentHealth / (currentPlayer.character?.baseHealth || 100)) * 100))
    : 0;

  return (
    <div className='bg-[#E1C17B] bg-[url("/health-bg.png")] bg-cover h-10 w-[250px] rounded-3xl flex gap-3 px-2 items-center '>
      <Image
        src={`/${currentPlayer?.character?.id}.png`}
        alt={currentPlayer?.character?.name || 'Player Character'}
        width={45}
        height={60}
        className='rounded-[19px] mb-4'
      />
      <div className='flex gap-[6px] flex-col -mt-2'>
        <span className='text-[10px] text-[#482007] font-bold'>
          {currentPlayer?.character?.name || 'Player'}
        </span>
        <progress
          className="progress progress-primary w-[163px] h-[9px] bg-white border-2 border-[#482007]"
          value={healthPercentage}
          max="100"
        ></progress>
      </div>
    </div>
  )
}

export function OpponentPlayerHealth({ gameState }: {
  gameState?: GameRoomDocument['gameState']
}) {
  const opponentPlayer = gameState?.player2

  const healthPercentage = opponentPlayer?.currentHealth
    ? Math.max(0, Math.min(100, (opponentPlayer.currentHealth / (opponentPlayer.character?.baseHealth || 100)) * 100))
    : 0;

  return (
    <div className='bg-[#E1C17B] bg-[url("/health-bg.png")] bg-cover h-10 w-[250px] rounded-3xl flex flex-row-reverse gap-3 px-2 items-center '>
      <Image
        src={`/${opponentPlayer?.character?.id}.png`}
        alt={opponentPlayer?.character?.name || 'Opponent Character'}
        width={45}
        height={60}
        className='rounded-[19px] mb-4'
      />
      <div className='flex gap-[6px] flex-col -mt-2'>
        <span className='text-[10px] text-[#482007] text-right font-bold'>
          {opponentPlayer?.character?.name || 'Opponent'}
        </span>
        <progress
          className="progress progress-reverse progress-primary w-[163px] h-[9px] bg-white border-2 border-[#482007]"
          value={healthPercentage}
          max="100"
        ></progress>
      </div>
    </div>
  )
}