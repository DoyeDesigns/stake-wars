import type { Metadata } from "next";

import './globals.css';
import ContextProvider from '@/context'
import NavBar from "@/components/NavBar";
import Script from "next/script";
import { TelegramProvider } from "@/context/telegram-context";
import { ToastProvider } from "@/context/toast-context";

export const metadata: Metadata = {
  title: "Stake Wars",
  description: "A PvP betting game",
  creator: 'reown, inc.',
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
  return (
    <html lang="en">
      <body>
      <ToastProvider>
      <TelegramProvider>
        <ContextProvider>{children}</ContextProvider>
        <Script src="https://telegram.org/js/telegram-web-app.js?56" strategy="beforeInteractive"/>
        <NavBar />
        </TelegramProvider>
      </ToastProvider>
      </body>
    </html>
  );
}
