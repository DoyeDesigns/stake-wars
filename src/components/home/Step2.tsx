import React, { Suspense, useEffect, useState } from 'react';
import { StakeDetails } from '@/store/online-game-store';
import { useAppKitNetwork, useAppKitAccount } from "@reown/appkit/react";
import { Character } from '@/lib/characters';
import { wagmiContractConfig } from '@/lib/contract';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { useWriteContract, useReadContract, useBlockNumber } from 'wagmi';
import StakeDialog from '../StakeDialogue';
import { BigNumberish, formatUnits } from 'ethers';

interface Step2Props {
  value: number | null;
  onChange: (value: number) => void;
  stakeDetails: StakeDetails | null;
  flowButton: React.ReactNode;
  selectedCharacter: Character | null;
}

const tokenAmounts = [0.5, 1, 2, 5, 7, 10, 15, 20];

const Step2: React.FC<Step2Props> = ({ value, onChange, stakeDetails, flowButton, selectedCharacter }) => {
  const handlePresetClick = (amount: number) => {
    onChange(amount);
  };
    const [trxHash, setTrxHash] = useState<string | null>(null)
    const { address } = useAppKitAccount();
    const { data: hash, writeContractAsync } = useWriteContract();

    const { data: magmaBalance, refetch } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      });
    
      
    
      const humanGMonBalance = magmaBalance
      ? parseFloat(formatUnits(magmaBalance as BigNumberish, 18)).toFixed(2)
      : '0.00';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  const approveContract = async (amount: number) => {
    const approveHash = writeContractAsync({
      ...wagmiContractConfig,
      functionName: 'approve',
      args: ['0x4B8a2DdA95d088C64f4E734CE33d7F84F11bb5fe', BigInt(amount)],
    });
    if (approveHash === undefined ||  approveHash === null) {
      throw new Error('Approval transaction failed');
    }
    return approveHash;
  };

  const handleApproveContract = async () => {
    try {
        const data = await approveContract(value as number);
        setTrxHash(hash as string);
        
        toast.success(`Approval Transaction Successful! hash: ${data}`);
    } catch (error) {
      toast.error(`Error in approval process. ${error}`);
    }
  };

  const { data: blockNumber } = useBlockNumber({ watch: true })

  useEffect(() => {
        // want to refetch every `n` block instead? use the modulo operator!
        // if (blockNumber % 5 === 0) refetch() // refetch every 5 blocks
        refetch()
      }, [blockNumber])

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex flex-col rounded-[6px] relative justify-end items-center w-[129px] lg:w-[186px] h-[197px] lg:h-[277px] p-4 overflow-hidden outline-1 outline-[#E8E8E8] outline-offset-[11px] shadow-[0px_4px_7.2px_3px_rgba(191,229,40,0.39)] mb-[53px]`}
      >
        <div
          className={`absolute -z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full`}
        >
          <img
            className={`border-5 border-black h-full w-full rounded-[6px]`}
            src={`/${selectedCharacter?.id}.png`}
            alt={selectedCharacter?.name}
          />
        </div>
        <div className="relative z-10">
          <span className="inline-flex justify-center uppercase items-center text-sm lg:text-base text-white bg-[#242B16] border border-white min-h-[42px] w-[115px] lg:w-[145px] rounded-[7px]">
            {selectedCharacter?.id}
          </span>
        </div>
      </div>

      <div className="w-[350px] lg:w-[462px] rounded-[10px] bg-[#1A1A1A] h-fit border border-[#3B3B3B] px-6 pt-[18px] pb-[35px]">
        <div className="flex items-center justify-between mb-7">
          <span className="text-white text-[15px]">
            gMON balance: {humanGMonBalance}
          </span>
          <StakeDialog />
        </div>

        <div className="flex flex-wrap gap-2 mb-[30px]">
          {tokenAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handlePresetClick(amount)}
              className={`${
                amount === value
                  ? "bg-[#9747FF] text-white"
                  : "bg-[#414141] text-white"
              } px-4 !rounded-[8px] h-[34px] text[15px] w-fit`}
            >
              {amount.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="relative">
          {stakeDetails?.stakeAmount && (
            <span className="text-white text-xs !mb-1">
              You must stake same amount as game creator{" "}
              {stakeDetails?.stakeAmount} apr{stakeDetails.symbol} (
              {stakeDetails.name})
            </span>
          )}
          <input
            id="step1-input"
            type="number"
            min="0"
            value={stakeDetails ? stakeDetails?.stakeAmount : (value as number)}
            placeholder="Custom Stake"
            onChange={handleInputChange}
            className="bg-[#414141] rounded-[5px] h-12 w-full px-[25px] text-white"
          />
        </div>
      </div>

      <div className="mt-9">
        {trxHash === null ? (
          <Button
            className="text-white bg-[#B91770] h-[49px] w-[350px] lg:w-[462px] rounded-[7px] hover:cursor-pointer"
            onClick={() => handleApproveContract()}
          >
            Approve amount to spend
          </Button>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>{flowButton}</Suspense>
        )}
      </div>
    </div>
  );
};

export default Step2;