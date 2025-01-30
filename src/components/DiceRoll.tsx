'use client';
import React, { useState } from 'react';
import useOnlineGameStore from '@/store/online-game-store';
import { toast } from 'react-toastify';
import { useAppKitAccount } from '@reown/appkit/react';

const DiceRoll: React.FC = () => {
  const { rollAndRecordDice, gameState, performAttack, addDefenseToInventory } =
    useOnlineGameStore();
  const [rollNumber, setRollNumber] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const {address} = useAppKitAccount();

  const isPlayerTurn = (() => {
    if (gameState?.gameStatus !== 'inProgress') return false;

    const isPlayer1 = gameState.player1?.id === address;
    const isPlayer2 = gameState.player2?.id === address;

    if (isPlayer1 && gameState.currentTurn === 'player1') return true;
    if (isPlayer2 && gameState.currentTurn === 'player2') return true;
    return false;
  })();

  const handleRollDice = async () => {
    if (isButtonDisabled) return;

    setIsButtonDisabled(true);

    try {
      const rolledDiceNumber = await rollAndRecordDice();
      const currentPlayer = gameState.currentTurn;
      const player = gameState[currentPlayer];

      if (player?.character) {
        const abilities = player.character.abilities;
        if (rolledDiceNumber > 0 && rolledDiceNumber <= abilities.length) {
          const ability = abilities[rolledDiceNumber - 1];

          if (ability.type === 'defense') {
            if (ability.defenseType) {
              addDefenseToInventory(currentPlayer, ability.defenseType);
              toast.info(`Added 1 ${ability.defenseType} to your inventory`);
            } else {
              toast.error(`Defense type is undefined for the given ability: ${ability}`)
            }
          } else {
            performAttack(currentPlayer, ability);
            toast(`⚔️ ${currentPlayer} attacked`)
          }
        }
      } else {
        toast.error('Player or player.character is undefined');
      }
      setRollNumber(rolledDiceNumber);

      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);

    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error rolling dice: ${error.message}`)
      }
      
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
    }
  };

  return (
    <div className="flex items-center gap-5">
      <button
        disabled={!isPlayerTurn || isButtonDisabled}
        className={`bg-secondary text-black font-bold ${isPlayerTurn ? 'animate-pulse' : ''} py-2 px-4 rounded-xl disabled:bg-accent/70 disabled:text-white`}
        onClick={handleRollDice}
      >
        Roll Dice
      </button>
      <p className='text-white text-[18px] font-bold'>{rollNumber}</p>
    </div>
  );
};

export default DiceRoll;