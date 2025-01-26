import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ExitGameProps {
    showExitOptions: boolean;
    setShowExitOptions: React.Dispatch<React.SetStateAction<boolean>>;
  }

export default function ExitGame({showExitOptions, setShowExitOptions}: ExitGameProps) {
  const router = useRouter();
    const handleClose = () => {
        setShowExitOptions(!showExitOptions); // Update the state from this component
      };
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className='bg-[url("/ability-bg.png")] bg-cover h-[254px] w-[358px] flex justify-center items-center'>
        <div className="flex flex-col justify-center items-center">
          <span className="text-white font-extrabold text-[22px] text-center w-[200px]">
            Are you sure you want to exit?
          </span>
          <button onClick={() => handleClose()} className="btn font-bold text-primary bg-white border-none w-[195px] rounded-[5px]">
            <Image
              src="/arrow-back-orange.png"
              alt="go-back"
              width={16}
              height={16}
            />
            Back to game
          </button>
        </div>
      </div>
      <button onClick={() => router.push('/play')} className="underline font-bold text-[18px] text-white">
        Exit anyway
      </button>
    </div>
  );
}
