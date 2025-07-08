# 🥷 Stake Wars

**Stake Wars** is a fast-paced, on-chain strategy game where players mint unique NFT characters and battle each other using dice rolls and staked tokens. It blends DeFi with gaming by letting users stake to get *liquid tokens* (that continue to earn yield) while they fight for glory.

> 🚧 **Note:** We’re actively developing! The current working branch is `version2` (not `main`).

---

## 🎮 Game Overview

**Stake Wars** is built for the modern web3 gamer. Here's how it works:

- **🎭 Mint Your Hero**  
  Each player selects a unique warrior to enter the arena.  
  _(We currently use 4 hardcoded characters while NFT integration is in progress.)_

- **💰 Stake to Play**  
  Players stake *liquid staked tokens* using remote staking (via protocol infrastructure) to join battles. Tokens still earn staking rewards even during gameplay.

- **🎲 Roll for Glory**  
  Players roll dice to determine turn order and battle outcomes. Attacks and defense use strategic abilities influenced by dice rolls.

- **🏆 Winner Takes the Pot**  
  The winning player takes the combined staked tokens, making each game thrilling and high-stakes.

---

## 🔧 Tech Stack

- **Frontend/State Management**: React + Zustand  
- **Backend**: Firebase Firestore  
- **Blockchain Integration**: Liquid staking + remote staking logic via proxy  
- **Real-time Game Rooms**: Powered by Firestore listeners

---

## 📁 Important Branch Info

> The active deployment and development branch is `version2`.  
> Please check out that branch for the most up-to-date code.

---

## 📦 Features in Progress

- NFT character minting  
- In-game token rewards  
- Wallet authentication (via Reown AppKit)  
- On-chain recordkeeping for match outcomes  
- Enhanced game UI/UX

---

## 🤝 Contributing

We're still early, but contributions are welcome! Feel free to clone the `version2` branch, explore the code, and suggest features or fixes.

```bash
git checkout version2
