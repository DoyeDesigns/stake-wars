# 🎮 Stake Wars(A Crypto Combat Arena): PvP Battle Game

<div align="center">
  <img src="./public/stake-wars-logo.png" alt="Logo" width="200"/>
</div>

A blockchain-based battling game where players stake SOL, choose unique characters, and engage in dice-driven tactical combat on the Solana chain.

## 🌟 Key Features
- **Multi-Chain Battles** 🔗  
  Powered by Reown AppKit multichain feature for seamless cross-chain interactions
- **SOL Staking** 💰  
  Risk SOL tokens to challenge opponents with 2x reward potential
- **Character System** 🦸  
  4 unique characters with special abilities (Donald Pump, Vladmir Muffin, etc.)
- **Dice-Based Strategy** 🎲  
  Dynamic combat system combining chance and skill
- **Real-Time Firebase Sync** 🔥  
  Live battle tracking and game state management

## 🛠 Tech Stack
- **Blockchain**: Reown AppKit (Multi-Chain), Solana Program Library
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore, Cloud Functions
- **Auth**: AppKit Wallet Connection (EOA & Smart Accounts)
- **State Management**: Zustand

## 🎮 Gameplay Overview

### 🛡️ Setup Phase
<div align="center">
  <img src="/public/create-game.gif" alt="Logo" width="200"/>
</div>

1. **Wallet Connection**
   - Connect multi-chain wallet using Reown AppKit
   - Supported chains: Solana, Ethereum
2. **Stake SOL**
   ```typescript
   interface StakeDetails {
     stakeAmount: number;
     symbol: "SOL";
     networkId: string;
   }
   ```

## ⚔️ Combat Phase
The combat phase is where players engage in tactical battle using their chosen characters and dice rolls.

### 🔄 Turn Sequence
![Combat Flow](/path/to/combat-flow.gif)

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

## 🚀 Getting Started

### 📥 Installation
```bash
git clone https://github.com/DoyeDesigns/stake-wars.git
cd stake-wars
npm install
```