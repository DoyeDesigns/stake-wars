import { create } from 'zustand';
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { CHARACTERS, Character, Ability } from '@/lib/characters';
import { Timestamp } from 'firebase/firestore';

type UpdateData = {
  [key: string]: number | string | null | object;
};

export type StakeDetails = {
  stakeAmount: number;
    symbol: string;
    networkId: string;
    name: string;
}

export interface GameRoomPlayer {
  telegramId: number;
  username?: string;
  characterId: string | null;
  role: 'creator' | 'challenger';
  diceRoll?: number;
  wallet?: string;
}

export interface GameRoomDocument {
  id: string;
  createdBy: number;
  status: 'waiting' | 'character-select' | 'inProgress' | 'finished';
  players: {
    [telegramId: number]: GameRoomPlayer;
  };
  createdAt: Timestamp;
  gameState?: GameState;
  stakeDetails?: StakeDetails; 
}

interface DefenseInventory {
  [defenseType: string]: number;
}

interface GameState {
  player1: {
    id: number | null;
    character?: Character;
    currentHealth: number;
    defenseInventory: DefenseInventory;
    skippedDefense?: {
      ability: Ability;
      damage: number;
    };
  };
  player2: {
    id: number | null;
    character?: Character;
    currentHealth: number;
    defenseInventory: DefenseInventory;
    skippedDefense?: {
      ability: Ability;
      damage: number;
    };
  };
  currentTurn: 'player1' | 'player2';
  gameStatus: 'waiting' | 'character-select' | 'inProgress' | 'finished';
  winner: 'player1' | 'player2' | null;
  lastAttack?: {
    ability: Ability;
    attackingPlayer: 'player1' | 'player2';
  };
  diceRolls?: {
    [key: string]: number;
  };
}

interface OnlineGameStore {
  roomId: string | null;
  setRoomId: (roomId: string) => void;
  playerTelegramId: number | null;
  gameState: GameState;
  rollAndRecordDice: () => Promise<number>;
  checkDiceRollsAndSetTurn: () => void;
  selectCharacters: (roomId: string, characterId: string) => void;
  performAttack: (attackingPlayer: 'player1' | 'player2', ability: Ability) => void;
  useDefense: (
    defendingPlayer: 'player1' | 'player2',
    defenseAbility: Ability,
    incomingDamage: number
  ) => Promise<boolean>;
  addDefenseToInventory: (player: 'player1' | 'player2', defenseType: string) => void;
  skipDefense: (
    defendingPlayer: 'player1' | 'player2', 
    incomingDamage: number, 
    ability: Ability
  ) => void;
  getStakeDetails: (roomId: string) => Promise<StakeDetails | undefined>;
  createOnlineGameRoom: (address: string, stakeDetails: StakeDetails) => Promise<string>;
  joinGameRoom: (roomId: string, address: string | null) => Promise<void>;
  findUserRooms: () => Promise<GameRoomDocument[] | null>;
  findOpenGameRoom: () => Promise<GameRoomDocument[] | null>;
  init: (roomId: string) => () => void;
}

const useOnlineGameStore = create<OnlineGameStore>((set, get) => ({
  roomId: null,
  setRoomId: (id: string) => {
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!telegramUser) return;

    set({ 
      roomId: id, 
      playerTelegramId: telegramUser.id 
    });
  },
  playerTelegramId: null,
  gameState: {
    player1: {
      id: null,
      character: CHARACTERS[0],
      currentHealth: CHARACTERS[0].baseHealth,
      defenseInventory: {},
    },
    player2: {
      id: null,
      character: CHARACTERS[1],
      currentHealth: CHARACTERS[1].baseHealth,
      defenseInventory: {},
    },
    currentTurn: 'player1',
    gameStatus: 'character-select',
    winner: null,
  },

  rollAndRecordDice: async () => {
    const { roomId, playerTelegramId } = get();
    if (!roomId || !playerTelegramId) {
      throw new Error('No active game room');
    }
  
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    const roomRef = doc(db, 'gameRooms', roomId);
  
    updateDoc(roomRef, {
      [`players.${playerTelegramId}.diceRoll`]: diceRoll,
      [`gameState.diceRolls.${playerTelegramId}`]: diceRoll
    });
  
    return diceRoll;
  },

checkDiceRollsAndSetTurn: async () => {
  const { roomId } = get();
  if (!roomId) return;

  const roomRef = doc(db, 'gameRooms', roomId);
  const roomSnapshot = await getDoc(roomRef);
  const roomData = roomSnapshot.data() as GameRoomDocument;

  if (!roomData) throw new Error('Room not found');

  const { players, gameState } = roomData;
  if (!players || !gameState?.diceRolls) {
    console.error('Players or dice rolls are missing.');
    return;
  }

  const diceRolls = gameState.diceRolls;
  const playerIds = Object.keys(players);

  if (
    playerIds.length !== 2 ||
    playerIds.some((id) => diceRolls[id] === undefined)
  ) {
    console.error('Not all players have rolled their dice.');
    return;
  }

  const [player1Id, player2Id] = playerIds;
  const playerRoles = {
    player1: { id: player1Id, roll: gameState.diceRolls[player1Id] },
    player2: { id: player2Id, roll: gameState.diceRolls[player2Id] },
  };

  const firstPlayer =
    playerRoles.player1.roll > playerRoles.player2.roll
      ? 'player1'
      : 'player2';

  updateDoc(roomRef, {
    'gameState.currentTurn': firstPlayer,
    'gameState.gameStatus': 'inProgress',
    'status': 'inProgress',
  });
},


  selectCharacters: async (roomId: string, characterId: string) => {
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!telegramUser) {
      throw new Error('Telegram user not found');
    }
  
    const roomRef = doc(db, 'gameRooms', roomId);
    const playerCharacter = CHARACTERS.find((char) => char.id === characterId);
  
    if (!playerCharacter) throw new Error('Invalid character ID');
  
    const gameRoomDoc = await getDoc(roomRef);
  
    if (!gameRoomDoc.exists()) throw new Error('Game room not found');
  
    const isPlayer1 = gameRoomDoc.data()?.createdBy === telegramUser?.id;
  
    const existingCharacterId = gameRoomDoc.data()?.players?.[telegramUser.id]?.characterId;
    if (existingCharacterId) {
      throw new Error('Character already selected');
    }
  
  updateDoc(roomRef, {
    [`players.${telegramUser.id}.characterId`]: characterId,
    [`gameState.${isPlayer1 ? 'player1' : 'player2'}.character`]: playerCharacter,
    [`gameState.${isPlayer1 ? 'player1' : 'player2'}.currentHealth`]: playerCharacter.baseHealth,
    [`gameState.${isPlayer1 ? 'player1' : 'player2'}.id`]: telegramUser.id,
    [`gameState.gameStatus`]: 'character-select',
    'status': 'character-select'
  });
  },


  addDefenseToInventory: async (player, defenseType) => {
    const { roomId, gameState } = get();
  
    if (!roomId) throw new Error('No active game room');
  
    const roomRef = doc(db, 'gameRooms', roomId);
    const nextPlayer = player === 'player1' ? 'player2' : 'player1';
  
    const currentDefenseCount = gameState[player]?.defenseInventory?.[defenseType] || 0;
  
    updateDoc(roomRef, {
      [`gameState.${player}.defenseInventory.${defenseType}`]: currentDefenseCount + 1,
      'gameState.currentTurn': nextPlayer,
    });
  },

  
  skipDefense: async (defendingPlayer, incomingDamage, ability) => {
    const { roomId, gameState } = get();
    if (!roomId) throw new Error('No active game room');
  
    const roomRef = doc(db, 'gameRooms', roomId);
  
    const opponentPlayer = defendingPlayer === 'player1' ? 'player2' : 'player1'; 
    
    const updatedHealth = gameState[defendingPlayer].currentHealth - incomingDamage;
  
    const updateData: UpdateData = {
      [`gameState.${defendingPlayer}.currentHealth`]: updatedHealth,
      [`gameState.${defendingPlayer}.skippedDefense`]: {
        ability,
        damage: incomingDamage
      },
      'gameState.lastAttack': { ability: null, attackingPlayer: null },
      'gameState.currentTurn': defendingPlayer,
    };
  
    if (updatedHealth <= 0) {
      updateData['gameState.gameStatus'] = 'finished';
      updateData['status'] = 'finished';
      updateData['gameState.winner'] = opponentPlayer;
    }
  
      updateDoc(roomRef, updateData);
  },
  
  useDefense: async (defendingPlayer, defenseAbility, incomingDamage) => {
    const { roomId, gameState } = get();
    if (!roomId) throw new Error('No active game room');
 
    if (!defenseAbility?.defenseType) {
      console.error('Invalid defense ability provided');
      return false;
    }
 
    const opponentPlayer = defendingPlayer === 'player1' ? 'player2' : 'player1';
    const defenseType = defenseAbility.defenseType;
 
    if ((gameState[defendingPlayer].defenseInventory[defenseType] || 0) <= 0) {
      return false;
    }
 
    const roomRef = doc(db, 'gameRooms', roomId);
 
    const updateData: UpdateData = {
      [`gameState.${defendingPlayer}.defenseInventory.${defenseType}`]:
        (gameState[defendingPlayer].defenseInventory[defenseType] || 1) - 1,
      [`gameState.${defendingPlayer}.skippedDefense`]: null,
      'gameState.lastAttack': { ability: null, attackingPlayer: null },
    };
 
    switch (defenseType) {
      case 'dodge':
        updateData['gameState.currentTurn'] = defendingPlayer;
        break;
 
      case 'reflect':
        updateData[`gameState.${opponentPlayer}.currentHealth`] =
          gameState[opponentPlayer].currentHealth - incomingDamage;
        updateData['gameState.currentTurn'] = opponentPlayer;
        break;
 
      case 'block':
        updateData[`gameState.${defendingPlayer}.currentHealth`] =
          gameState[defendingPlayer].currentHealth - Math.max(0, incomingDamage - 25);
        updateData['gameState.currentTurn'] = opponentPlayer;
        break;
 
      default:
        console.error('Unknown defense type');
        return false;
    }
 
    if (gameState[opponentPlayer].currentHealth - (defenseType === 'reflect' ? incomingDamage : 0) <= 0 ||
        gameState[defendingPlayer].currentHealth -
        (defenseType === 'block' ? Math.max(0, incomingDamage - 25) :
         defenseType === 'dodge' ? 0 : incomingDamage) <= 0) {
      updateData['gameStatus'] = 'finished';
    }
      updateDoc(roomRef, updateData);
      return true;
  },
  
  performAttack: async (attackingPlayer, ability) => {
    const { roomId } = get();
    if (!roomId) throw new Error('No active game room');
  
    const opponentKey = attackingPlayer === 'player1' ? 'player2' : 'player1';
    const roomRef = doc(db, 'gameRooms', roomId);
  
  
    updateDoc(roomRef, {
      'gameState.currentTurn': opponentKey,
      'gameState.lastAttack': { 
        ability, 
        attackingPlayer 
      }
    });
  },

  createOnlineGameRoom: async (address, stakeDetails) => {
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!telegramUser) {
      throw new Error('Telegram user not found');
    }

    const roomRef = doc(collection(db, 'gameRooms'));
    const roomId = roomRef.id;

    await setDoc(roomRef, {
      id: roomId,
      createdBy: telegramUser.id,
      status: 'waiting',
      players: {
        [telegramUser.id]: {
          telegramId: telegramUser.id,
          username: telegramUser.username,
          characterId: null,
          role: 'creator',
          diceRoll: null,
          wallet: address,
        }
      },
      createdAt: serverTimestamp(),
      gameState: null,
      stakeDetails: stakeDetails,
    });

    set({ 
      roomId, 
      playerTelegramId: telegramUser.id 
    });

    return roomId;
  },

  getStakeDetails: async (roomId) => {
    if (!roomId) throw new Error('No active game room');

    const roomRef = doc(db, 'gameRooms', roomId);
    const roomSnapshot = await getDoc(roomRef);
    const roomData = roomSnapshot.data() as GameRoomDocument;

    return roomData?.stakeDetails;
  },

  joinGameRoom: async (roomId, address) => {
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!telegramUser) {
      throw new Error('Telegram user not found');
    }

    const roomRef = doc(db, 'gameRooms', roomId);
   
    updateDoc(roomRef, {
      [`players.${telegramUser.id}`]: {
        telegramId: telegramUser.id,
        username: telegramUser.username,
        characterId: null,
        role: 'challenger',
        wallet: address,
      },
      status: 'character-select'
    });

    set({
      roomId,
      playerTelegramId: telegramUser.id
    });
},

  findOpenGameRoom: async () => {
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  
    if (!telegramUser) {
      throw new Error('Telegram user not found');
    }
  
    const roomsRef = collection(db, 'gameRooms');
    const q = query(
      roomsRef, 
      where('status', '==', 'waiting'),
      where('createdBy', '!=', telegramUser.id)
    );
  
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      return []; 
    }
  
    const rooms = querySnapshot.docs.map(doc => doc.data() as GameRoomDocument);
  
    return rooms;
  },

  findUserRooms: async () => {
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  
    if (!telegramUser) {
      throw new Error('Telegram user not found');
    }
  
    const roomsRef = collection(db, 'gameRooms');
    
    const q = query(
      roomsRef,
      where('players.' + telegramUser.id, '!=', null) 
    );
  
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      return null;
    }
  
    const rooms = querySnapshot.docs.map(doc => doc.data() as GameRoomDocument);
  
    return rooms;
  },

  init: (roomId) => {
    const roomRef = doc(db, 'gameRooms', roomId);
  
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const roomData = snapshot.data();
  
      set((state) => {
        const newGameState = {
          ...state.gameState,
          player1: {
            ...state.gameState.player1,
            ...roomData?.gameState?.player1,
            character: roomData?.gameState?.player1.character,
          },
          player2: {
            ...state.gameState.player2,
            ...roomData?.gameState.player2,
            id: roomData?.gameState.player2.id || state.gameState.player2.id,
            character: roomData?.gameState?.player2.character,
          },
          currentTurn: roomData?.gameState.currentTurn,
          gameStatus: roomData?.gameState.gameStatus,
          lastAttack: roomData?.gameState.lastAttack,
          diceRolls: roomData?.gameState.diceRolls,
          winner: roomData?.gameState.winner,
          stakeDetails: roomData?.gameState.stakeDetails
        };
  
        return {
          gameState: newGameState,
          roomId,
        };
      });
    });
  
    return unsubscribe;
  }
  , 
}))

export default useOnlineGameStore;