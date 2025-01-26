"use client";

import React, { useState, useEffect } from "react";
import Step1 from "./features/Step1";
import Step2 from "./features/Step2";
import Image from "next/image";
import Link from "next/link";
import Step3 from './features/Step3';
import { useRouter } from "next/navigation";
import { Character } from "@/lib/characters";
import useOnlineGameStore from "@/store/online-game-store";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { StakeDetails } from "@/store/online-game-store";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import ConnectButton from "@/components/ConnectButton";
import { useSignMessage } from 'wagmi';

function CreateGameMultiStepForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [step1Value, setStep1Value] = useState<number | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [roomStakeDetails, setRoomStakeDetails] = useState<StakeDetails | null>(null)
  const [roomId, setRoomId] = useState('');
  const [roomToJoinId, setRoomToJoinId] = useState<string | null>(null);
  const { createOnlineGameRoom, joinGameRoom, selectCharacters, getStakeDetails } = useOnlineGameStore();

  const router = useRouter();
  const { address, isConnected } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  const { signMessage } = useSignMessage()

  const searchParam = useSearchParams();

  useEffect(() => {
    const roomIdToJoin = searchParam.get('gid');

    if (roomIdToJoin) {
      setRoomToJoinId(roomIdToJoin)
    }
  }, [])

  async function getRoomStakeDetails() {
    const data = await getStakeDetails(roomToJoinId as string);
    setRoomStakeDetails(data as StakeDetails)
  }
  
  if (roomToJoinId) {
    getRoomStakeDetails();
  }

  const stakeDetails : StakeDetails = {
    name: caipNetwork?.name as string,
    stakeAmount: step1Value as number,
    symbol: caipNetwork?.nativeCurrency.symbol as string,
    networkId: caipNetwork?.id as string,
  }

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () =>
    setCurrentStep((prev) => (prev <= 0 || prev === 1 ? 1 : prev - 1));

  const handleSubmit = async () => {
    const formData = {
      amount: step1Value,
      option: selectedCharacter,
    };
    const newRoomId = await createOnlineGameRoom(step1Value, address as string, stakeDetails);
    setRoomId(newRoomId);
    selectCharacters(newRoomId, formData?.option?.id as string);
    handleNext();
  };

  const setStake = (value: number) => {
    signMessage({ message: `sign message to bet` });
    // handleNext();
    console.log(value);
  }

  function joinActiveGameRoom(roomId: string) {
    const formData = {
      amount: step1Value,
      option: selectedCharacter,
    };

    joinGameRoom(roomId, address as string);
    selectCharacters(roomId, formData?.option?.id as string);
    router.push(`/game-play/${roomId}`);
  }

  function FlowButton() { 
    if (roomToJoinId === null)  {
      return <button
      className="bg-primary border-none hover:bg-primary hover:text-white btn text-white h-12 rounded-[5px] w-[349px] mt-[35px]"
      onClick={handleSubmit}
      disabled={!selectedCharacter}
      >
        Next
      </button>
      } else {
        return <button
        className="bg-primary border-none hover:bg-primary hover:text-white btn text-white h-12 rounded-[5px] w-[349px] mt-[35px]"
        onClick={() => joinActiveGameRoom(roomToJoinId)}
        disabled={!selectedCharacter}
        >
          Join game
        </button>
      }
    }

    if (isConnected === false) return (
      <div className="pt-4 h-screen overflow-auto bg-background flex justify-center items-center px-5">
        <div>
        {roomStakeDetails ? (<div>set Network to ${roomStakeDetails.name} to join game</div>) : (<></>)}
        <ConnectButton />
        </div>
      </div>
    )

  return (
    <div className="pt-4 h-screen overflow-auto bg-background flex flex-col items-center px-5">
      <div>
      {currentStep === 3 ? (<></>) : (<div className="relative">
              <button onClick={handleBack} className="absolute top-0 left-0">
                {currentStep === 1 ? (
                  <Link href="/play">
                    <Image
                      src="/arrow-back.png"
                      alt="arrow-back"
                      width={30}
                      height={30}
                    />
                  </Link>
                ) : (
                  <Image
                    src="/arrow-back.png"
                    alt="arrow-back"
                    width={30}
                    height={30}
                  />
                )}
              </button>
            </div>)}
        {currentStep === 1 && (
          <div>
            <Step1 value={step1Value} onChange={setStep1Value} stakeDetails={roomStakeDetails}/>
          </div>
        )}
        {currentStep === 2 && (
          <Step2 selectedItem={selectedCharacter} onSelect={setSelectedCharacter} />
        )}
        {currentStep === 3 && <Step3 roomId={roomId}/>}
      </div>

      <div className="flex justify-center pb-[130px]">
        {currentStep < 2 && (
          <button
            className="bg-primary border-none hover:bg-primary hover:text-white btn !text-white h-12 rounded-[5px] w-[349px] mt-[35px]"
            onClick={() => setStake(step1Value as number)}
            disabled={currentStep === 1 && !step1Value}
          >
            Set Stake
          </button>
        )}
        {currentStep === 2 && (
          <Suspense>
            <FlowButton />
          </Suspense>
        )}
        {currentStep === 3 && (
          <button
            className="bg-white btn font-bold hover:text-primary text-primary hover:bg-white h-12 rounded-[5px] w-fit px-3 mt-[35px]"
            disabled={!selectedCharacter}
            onClick={() => router.push('/play')}
          >
            View game details
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateGameMultiStepForm;
