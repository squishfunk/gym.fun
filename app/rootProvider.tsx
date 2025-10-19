"use client";
import { ReactNode } from "react";
import { base, sepolia, mainnet, Chain } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";
import { WagmiProvider } from 'wagmi'
import { config } from '@/libs/wagmi/config';

export const getChain = (): Chain => {
  const chain = process.env.NEXT_PUBLIC_CHAIN || 'base';
  
  switch (chain) {
    case 'sepolia':
      return sepolia;
    case 'mainnet':
      return mainnet;
    case 'base':
    default:
      return base;
  }
};

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={getChain()}
        config={{
          appearance: {
            mode: "auto",
          },
          wallet: {
            display: "modal",
            preference: "all",
          },
        }}
        miniKit={{
          enabled: true,
          autoConnect: true,
          notificationProxyUrl: undefined,
        }}
      >
        {children}
      </OnchainKitProvider>
    </WagmiProvider>
  );
}
