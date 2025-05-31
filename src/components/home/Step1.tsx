import React from 'react';
import { CHARACTERS, Character as CharacterType } from '@/lib/characters';
import { Button } from '../ui/button';
import { useAppKitAccount } from '@reown/appkit/react';
import ConnectButton from '../ConnectButton';
import { StakeDetails } from '@/store/online-game-store';

interface Step1Props {
  selectedItem: CharacterType | null;
  onSelect: (item: CharacterType) => void;
  next: () => void;
  stakeDetails: StakeDetails | null;
}

function Step1(props: Step1Props) {
  const { selectedItem, onSelect, next, stakeDetails } = props;
  const { isConnected } = useAppKitAccount();

  function FlowButton() {
    if (isConnected) {
      return (
        <Button
          className="text-white bg-[#242B16] border border-white min-h-[42px] text-sm lg:text-base w-[115px] lg:w-[145px] rounded-[7px] hover:cursor-pointer"
          onClick={next}
        >
          {stakeDetails?.stakeAmount !== null ? "Join Game" : "Enter StakeWars"}
        </Button>
      );
    } else {
      return <ConnectButton />
    }
  }

  return (
    <div>
      <div className="flex flex-col text-center">
      <div className="flex flex-col items-center mt-9">
        <img src="/stake-wars-logo.png" alt="stake wars logo" className="size-[320px] hidden sm:block"/>
        <h1 className="font-bold text-2xl -mt-4 mb-1">Choose your clan</h1>
        <p className="font-light text-lg">Choose your warrior and battle for glory.</p>
      </div>

      <div className='flex justify-center mt-11'>
      <div className="grid grid-cols-2 lg:w-[830px] lg:grid-cols-4 gap-7">
        {CHARACTERS.map((item) => (
          <div
            key={item.name} 
            onClick={() => onSelect(item)}
            className={`flex flex-col rounded-[6px] relative justify-end items-center w-[129px] lg:w-[186px] h-[197px] lg:h-[277px] p-4 cursor-pointer overflow-hidden ${
              selectedItem?.name === item.name ? 'outline-1 outline-[#E8E8E8] outline-offset-[11px] shadow-[0px_4px_7.2px_3px_rgba(191,229,40,0.39)]' : ''
            }`}
          >
                <div className={`absolute -z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full`}>
                  <img className={`border-5 border-black h-full w-full rounded-[6px]`} src={`/${item.id}.png`} alt={item.name}/>
                </div>
                <div className='relative z-10'>
                  {selectedItem?.name === item.name && <FlowButton />}
                </div>
          </div>
        ))}
      </div>
      </div>
    </div>
    </div>
  );
}

export default Step1;
