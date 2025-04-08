"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";
import ExitGame from "./ExitGame";
import { useRouter } from "next/navigation";
import { StakeDetails } from "@/store/online-game-store";
import { wagmiStarkWarsContractConfig } from "@/lib/contract";
import { toast } from "react-toastify";



export default function WonMessage(stakeDetails: StakeDetails, roomId: string) {
  const [showExitOptions, setShowExitOptions] = useState(false);
  const router = useRouter();

  const { writeContractAsync } = useWriteContract();

  const handleExitOptions = () => {
    setShowExitOptions((prev) => !prev);
  };

   const claimPot = async () => {
      try {
        const claimPotHash = await writeContractAsync({
          ...wagmiStarkWarsContractConfig,
          functionName: "claimPot",
          args: [roomId],
        });
        if (claimPotHash) {
          toast.success(`JoinPot Transaction Succesful! hash: ${claimPotHash}`);
        }
      } catch (error) {
        toast.error(`Error joining pot: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
      } 
    }

  return (
    <div className="bg-[#191919]/60 h-full w-full top-0 left-0">
      {showExitOptions ? (
        <ExitGame
          showExitOptions={showExitOptions}
          setShowExitOptions={setShowExitOptions}
        />
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className='flex justify-end w-[60%] -mt-20'>
        </div>
          <Image
            src="/winner-background.png"
            alt="winner-bg"
            width={306}
            height={306}
          />
          <div className="flex flex-col justify-center items-center gap-4 -mt-48">
            <div className="flex flex-col justify-center items-center">
              <span className="text-white font-extrabold text-[22px] text-center">
                You Won!!
              </span>
              <span className="text-white font-extrabold text-[22px] text-center">
                {(stakeDetails.stakeAmount * 2).toLocaleString()}{stakeDetails.symbol}
              </span>
            </div>
            <button onClick={() => claimPot()} className="btn border-none gradient-tracker bg-white text-primary font-bold text-[12px] w-[190px] rounded-[10px]">
              Claim Pot
            </button>
            <button onClick={() => router.push('/create-game')} className="btn border-none bg-white text-primary font-bold text-[12px] w-[190px] rounded-[10px]">
              <Image
                src="/rematch.png"
                alt="winner-bg"
                width={24}
                height={24}
              />{" "}
              Rematch
            </button>
            <button
              onClick={() => handleExitOptions()}
              className="btn border-none bg-white text-primary font-bold text-[12px] w-[190px] rounded-[10px]"
            >
              <Image src="/exit.png" alt="winner-bg" width={24} height={24} />{" "}
              Exit Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function useWriteContract(): { writeContractAsync: any; } {
  throw new Error("Function not implemented.");
}

