'use client'

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { compactHash } from "./ConnectButton";
import { useAppKitAccount } from "@reown/appkit/react";
import { wagmiContractConfig } from "@/lib/contract";
import { useBlockNumber, useReadContract } from "wagmi";
import { BigNumberish, formatUnits } from "ethers";
import { useEffect } from "react";
import ProfileTabs from "./ProfileTabs";

export default function UserProfile() {
  const { address } = useAppKitAccount();
  const { data: magmaBalance, refetch } = useReadContract({
      ...wagmiContractConfig,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    });
  
    const humanGMonBalance = magmaBalance
          ? parseFloat(formatUnits(magmaBalance as BigNumberish, 18)).toFixed(2)
          : '0.00';

    const { data: blockNumber } = useBlockNumber({ watch: true })
      
        useEffect(() => {
          // want to refetch every `n` block instead? use the modulo operator!
          // if (blockNumber % 5 === 0) refetch() // refetch every 5 blocks
          refetch()
        }, [blockNumber])

  return (
    <div>
      <Dialog>
        <DialogTrigger className="mt-1">
          <Avatar className="size-[43px]">
            <AvatarImage src="/avater.png" alt="avater" />
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent className="overflow-auto h-[600px]">
          <DialogTitle className="hidden">Search Game Room</DialogTitle>
          <div>
            <div className="flex gap-5 justify-center mb-12">
              <div>
                <div>
                  <div className="w-[94px] h-[94px] rounded-full">
                    <img src="/profile-avater.png" />
                  </div>
                </div>
              </div>

              <div className="text-white">
                <span className="inline-flex gap-[10px] items-center text-[15px] font-normal mt-2 mb-[14px]">
                  <span>
                    <img src="/wallet.png" alt="wallet" />
                  </span>
                  <span className="font-bold text-[18px]">
                    {address ? compactHash(address) : "Not Connected"}
                  </span>{" "}
                  <button className="p-0 mt-px">
                    <img src="/copy.png" alt="copy" width={20} height={20} />
                  </button>
                </span>
                <p><span className="text-[#A78ACE] font-bold">Account balance:</span> {humanGMonBalance} gMON</p>
              </div>
            </div>
            
            <ProfileTabs />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
