import React from 'react';
import { toast } from 'react-toastify';

function Step3({roomId} : {roomId : string}) {

  function handleClick(roomId: string) {
    navigator.clipboard.writeText(roomId)
    toast.info('Copied room Id to clipboard')
  };

  return (
    <div className='flex flex-col gap-[18px] items-center justify-center mb-[40px] pt-[240px]'>
      <span className='font-bold text-white'>This is your game room ID click to copy <button className='text-primary bg-transparent p-0 animate-pulse' onClick={() => handleClick(roomId)}>{roomId}</button>. Share with a friend to begin battle!</span>
      <span className="loading loading-dots loading-lg bg-primary"></span>
    </div>
  );
}

export default Step3;
