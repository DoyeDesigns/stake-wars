'use server'    

import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { customNetwork } from './index';
import { wagmiStarkWarsContractConfig } from '@/lib/contract';

const privateKey = process.env.BOT_PRIVATE_KEY as `0x${string}`
const botWallet = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({
  chain: customNetwork,
  transport: http()
});

const botClient = createWalletClient({
  account: botWallet,
  chain: customNetwork,
  transport: http()
});

export const setBotAsAdmin = async () => {
  try {
    const txHash = await botClient.writeContract({
      ...wagmiStarkWarsContractConfig,
      functionName: "setAdmin",
      args: [botWallet.address],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    return receipt.status === 'success';
  } catch (error) {
    console.error('Admin set failed:', error);
    return false;
  }
};

export const autoAssignWinner = async (roomId: string, winnerAddress: string) => {
  try {

    const txHash = await botClient.writeContract({
      ...wagmiStarkWarsContractConfig,
      functionName: "assignWinner",
      args: [roomId, winnerAddress],
    });

    return txHash;
  } catch (error) {
    console.error('Auto-assign failed:', error);
    return
  }
};

export async function initializeBotAdmin() {
    console.log('[BOT] Address:', botWallet.address);
  if (typeof window !== 'undefined') {
    throw new Error('Bot operations must run server-side');
  }
  
  console.log(process.env.BOT_PRIVATE_KEY as `0x${string}`);
  console.log('private key:', privateKey)

  const isAdmin = await publicClient.readContract({
    address: wagmiStarkWarsContractConfig.address,
    abi: wagmiStarkWarsContractConfig.abi,
    functionName: "admin",
  });

  if (isAdmin !== botWallet.address) {
    console.log('Setting bot as admin...');
    await setBotAsAdmin();
  } else {
    console.log('Bot is already admin');
  }
}