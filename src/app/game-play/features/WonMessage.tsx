"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { StakeDetails } from "@/store/online-game-store";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useWriteContract } from "wagmi";
import { wagmiStarkWarsContractConfig } from "@/lib/contract";

type WonMessageProps = {
  stakeDetails: StakeDetails;
  roomId: string;
};

export default function WonMessage({ stakeDetails, roomId }: WonMessageProps) {
  const router = useRouter();
  const { writeContractAsync } = useWriteContract();

  async function claimPot() {
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
    <div className="bg-[#191919]/60 h-full top-0 left-0">
        <div className="flex flex-col justify-center items-center h-full">
          <div className='flex justify-end w-[60%] -mt-20'>
        </div>
          <img
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
                {(stakeDetails.stakeAmount * 2).toLocaleString()} g{stakeDetails.symbol}
              </span>
            </div>
            <Button onClick={() => router.push('/')} className="border-none cursor-pointer bg-white text-[#381B5D] font-bold text-[12px] w-[190px] h-[38px] rounded-[4px]">
              <img
                src="/rematch.png"
                alt="winner-bg"
                width={24}
                height={24}
              />{" "}
              Rematch
            </Button>
            <Button
              onClick={() => router.push('/')}
              className="border-none bg-white cursor-pointer text-[#381B5D] font-bold text-[12px] w-[190px] h-[38px] rounded-[4px]"
            >
              <img src="/exit.png" alt="winner-bg" width={24} height={24} />{" "}
              Exit Game
            </Button>
            <Button
              onClick={() => claimPot()}
              className="border-none bg-[#B91770] hover:bg-[#B91770]/80 cursor-pointer text-[#381B5D] font-bold text-[12px] w-[190px] h-[38px] rounded-[4px]"
            >
              <img src="/exit.png" alt="winner-bg" width={24} height={24} />{" "}
              Claim Pot
            </Button>
          </div>
        </div>
    </div>
  );
}
