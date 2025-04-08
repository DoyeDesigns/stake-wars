"use client";

import useOnlineGameStore, {
  GameRoomDocument,
} from "@/store/online-game-store";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CHARACTERS } from "@/lib/characters";
import { compactHash } from "@/components/ConnectButton";

export default function page() {
  const [gameRooms, setGameRooms] = useState<GameRoomDocument[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"highToLow" | "lowToHigh" | null>(null);

  const { findOpenGameRoom } = useOnlineGameStore();
  const router = useRouter();
  const { address } = useAppKitAccount();

  const fetchOpenGameRooms = async () => {
    setLoading(true);
    setError(null);

    try {
      const rooms = await findOpenGameRoom(address as string);
      setGameRooms(rooms || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load game rooms"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenGameRooms();
  }, [address]);

  const handleJoinRoom = async (gameRoomId: string) => {
    if (!gameRoomId) return;
      router.push(`/create-game/?gid=${gameRoomId}`);
  };

  const sortedGameRooms = () => {
    if (!sortBy) return gameRooms;

    return [...gameRooms].sort((a, b) => {
      const aStake = a.stakeDetails?.stakeAmount || 0;
      const bStake = b.stakeDetails?.stakeAmount || 0;

      return sortBy === "highToLow" ? bStake - aStake : aStake - bStake;
    });
  };

  const getCharacterImage = (characterId: string) => {
    const character = CHARACTERS.find((c) => c.id === characterId);
    return character
      ? `/${character.id}.png`
      : "/images/characters/default.png";
  };

  return (
    <div className="h-screen overflow-auto bg-background w-full space-y-4 pb-[150px]">
      <div className="flex justify-between items-center px-4 py-9 pb-4">
        <h2 className="text-white font-bold">Join game</h2>
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-outline text-white hover:border-white hover:bg-background hover:text-white"
            onClick={fetchOpenGameRooms}
          >
            Refresh
          </button>
          <div className="dropdown dropdown-left z-50">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm h-8 btn-outline hover:border-white text-white hover:bg-background hover:text-white"
            >
              Sort By
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button
                  className="bg-transparent"
                  onClick={() => setSortBy("highToLow")}
                >
                  High to Low
                </button>
              </li>
              <li>
                <button
                  className="bg-transparent"
                  onClick={() => setSortBy("lowToHigh")}
                >
                  Low to High
                </button>
              </li>
              <li>
                <button
                  className="bg-transparent"
                  onClick={() => setSortBy(null)}
                >
                  Clear Sort
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-white text-center my-2">
          Loading your game rooms...
        </p>
      )}

      {error && (
        <div className="alert alert-error bg-[#919090]/80 text-white">
          <div className="flex items-center">
            <span>{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && gameRooms.length === 0 && (
        <p className="text-white text-center my-2">No game rooms found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {sortedGameRooms().map((gameRoom) => (
          <div
            key={gameRoom.id}
            className="bg-[#393939] rounded-[5px] text-white shadow-xl"
          >
            <div className=" flex justify-between p-3 h-fit">
              <div className="w-fit text-center">
                <div className="bg-gradient-to-b from-[#6832AE] to-[#FFEFAB] size-[50px] flex justify-center rounded-[4px]">
                  {gameRoom.gameState?.player1.character?.id && (
                    <Image
                      src={getCharacterImage(
                        gameRoom.gameState.player1.character.id
                      )}
                      alt="Character"
                      width={50}
                      height={50}
                    />
                  )}
                </div>
                <h1 className="text-[9px] mt-1">
                  {gameRoom.gameState?.player1.character?.name}
                </h1>
              </div>

              <div>
                <h2 className="text-xs mb-1">
                  {compactHash(gameRoom.createdBy || "")}
                </h2>

                <div className="flex items-center gap-1 mb-4">
                    <Image
                      src="/noto_trophy.png"
                      alt="trophy icon"
                      width={8.15}
                      height={8.15}
                      className="mt-[2px]" 
                      />
                      <p className="text-[9px]">{gameRoom.creatorTotalWins}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleJoinRoom(gameRoom.id)}
                    className="btn btn-sm text-[8px] capitalize bg-[#6832AE] text-white font-bold hover:bg-[#6832AE]/80 border-none"
                  >
                    {gameRoom.stakeDetails?.stakeAmount}{" "}
                    {gameRoom.stakeDetails?.symbol}{" "}
                    <Image
                      src="/monad-small-logo.png"
                      className="-ml-2"
                      alt="monad icon"
                      width={11}
                      height={11}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
