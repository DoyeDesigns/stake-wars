'use client';

import { useRef, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useBlockNumber, useReadContract, useWriteContract } from 'wagmi';
import { wagmiContractConfig, wagmiMagmaStakeContractConfig } from "@/lib/contract";
import { useAppKitAccount, useAppKitBalance } from "@reown/appkit/react";
import { AdapterBlueprint } from "@reown/appkit/adapters";
import { toast } from 'react-toastify';
import { MoonLoader } from "react-spinners";
import { BigNumberish, formatUnits, parseUnits } from 'ethers';

export default function MagmaLst() {
  const { fetchBalance } = useAppKitBalance();
  const balanceResult = useRef<AdapterBlueprint.GetBalanceResult | null>(null);
  const stakeInRef = useRef<HTMLInputElement>(null);
  const stakeOutRef = useRef<HTMLInputElement>(null);
  const [canStake, setCanStake] = useState(false);

  const unstakeInRef = useRef<HTMLInputElement>(null);
  const unstakeOutRef = useRef<HTMLInputElement>(null);
  const [canUnstake, setCanUnstake] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);

  const { isConnected, address } = useAppKitAccount();
  const { data: magmaBalance, refetch } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  });

  

  const humanGMonBalance = magmaBalance
  ? formatUnits(magmaBalance as BigNumberish, 18)
  : '0';

  const { writeContractAsync } = useWriteContract();

  const { data: blockNumber } = useBlockNumber({ watch: true })
  
    useEffect(() => {
      // want to refetch every `n` block instead? use the modulo operator!
      // if (blockNumber % 5 === 0) refetch() // refetch every 5 blocks
      refetch()
    }, [blockNumber])

  useEffect(() => {
    if (isConnected) {
      fetchBalance().then(r => {
        balanceResult.current = r.data as AdapterBlueprint.GetBalanceResult;
      });
    }
  }, [isConnected, fetchBalance]);
    

  const handleStakeInput = () => {
    const val = stakeInRef.current?.value ?? '';
    if (stakeOutRef.current) stakeOutRef.current.value = val;
    setCanStake(Number(val) > 0);
  };
  const handleStakeMax = () => {
    const max = balanceResult.current?.balance ?? '';
    if (stakeInRef.current && stakeOutRef.current) {
      stakeInRef.current.value = max;
      stakeOutRef.current.value = max;
      setCanStake(Number(max) > 0);
    }
  };
  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    setStakeLoading(true)
    const val = parseUnits(stakeInRef.current!.value, 18);
    try {
      const hash = await writeContractAsync({
        ...wagmiMagmaStakeContractConfig,
        functionName: "depositMon",
        args: [],
        value: val
      });
      toast.success(`Stake Successful! hash: ${hash}`);
    } catch (err) {
      toast.error(`Error staking MON: ${err}`);
    }
    setStakeLoading(false);
  };

  const handleUnstakeInput = () => {
    const val = unstakeInRef.current?.value ?? '';
    if (unstakeOutRef.current) unstakeOutRef.current.value = val;
    setCanUnstake(Number(val) > 0);
  };
  const handleUnstakeMax = () => {
    const max = humanGMonBalance?.toString() ?? '';
    if (unstakeInRef.current && unstakeOutRef.current) {
      unstakeInRef.current.value = max;
      unstakeOutRef.current.value = max;
      setCanUnstake(Number(max) > 0);
    }
  };
  const handleUnstake = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnstakeLoading(true)
    const val = parseUnits(unstakeInRef.current!.value, 18);
    try {
      const hash = await writeContractAsync({
        ...wagmiMagmaStakeContractConfig,
        functionName: "withdrawMon",
        args: [val],
      });
      toast.success(`Unstake Successful! hash: ${hash}`);
    } catch (err) {
      toast.error(`Error unstaking MON: ${err}`);
    }
    setUnstakeLoading(false)
  };

  return (
    <div>
      <Tabs className="w-full" defaultValue="stake">
        <TabsList className="border border-[#A78ACE] h-[47px] rounded-[10px] w-full mb-13">
          <TabsTrigger value="stake" className="cursor-pointer">Stake</TabsTrigger>
          <TabsTrigger value="unstake" className="cursor-pointer">Unstake</TabsTrigger>
        </TabsList>

        <TabsContent value="stake">
          <form onSubmit={handleStake}>
            <Label className="relative block">
              <span className="absolute left-2 bottom-3 flex gap-5 items-center pr-2.5 border-r">
                <span className="flex justify-center items-center gap-1 border-[0.5px] border-white rounded-[5px] h-[37px] w-[94px]">
                  <img src="/monad-logo.png" alt="monad logo" className="size-4" /> MON
                </span>
              </span>
              <div className="flex justify-between w-full mb-2">
                <span className="text-[#A78ACE]">You’re Staking</span>
                <span className="flex items-center gap-2">
                  {balanceResult.current && <p className="truncate">{balanceResult.current.balance}</p>}
                  <Button type="button" onClick={handleStakeMax} className="w-fit h-fit p-0 text-[#A78ACE] font-bold">
                    Max
                  </Button>
                </span>
              </div>
              <Input
                ref={stakeInRef}
                onInput={handleStakeInput}
                step="any"
                min={0}
                inputMode="decimal"
                placeholder="0.00"
                type="number"
                className="h-[58px] text-right border-[#A78ACE] !text-[18px] lg:!text-[28px]"
              />
            </Label>

            <div className="flex justify-center mb-3 mt-6">
              <img src="/arrow-down.png" alt="arrow down" />
            </div>

            {/* gMON out */}
            <Label className="relative block">
              <span className="absolute left-2 bottom-3 flex gap-5 items-center pr-2.5 border-r">
                <span className="flex justify-center items-center gap-1 border-[0.5px] border-white rounded-[5px] h-[37px] w-[94px]">
                  <img src="/gmon-logo.png" alt="magma logo" className="size-4" /> gMON
                </span>
              </span>
              <div className="flex justify-between w-full mb-2">
                <span className="text-[#A78ACE]">To Receive</span>
                <span className="text-[#A78ACE]">0% Slippage</span>
              </div>
              <Input
                ref={stakeOutRef}
                readOnly
                placeholder="0.00"
                type="number"
                className="h-[58px] text-right border-[#A78ACE] !text-[18px] lg:!text-[28px]"
              />
            </Label>
            <div className="flex justify-between w-full mt-2">
                <span className="text-white">1 MON</span>
                <span className="text-white">~1 gMON</span>
              </div>

            <Button
              type="submit"
              disabled={!canStake || stakeLoading}
              className="bg-[#6832AE] cursor-pointer hover:bg-[#6832AE]/60 h-12 w-full mt-17"
            >
              {stakeLoading ? <MoonLoader size={24} color='white' /> : 'Stake'}
            </Button>
          </form>
        </TabsContent>

        {/* UNSTAKE TAB */}
        <TabsContent value="unstake">
          <form onSubmit={handleUnstake}>
            {/* gMON in */}
            <Label className="relative block">
              <span className="absolute left-2 bottom-3 flex gap-5 items-center pr-2.5 border-r">
                <span className="flex justify-center items-center gap-1 border-[0.5px] border-white rounded-[5px] h-[37px] w-[94px]">
                  <img src="/gmon-logo.png" alt="magma logo" className="size-4" /> gMON
                </span>
              </span>
              <div className="flex justify-between w-full mb-2">
                <span className="text-[#A78ACE]">You’re Unstaking</span>
                <span className="flex items-center gap-2">
                  {humanGMonBalance && <p className="truncate">{String(humanGMonBalance)}</p>}
                  <Button type="button" onClick={handleUnstakeMax} className="w-fit h-fit p-0 text-[#A78ACE] font-bold">
                    Max
                  </Button>
                </span>
              </div>
              <Input
                ref={unstakeInRef}
                onInput={handleUnstakeInput}
                step="any"
                min={0}
                inputMode="decimal"
                placeholder="0.00"
                type="number"
                className="h-[58px] text-right border-[#A78ACE] !text-[18px] lg:!text-[28px]"
              />
            </Label>

            <div className="flex justify-center mb-3 mt-6">
              <img src="/arrow-down.png" alt="arrow down" />
            </div>

            {/* MON out */}
            <Label className="relative block">
              <span className="absolute left-2 bottom-3 flex gap-5 items-center pr-2.5 border-r">
                <span className="flex justify-center items-center gap-1 border-[0.5px] border-white rounded-[5px] h-[37px] w-[94px]">
                  <img src="/monad-logo.png" alt="monad logo" className="size-4" /> MON
                </span>
              </span>
              <div className="flex justify-between w-full mb-2">
                <span className="text-[#A78ACE]">To Receive</span>
                <span className="text-[#A78ACE]">0% Slippage</span>
              </div>
              <Input
                ref={unstakeOutRef}
                readOnly
                placeholder="0.00"
                type="number"
                className="h-[58px] text-right border-[#A78ACE] !text-[18px] lg:!text-[28px]"
              />
            </Label>
            <div className="flex justify-between w-full mt-2">
                <span className="text-white">1 gMON</span>
                <span className="text-white">~1 MON</span>
              </div>

            <Button
              type="submit"
              disabled={!canUnstake || unstakeLoading}
              className="bg-[#6832AE] cursor-pointer hover:bg-[#6832AE]/60 h-12 w-full mt-17"
            >
              {unstakeLoading ? <MoonLoader size={24} color='white' /> : 'Unstake'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
