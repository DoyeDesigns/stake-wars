import { ActionButtonList } from '@/components/ActionButtonList'
import { InfoList } from '@/components/InfoList'
import ConnectButton from "@/components/ConnectButton";

export default function Home() {
  return (
    <div className="h-screen overflow-auto pb-[150px]">
      <h1 className="page-title">Next.js App Router with Wagmi and Solana Adapters</h1>

    <div className="appkit-buttons-container">
    </div>
    <ConnectButton />
    <ActionButtonList />
    <InfoList />
    </div>
  );
}
