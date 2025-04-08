import type { Metadata } from "next";

import './globals.css';
import ContextProvider from '@/context'
import NavBar from "@/components/NavBar";
import { headers } from 'next/headers'
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: "Stake Wars",
  description: "A PvP betting game",
  creator: 'DoyeCodes',
  keywords: [
    'appkit',
    'reown',
    'demo',
    'wallet',
    'connect',
    'web3',
    'crypto',
    'blockchain',
    'dapp',
    'betting',
    'gambling',
    'solana',
    'game',
    'mini app',
    'pvp',
    'staking',
    'staking wars',
    'stakingwars',
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get('cookie');

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>{children}</ContextProvider> 
        <NavBar />
        <ToastContainer autoClose={3000} />
      </body>
    </html>
  );
}
