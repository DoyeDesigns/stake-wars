"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { Button } from "./ui/button";

export const compactHash = (hash: string | null | undefined) => {
  if (!hash || typeof hash !== "string" || hash.length < 12) return "";
  return `${hash.substring(0, 7)}...${hash.substring(hash.length - 5)}`;
};

export default function ConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const networkData = useAppKitNetwork();

  const compactAddress = compactHash(address || "");

  return (
    <div>
      {networkData.caipNetworkId !== "eip155:123456789" ? <Button
        className="text-white border border-white connect-button-bg min-h-[42px] w-full lg:w-[145px] rounded-[7px] hover:cursor-pointer"
        onClick={() =>open({ view: 'Networks', namespace: 'eip155' })}
      >
        Wrong Network
      </Button> : <Button
        className="text-white border border-white connect-button-bg min-h-[42px] w-full lg:w-[145px] rounded-[7px] hover:cursor-pointer"
        onClick={() =>open()}
      >
        <span className="flex items-center gap-2">
          { isConnected ? (
            <span className="truncate ...">{compactAddress}</span>
          ) : (
            "Connect Wallet"
          )}
        </span>
      </Button>}
    </div>
  );
}
