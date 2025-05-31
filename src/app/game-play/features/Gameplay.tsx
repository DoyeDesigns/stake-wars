'use client'

import React, { useState, useEffect } from 'react';
import useOnlineGameStore, { StakeDetails } from '@/store/online-game-store';
import { Ability, CHARACTERS } from '@/lib/characters';
import DiceRollToDetermineFirstTurn from '@/components/FirstTurnDiceRoll';
import DiceRoll from '@/components/DiceRoll';
import DefenseModal from '@/components/DefenceModal';
import { toast } from 'react-toastify';
import PlayerHealth from "./PlayerHealth";
import OpponentPlayerHealth from './OpponentPlayerHealth';
import WonMessage from './WonMessage'
import LostMessage from './LostMessage'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
// import { useRouter } from 'next/navigation';
import { autoAssignWinner } from '../../../config/game-bot';

interface LastAttackDetails {
  ability: Ability | null;
  attackingPlayer: 'player1' | 'player2' | null | undefined;
}

const diceImages = ['/one.png', '/two.png', '/three.png', '/four.png', '/five.png', '/six.png']

export default function Gameplay({roomId} : {roomId: string}) {
  const {
    gameState,
    init,
    reset,
    setRoomId
  } = useOnlineGameStore();

  const [showSkipDefenseButton, setShowSkipDefenseButton] = useState(false);
  const [lastAttackDetails, setLastAttackDetails] = useState<LastAttackDetails>({ability: null, attackingPlayer: null});
  const [showDefenseModal, setShowDefenseModal] = useState(false);
  const [defendingPlayer, setDefendingPlayer] = useState('');
  const [showWinner, setShowWinner] = useState(false);
  const [showLoser, setShowLoser] = useState(false);
  const [stakeDetails, setStakeDetails] = useState<StakeDetails | null>(null);

  const {address, isConnected} = useAppKitAccount();
  const { open } = useAppKit();

  const gameRoomId = roomId;

  useEffect(() => {
    if (!isConnected) {
      // router.push('/wallet');
      open();
      toast.info('Please connect your wallet to play the game');
    }
    
    const unsubscribe = init(gameRoomId);
 
    return () => {
      unsubscribe();
      reset();
    };
  }, [gameRoomId, init, reset, isConnected]);


  useEffect(() => {
    if (gameRoomId) {
      setRoomId(gameRoomId, address as `0${string}`)
      const fetchData = async () => {
          try {
            const data = await useOnlineGameStore.getState().getStakeDetails(gameRoomId);
            if (data) {
              setStakeDetails(data);
            }
          } catch (error) {
            toast.error(`${error instanceof Error ? error.message : 'Error fetch stake details'}`)
          }
      };
    
      fetchData();
    }
  }, [gameRoomId]);

  useEffect(() =>{
    if (gameState.winner === 'player1' || gameState.winner === 'player2' && gameState.gameStatus === 'finished') {
      toast.info(`${gameState.winner} has won the game`);
      if (address === gameState[gameState?.winner]?.id) {
        const assignWinnerHash = autoAssignWinner(roomId, address);
        if (assignWinnerHash) {
          toast.success(`Transaction Successful! hash: ${assignWinnerHash}`);
        }
        // claimPot();
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
      // gameState.lastAttack?.ability?.type === 'attack' &&
      gameState.lastAttack?.attackingPlayer
    ) {

      setLastAttackDetails(gameState.lastAttack);
      setShowDefenseModal(false);
      setShowSkipDefenseButton(false);

      toast(`⚔️ ${gameState.lastAttack.attackingPlayer} attacked with ${gameState.lastAttack.ability.name} for ${gameState.lastAttack.ability.value}} damage!`);
      
      const attackingPlayer = gameState.lastAttack.attackingPlayer;
      const defendingPlayer = attackingPlayer === 'player1' ? 'player2' : 'player1';

      if (address === gameState[defendingPlayer]?.id) {
        const defenseInventory = gameState[defendingPlayer]?.defenseInventory || {};
        const hasDefenses = Object.values(defenseInventory).some((count) => count > 0);
  
        if (hasDefenses) {
          setDefendingPlayer(defendingPlayer);
          setShowDefenseModal(true);
          setShowSkipDefenseButton(true);
        } else {
          useOnlineGameStore.getState().skipDefense(defendingPlayer, gameState.lastAttack.ability.value, gameState.lastAttack.ability);
          toast.warn(`You took -${gameState.lastAttack.ability.value} damage`)
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
    } else {
      const defendingCharacterId = useOnlineGameStore.getState().gameState?.[defendingPlayer]?.character?.id;
      const defendingCharacter = CHARACTERS.find(char => char.id === defendingCharacterId);

      const defenseAbility = defendingCharacter?.abilities.find(
        a => a.type === 'defense' && a.defenseType === defenseType
      );

      if (!defenseAbility) {
        toast.error(`Defense ability of type "${defenseType}" not found for ${defendingCharacterId}`);
        return;
      }
 
      const wasDefenseSuccessful = await useOnlineGameStore.getState().useDefense(
        defendingPlayer,
        defenseAbility,
        incomingDamage
      );
 
      if (wasDefenseSuccessful) {
        switch (defenseType) {
          case 'dodge':
            toast.info(`${defendingPlayer} dodged the attack with ${defenseAbility.name}`);
            break;
          case 'block':
            toast.info(`${defendingPlayer} blocked the attack with ${defenseAbility.name}`);
            break;
          case 'reflect':
            toast.info(`${defendingPlayer} reflected the attack with ${defenseAbility.name}`);
            break;
        }
      }
    }
 
    setShowDefenseModal(false);
    setLastAttackDetails({ ability: null, attackingPlayer: null });
};

  return (
    <div className='w-[95%] lg:w-[707px] relative mx-auto lg:px-0'>
        <OpponentPlayerHealth gameState={gameState} />
      <div className="flex flex-col items-center my-[30px] bg-[#3F3F3F] rounded-[10px] p-6 pt-5">
        <span className="text-[22px] font-bold text-white text-center">
          {/* {gameState.currentTurn === 'player1' ? 'Player 1 turn' : 'Player 2 turn'} */}
        </span>
        <div className='flex gap-[10px] lg:gap-[23px]'>
          {diceImages.map((img, index) => (
            <div key={index} className={`${gameState?.diceRolls?.[address as string] === index  + 1 ? 'outline-2 outline-[#B5A58F] outline-offset-[3px] lg:outline-offset-[6px] rounded-[10px]' : '' } mb-[10px]`}>
              <img src={img} alt={img} className='size-[42px] lg:size-[90px] rounded-[10px] drop-shadow-lg'/>
            </div>
          ))}
        </div>
        <div className='space-y-[14px] flex flex-col justify-center items-center mt-2 bg-[#494949] w-full rounded-[10px] py-[18px]'>
          <DiceRollToDetermineFirstTurn />
          <DiceRoll />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <PlayerHealth  gameState={gameState} />
      </div>
      <div className={`absolute top-0 w-full ${showDefenseModal ? 'h-full' : ''}`}>
        {showWinner && <WonMessage stakeDetails={stakeDetails as StakeDetails} roomId={roomId}/>}
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
