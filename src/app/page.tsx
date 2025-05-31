"use client";

import React, { useState, useEffect } from "react";
import Step1 from "@/components/home/Step1";
import Step2 from "@/components/home/Step2";
import Step3 from "@/components/home/Step3";
import { useRouter } from "next/navigation";
import { Character } from "@/lib/characters";
import useOnlineGameStore from "@/store/online-game-store";
import { useSearchParams } from "next/navigation";
import { StakeDetails } from "@/store/online-game-store";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  wagmiStarkWarsContractConfig,
} from "@/lib/contract";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [step1Value, setStep1Value] = useState<number | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [roomStakeDetails, setRoomStakeDetails] = useState<StakeDetails | null>(
    null
  );
  const [roomId, setRoomId] = useState("");
  const [roomToJoinId, setRoomToJoinId] = useState<string | null>(null);
  const {
    createOnlineGameRoom,
    joinGameRoom,
    selectCharacters,
    getStakeDetails,
  } = useOnlineGameStore();

  const router = useRouter();
  const { address, isConnected } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  const { data: hash, isPending, writeContractAsync } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const searchParams = useSearchParams();

useEffect(() => {
  const gid = searchParams.get("gid");
  if (gid) {
    setRoomToJoinId(gid);
  }
}, [searchParams]);

useEffect(() => {
  if (roomToJoinId) {
    getRoomStakeDetails(roomToJoinId);
  }
}, [roomToJoinId]);

async function getRoomStakeDetails(roomId: string) {
  try {
    const data = await getStakeDetails(roomId);
    if (!data) throw new Error('No stake details found');
    
    setRoomStakeDetails(data);
    setStep1Value(data.stakeAmount);
  } catch (error) {
    console.error("Error fetching stake details:", error);
    toast.error(`Error loading game room: ${error instanceof Error ? error.message : error}`);
  }
}

  const stakeDetails: StakeDetails = {
    name: caipNetwork?.name as string,
    stakeAmount: step1Value as number,
    symbol: caipNetwork?.nativeCurrency.symbol as string,
    networkId: caipNetwork?.id as string,
  };

  const handleNext = async () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => (prev <= 0 || prev === 1 ? 1 : prev - 1));

  const handleSubmit = async () => {
    const formData = {
      amount: step1Value,
      option: selectedCharacter,
    };

    const newRoomId = await createOnlineGameRoom(
      address as string,
      stakeDetails
    );

    try {
      const createPotHash = await writeContractAsync({
        ...wagmiStarkWarsContractConfig,
        functionName: "createPot",
        args: [`${newRoomId}`, BigInt(formData.amount as number)],
      });

      if (createPotHash) {
        toast.success(
          `CreatePot Transaction Successful! hash: ${createPotHash}`
        );
      }

      setRoomId(newRoomId);
      selectCharacters(
        newRoomId,
        formData?.option?.id as string,
        address as string
      );
    } catch (error) {
      toast.error(`Error creating game room: ${error}`);
      return;
    }

    handleNext();
  };

  async function joinActiveGameRoom(roomId: string) {
    const formData = {
      amount: step1Value as number,
      option: selectedCharacter,
    };

    try {
      const joinPotHash = await writeContractAsync({
        ...wagmiStarkWarsContractConfig,
        functionName: "joinPot",
        args: [`${roomId as string}`],
      });
      if (joinPotHash) {
        toast.success(`JoinPot Transaction Succesful! hash: ${joinPotHash}`);
      }

      joinGameRoom(roomId, address as string);
      selectCharacters(
        roomId,
        formData?.option?.id as string,
        address as string
      );
    } catch (error) {
      toast.error(`Error joining game room: ${error}`);
      return;
    }
    router.push(`/game-play/${roomId}`);
  }

  function FlowButton() {
    if (roomToJoinId === null) {
      return (
        <Button
          className="text-white bg-[#B91770] h-[49px] w-[350px] lg:w-[462px] rounded-[7px] hover:cursor-pointer"
          onClick={handleSubmit}
          disabled={!selectedCharacter || isPending || isConfirming}
        >
          Create game
        </Button>
      );
    } else {
      return (
        <Button
          className="text-white bg-[#B91770] h-[49px] w-[350px] lg:w-[462px] rounded-[7px] hover:cursor-pointer"
          onClick={() => joinActiveGameRoom(roomToJoinId)}
          disabled={!selectedCharacter || isPending || isConfirming}
        >
          Join game
        </Button>
      );
    }
  }

  return (
    <div>
      {currentStep === 1 && (
          <div>
            <Step1
              selectedItem={selectedCharacter}
              onSelect={setSelectedCharacter}
              next={handleNext}
              stakeDetails={stakeDetails}
            />
          </div>
        )}
        {currentStep === 2 && (
          <Step2
            value={step1Value}
            onChange={setStep1Value}
            stakeDetails={roomStakeDetails}
            flowButton={<FlowButton />}
            selectedCharacter={selectedCharacter}
          />
        )}
        {currentStep === 3 && <Step3 roomId={roomId} />}  
    </div>
  );
}
