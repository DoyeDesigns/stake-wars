'use client'

import React, { useState, useEffect } from 'react';
import useOnlineGameStore, { StakeDetails } from '@/store/online-game-store';
import { Ability } from '@/lib/characters';
import DiceRollToDetermineFirstTurn from '@/components/FirstTurnDiceRoll';
import DiceRoll from '@/components/DiceRoll';
import DefenseModal from '@/components/DefenceModal';
import { useToast } from '@/context/toast-context';
import PlayerHealth, { OpponentPlayerHealth } from "./PlayerHealth";
import PlayerAbility from './PlayerAbility';
import WonMessage from './WonMessage'
import LostMessage from './LostMessage'
 import Image from 'next/image';
import HowToPlay from '@/components/HowToPlay';

interface LastAttackDetails {
  ability: Ability | null;
  attackingPlayer: 'player1' | 'player2' | null | undefined;
}


export default function Gameplay({roomId} : {roomId: string}) {
  const {
    gameState,
    init,
  } = useOnlineGameStore();

  const [showSkipDefenseButton, setShowSkipDefenseButton] = useState(false);
  const [lastAttackDetails, setLastAttackDetails] = useState<LastAttackDetails>({ability: null, attackingPlayer: null});
  const [showDefenseModal, setShowDefenseModal] = useState(false);
  const [defendingPlayer, setDefendingPlayer] = useState('');
  const [currentUserTelegramId, setCurrentUserTelegramId] = useState<number | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [showLoser, setShowLoser] = useState(false);
  const [stakeDetails, setStakeDetails] = useState<StakeDetails | null>(null);


  const { addToast } = useToast();

  const gameRoomId = roomId;

  useEffect(() => {
    const unsubscribe = init(gameRoomId);
 
    return () => {
      unsubscribe();
    };
  }, [gameRoomId, init]);

  useEffect(() => {
    if (gameRoomId) {
      const fetchData = async () => {
          try {
            const data = await useOnlineGameStore.getState().getStakeDetails(gameRoomId);
            if (data) {
              setStakeDetails(data);
            }
          } catch (error) {
            addToast(`${error instanceof Error ? error.message : 'Error fetch stake details'}`)
          }
      };
    
      fetchData();
    }
  })

  useEffect(() =>
  {
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      if (telegramUser?.id) {
        setCurrentUserTelegramId(telegramUser.id);
      }
  }, [currentUserTelegramId])

  useEffect(() => {
    if (gameState.winner === 'player1' || gameState.winner === 'player2' && gameState.gameStatus === 'finished') {
      addToast(`${gameState.winner} has won the game`, 'info');
      if (currentUserTelegramId === gameState[gameState?.winner]?.id) {
        setShowWinner(true); 
      } else {
        setShowLoser(true);
      }
      return;
    }
  }, [gameState.winner, gameState.gameStatus])

  useEffect(() => {
    if (
      gameState.gameStatus === 'inProgress' &&
      gameState.lastAttack !== null &&
      gameState.lastAttack?.ability?.type === 'attack' &&
      gameState.lastAttack?.attackingPlayer
    ) {

      setLastAttackDetails(gameState.lastAttack);
      setShowDefenseModal(false);
      setShowSkipDefenseButton(false);
      
      const attackingPlayer = gameState.lastAttack.attackingPlayer;
      const defendingPlayer = attackingPlayer === 'player1' ? 'player2' : 'player1';

      if (currentUserTelegramId === gameState[defendingPlayer]?.id) {
        const defenseInventory = gameState[defendingPlayer]?.defenseInventory || {};
        const hasDefenses = Object.values(defenseInventory).some((count) => count > 0);
  
        if (hasDefenses) {
          setDefendingPlayer(defendingPlayer);
          setShowDefenseModal(true);
          setShowSkipDefenseButton(true);
        } else {
          useOnlineGameStore.getState().skipDefense(defendingPlayer, gameState.lastAttack.ability.value, gameState.lastAttack.ability);
          addToast(`You took -${gameState.lastAttack.ability.value} damage`, 'info')
        }
      }
    } else {
      setShowDefenseModal(false);
    }
  }, [gameState.lastAttack, gameState.winner]);

  const handleDefenseSelection = async (defenseType: string | null) => {
    const { ability, attackingPlayer } = lastAttackDetails;
    if (!ability || !attackingPlayer) return;
 
    const defendingPlayer = attackingPlayer === 'player1' ? 'player2' : 'player1';
    const incomingDamage = ability.value;
 
    if (defenseType === null) {
      useOnlineGameStore.getState().skipDefense(defendingPlayer, incomingDamage, ability);
      addToast(`${defendingPlayer} took -${incomingDamage} damage from ${ability.name}`, 'info');
    } else {
      const defenseAbility: Ability = {
        id: `${defendingPlayer}-${defenseType}`,
        name: defenseType,
        defenseType: defenseType as 'dodge' | 'block' | 'reflect',
        value: 0,
        type: 'defense',
        description: '',
      };
 
      const wasDefenseSuccessful = await useOnlineGameStore.getState().useDefense(
        defendingPlayer,
        defenseAbility,
        incomingDamage
      );
 
      if (wasDefenseSuccessful) {
        switch (defenseType) {
          case 'dodge':
            addToast(`${defendingPlayer} dodged the attack`, 'info');
            break;
          case 'block':
            addToast(`${defendingPlayer} blocked the attack`, 'info');
            break;
          case 'reflect':
            addToast(`${defendingPlayer} reflected the attack`, 'info');
            break;
        }
      }
    }
 
    setShowDefenseModal(false);
    setLastAttackDetails({ ability: null, attackingPlayer: null });
};

  return (
    <div className='bg-[url("/game-play-bg.png")] bg-cover bg-no-repeat h-full overflow-auto  pt-[15px] relative'>
      <div className="flex flex-col gap-5 px-5">
        <div>
          <PlayerHealth  gameState={gameState} />
        </div>
        <div className="flex justify-end">
          <OpponentPlayerHealth gameState={gameState} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-10 mb-5">
        <span className="text-[22px] font-bold text-white my-2 text-center">
          {gameState.currentTurn === 'player1' ? 'Player 1 turn' : 'Player 2 turn'}
        </span>
        <div className='bg-[url("/dice-bg.png")] bg-cover flex flex-col justify-center items-center h-[164px] w-[164px] gap-3'>
        <div className='bg-[url("/green-grass-texture.png")] bg-contain bg-no-repeat bg-center flex justify-center items-center h-[123px] w-[123px]'>
          <Image src='/dice-animation.gif' alt='dice' width={100} height={100} />
        </div>
        </div>
        <div className='space-y-3 flex flex-col justify-center items-center mt-2'>
          <DiceRoll />
          <DiceRollToDetermineFirstTurn />
        </div>
      </div>
      <div className='flex justify-end my-2'>
        <span className='p-2 rounded-[5px] bg-white'><HowToPlay iconSize={12} textSize='text-sm'/></span>
      </div>
      <div className="flex flex-col justify-center items-center">
        <span className="text-[14px] rounded-[10px] font-extrabold w-[337px] text-center h-[37px] flex justify-center items-center text-white bg-[#5B2D0C]">
          Battle stake - <span>{(stakeDetails?.stakeAmount as number * 2).toLocaleString()}</span>{stakeDetails?.symbol}
        </span>
        <div className='bg-[url("/ability-bg.png")] bg-cover w-[384px] h-[271px] flex justify-center items-center'>
          <PlayerAbility gameState={gameState} userId={currentUserTelegramId} />
        </div>
      </div>
      <div className="absolute h-vh top-0 w-full">
        {showWinner && <WonMessage {...stakeDetails as StakeDetails}/>}
        {showLoser && <LostMessage {...stakeDetails as StakeDetails}/>}
        {showDefenseModal && defendingPlayer === gameState.currentTurn && (
        <DefenseModal
          player={defendingPlayer as 'player1' | 'player2'}
          onClose={() => setShowDefenseModal(false)}
          onDefenseSelect={handleDefenseSelection}
          showSkipButton={showSkipDefenseButton}
        />
      )}
      </div>
    </div>
  );
}
