# Blockchain-Based Application using Hyperledger Fabric with React Client

## 📌 Project Overview

This project is a decentralized application (DApp) built using Hyperledger Fabric as the blockchain backend and React.js as the frontend client.  

The purpose of this project is to demonstrate how to integrate a Hyperledger Fabric network with a React application for asset management.

---

## 🏗️ System Architecture

React Frontend  →  Node.js Backend (Fabric SDK)  →  Hyperledger Fabric Network

Components:
- Peer Nodes
- Orderer
- Certificate Authority (CA)
- Channel (mychannel)
- Smart Contract (Chaincode)

---

## 🛠️ Technologies Used

- Hyperledger Fabric
- Node.js
- Express.js
- React.js
- Docker
- Git
- Ubuntu / WSL

---

## 📂 Project Structure

fabric-project/
│
├── fabric-samples/
├── backend/
├── frontend/
└── install-fabric.sh

---

## ⚙️ Installation Steps

### 1️⃣ Install Fabric Samples

```bash
curl -sSL https://bit.ly/2ysbOFE | bash -s
