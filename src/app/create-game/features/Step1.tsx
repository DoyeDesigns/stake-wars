import React from 'react';
import Image from 'next/image';
import { StakeDetails } from '@/store/online-game-store';
import { useAppKitNetwork } from "@reown/appkit/react";
import HowToPlay from '@/components/HowToPlay';

interface Step1Props {
  value: number | null;
  onChange: (value: number) => void;
  stakeDetails: StakeDetails | null;
}

const tokenAmounts = [0.5, 1, 2, 5, 7];

const Step1: React.FC<Step1Props> = ({ value, onChange, stakeDetails }) => {
  const handlePresetClick = (amount: number) => {
    onChange(amount);
  };

    const { caipNetwork } = useAppKitNetwork();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='flex justify-center mb-4'>
        <Image
          src="/stake-wars-logo.png"
          alt="Create Game Header Image"
          width={135}
          height={76}
        />
      </div>
      <div className='flex items-center justify-between mb-5 w-full'>
      <h1 className='font-bold text-[19px] text-white text-center'>Stake {caipNetwork?.nativeCurrency?.symbol}</h1>
      <HowToPlay iconSize={12} textSize='text-sm' />
      </div>

      <div className='w-[350px] rounded-[10px] bg-[#1A1A1A] h-fit border border-[#3B3B3B] px-6 pt-[18px] pb-[35px]'>
      <div className='flex items-center justify-between mb-7'>
        <span className='text-white text-[15px]'>Select {caipNetwork?.nativeCurrency?.symbol} Amount</span>
        <span className='bg-white rounded-[7px] h-[38px] px-[10px] inline-flex justify-center items-center text-primary font-extrabold text-[15px]'>{caipNetwork?.nativeCurrency?.symbol}</span>
      </div>

      <div className='flex flex-wrap gap-2 mb-[30px]'>
        {tokenAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handlePresetClick(amount)}
            className={`${amount === value ? 'bg-[#FEC805] text-black' : 'bg-[#414141] text-white'} px-4 !rounded-[8px] h-[34px] text[15px] w-fit`}
          >
            {amount.toLocaleString()}
          </button>
        ))}
      </div>

      <div>
        {stakeDetails?.stakeAmount && (<span className='text-white !mb-2'>You must stake same amount as game creator {stakeDetails?.stakeAmount} {stakeDetails.symbol} ({stakeDetails.name})</span>)}
        <input
          id="step1-input"
          type="number"
          min="0"
          value={stakeDetails ? stakeDetails?.stakeAmount : value as number}
          placeholder="Custom Stake"
          onChange={handleInputChange}
          className='bg-[#414141] rounded-[5px] h-12 w-full px-[25px] text-white'
        />
      </div>
      </div>
    </div>
  );
};

export default Step1;
