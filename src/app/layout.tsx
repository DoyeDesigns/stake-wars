import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Script from "next/script";
import { TelegramProvider } from "@/context/telegram-context";
import { ToastProvider } from "@/context/toast-context";
import ContextProvider from '@/context';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  icons: {
    icon: [
      {
        url: '/favicon-dark.png',
        media: '(prefers-color-scheme: light)'
      },
      {
        url: '/favicon.png',
        media: '(prefers-color-scheme: dark)'
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <ToastProvider>
      <TelegramProvider>
        <ContextProvider cookies={null}>{children}</ContextProvider>
        <Script src="https://telegram.org/js/telegram-web-app.js?56" strategy="beforeInteractive"/>
        <NavBar />
        </TelegramProvider>
      </ToastProvider>
      </body>
    </html>
  );
}
