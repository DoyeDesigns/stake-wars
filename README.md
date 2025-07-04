# 🎮 Stake Wars(A Crypto Combat Arena): PvP Battle Game

<div align="center">
  <img src="![stake-wars-logo](https://github.com/user-attachments/assets/b90c8f0c-a9fe-4920-97b8-15e96e8cc0f7)
" alt="Logo" width="200"/>
</div>

A blockchain-based battling game where players stake SOL, choose unique characters, and engage in dice-driven tactical combat on the Solana chain.

## 🌟 Key Features
- **Multi-Chain Battles** 🔗  
  Powered by Reown AppKit multichain feature for seamless cross-chain interactions
- **SOL Staking** 💰  
  Risk SOL/MON/ETH/vDOT tokens to challenge opponents with 2x reward potential
- **Character System** 🦸  
  4 unique characters with special abilities (Donald Pump, Vladimir Muffin, etc.)
- **Dice-Based Strategy** 🎲  
  Dynamic combat system combining chance and skill
- **Real-Time Firebase Sync** 🔥  
  Live battle tracking and game state management

### Coming Soon

- **NFT character minting**
  One free character NFT on sign-up
- **Polkadot integration**
  Deploying the game smart Contract on Moonbeam parachain
- **liquid staking**
  Utilising liquid staked tokens as game fuel on Solana and Polkadot(Moonbeam)
- **Simpleswap on-ramp**
  Integrating a crypto on-ramp to enable cross-chain swaps
- **In gam tokens as XP**
  Rewarding active players with an ERC-20 token as game XP
- **Discord community**
  A Discord community for hosting guild events and community events, etc.
  
## 🛠 Tech Stack
- **Blockchain**: Reown AppKit (Multi-Chain),
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore, Cloud Functions
- **Auth**: AppKit Wallet Connection (EOA & Smart Accounts)
- **State Management**: Zustand

## 🎮 Gameplay Overview

### 🛡️ Setup Phase

1. **Wallet Connection**
   - Connect multi-chain wallet using Reown AppKit
   - Supported chains: Solana, Ethereum

<div align="center">
  <img src="/public/connect-wallet.gif" alt="Logo" width="200"/>
</div>

2. **Stake SOL**

<div align="center">
  <img src="/public/create-game.gif" alt="Logo" width="200"/>
</div>

## ⚔️ Combat Phase
The combat phase is where players engage in tactical battle using their chosen characters and dice rolls.

### 🔄 Turn Sequence
<div align="center">
  <div style="display: flex; justify-content: center; gap: 20px;">
    <img src="/public/won.gif" alt="Create Game Demo" width="200"/>
    <img src="/public/lost.gif" alt="Join Game Demo" width="200"/>
  </div>
</div>

```mermaid
graph TD
    A[Start Combat] --> B[Player 1 Dice Roll]
    B --> C{Resolve Attack}
    C -->|Damage| D[Player 2 Defense Phase]
    D --> E{Defense Choice}
    E -->|Reflect| F[Return Damage]
    F --> I[Player 2 Turn]
    E -->|Dodge| G[Player 1 Turn Again]
    E -->|Block| H[Reduce Damage]
    H --> I[Player 2 Turn]
```
