import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContextProvider from '@/context'
import { headers } from 'next/headers'
import { ToastContainer } from 'react-toastify';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
      <body
        className={`${inter.variable} antialiased`}
      >
        <div className="min-h-screen bg-[url('/grid-lines.png')] bg-cover bg-center relative pb-24">
        <div className="min-h-screen bg-[url('/bg-gradient.png')] bg-cover bg-center">
        <ContextProvider cookies={cookies}>
          <NavBar />
          {children}
          <Footer />
        </ContextProvider>
        </div>
        </div>
        <ToastContainer autoClose={3000} /> 
      </body>
    </html>
  );
}
