import React from 'react';
import Image from 'next/image';
import { CHARACTERS, Character as CharacterType } from '@/lib/characters';

interface Step2Props {
  selectedItem: CharacterType | null;
  onSelect: (item: CharacterType) => void;
}

function Step2(props: Step2Props) {
  const { selectedItem, onSelect } = props;

  return (
    <div>
      <h2 className="font-bold text-white mb-10 text-center">Select Warrior</h2>
      <div className="flex flex-col w-[350px] gap-4">
        {CHARACTERS.map((item) => (
          <div
            key={item.name} 
            onClick={() => onSelect(item)}
            className={`bg-[#090909] rounded-[10px] relative flex relative items-center justify-between h-[103px] p-4 cursor-pointer ${
              selectedItem?.name === item.name ? 'border-[3px] border-[#FFCE31]' : ''
            }`}
          >
              {selectedItem?.name === item.name && (<Image className='absolute -right-2 -top-2 z-50' src='/check-icon.png' alt='check' height={27} width={27}/>)}
            <div>
              <h3 className="text-white font-bold text-[17px] mb-px">{item.name}</h3>
              <p className="text-secondary text-[13px] font-medium mb-px">Specialty: {item.specialty}</p>
              <div className='flex items-center gap-4'>
                <span className="text-primary text-[13px] font-medium flex gap-2 items-center">
                </span>
                <span className='text-primary text-[13px] font-medium flex gap-2 items-center'>
                </span>
              </div>
            </div>
            <div className='overflow-hidden h-full absolute right-5 z-50'>
            <Image className={`${item.name === 'Vladmir Muffin' ? 'mt-4' : item.name === 'King Barkles III' ? '-mt-2' : ''}`} src={`/${item.id}.png`} alt={item.name} width={101} height={142}/>
            </div>  
          </div>
        ))}
      </div>
    </div>
  );
}

export default Step2;
