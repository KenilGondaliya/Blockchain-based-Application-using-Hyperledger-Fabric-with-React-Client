# Hyperledger Fabric CRUD Application

Full-stack CRUD application using:

- Hyperledger Fabric 2.5.15
- Go Chaincode
- Node.js Backend (Express + Fabric SDK)
- React Frontend
- Docker + WSL2 (Windows 11)

---

# 🏗 Architecture

React (Frontend :3000)
        ↓
Node.js (Backend :3001)
        ↓
Fabric SDK (fabric-network)
        ↓
Go Chaincode
        ↓
Ledger (World State)

---

# ⚙️ Environment Requirements

- Windows 11
- WSL2 Ubuntu
- Docker Desktop (WSL integration enabled)
- Node.js v18+
- Go installed inside WSL

---

# 🔥 IMPORTANT VERSION RULE

All Fabric components MUST match version.

We use:

Fabric: 2.5.15  
Fabric CA: 1.5.17  

Install using:

curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/v2.5.15/scripts/install-fabric.sh
chmod +x install-fabric.sh
./install-fabric.sh docker samples binary

⚠️ NEVER use:
hyperledger/fabric/main

That installs Fabric 3.x and causes version mismatch.

---

# 🐳 Docker Permission Fix (WSL)

If you see:

permission denied while trying to connect to docker.sock

Run:

sudo usermod -aG docker $USER

Then restart WSL:

wsl --shutdown

---

# 🚀 Start Network

cd fabric-samples/test-network

./network.sh up createChannel -ca

---

# 📦 Deploy Chaincode

./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go

Check deployment:

peer lifecycle chaincode querycommitted --channelID mychannel --name basic

---

# 🧠 Chaincode Function Signature (Official Sample)

CreateAsset(ctx, id, color, size, owner, appraisedValue)

Backend must send 5 parameters.

---

# 🧪 Testing Chaincode Directly (Without Backend & Frontend)

This section explains how to test the blockchain using Fabric CLI only.

This is useful for:
- Debugging chaincode
- Checking if network works
- Testing before integrating backend
- Verifying parameter issues

---

# ✅ Step 1 — Set Org1 Environment

cd fabric-samples/test-network

source scripts/envVar.sh
setGlobals 1

---

# 🔍 Step 2 — Query Chaincode Definition

peer lifecycle chaincode querycommitted \
--channelID mychannel \
--name basic

---

# ➕ Step 3 — Create Asset (CLI)

Official chaincode requires 5 parameters:

id, color, size, owner, appraisedValue

Example:

peer chaincode invoke -o localhost:7050 \
--ordererTLSHostnameOverride orderer.example.com \
--tls \
--cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
-C mychannel \
-n basic \
--peerAddresses localhost:7051 \
--tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
--peerAddresses localhost:9051 \
--tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \
-c '{"function":"CreateAsset","Args":["asset1","blue","10","keni","1000"]}'

---

# 📖 Step 4 — Read Asset (CLI)

peer chaincode query -C mychannel -n basic \
-c '{"Args":["ReadAsset","asset1"]}'

Expected output:

{
  "ID": "asset1",
  "color": "blue",
  "size": 10,
  "owner": "keni",
  "appraisedValue": 1000
}

---

# 🔄 Step 5 — Update Asset (CLI)

peer chaincode invoke -o localhost:7050 \
--ordererTLSHostnameOverride orderer.example.com \
--tls \
--cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
-C mychannel \
-n basic \
--peerAddresses localhost:7051 \
--tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
--peerAddresses localhost:9051 \
--tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \
-c '{"function":"UpdateAsset","Args":["asset1","red","20","keni","2000"]}'

---

# ❌ Step 6 — Delete Asset (CLI)

peer chaincode invoke -o localhost:7050 \
--ordererTLSHostnameOverride orderer.example.com \
--tls \
--cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
-C mychannel \
-n basic \
--peerAddresses localhost:7051 \
--tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
--peerAddresses localhost:9051 \
--tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \
-c '{"function":"DeleteAsset","Args":["asset1"]}'

---

# 📋 Query All Assets

peer chaincode query -C mychannel -n basic \
-c '{"Args":["GetAllAssets"]}'

---

# 🚨 If peer command not found

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config/

---

# 🧠 Why CLI Testing Is Important

Always verify:

1. Network is running
2. Chaincode is deployed
3. Parameters match function
4. Ledger updates correctly

Only after CLI works should backend & frontend be tested.

# 🖥 Backend Setup

cd backend

npm install

Run only once (after network up):

node enrollAdmin.js
node registerUser.js

Start server:

node server.js

Server runs on:
http://localhost:3001

---

# 💻 Frontend Setup

cd frontend

npm install
npm start

App runs on:
http://localhost:3000

---

# 🔁 Full Reset (When Things Break)

If chaincode sequence issues occur:

cd fabric-samples/test-network
./network.sh down

docker system prune -af
docker volume prune -f
docker network prune -f

Then restart:

./network.sh up createChannel -ca
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go

Delete backend wallet:

rm -rf backend/wallet

Re-enroll:

node enrollAdmin.js
node registerUser.js

---

# ❗ Common Errors & Solutions

----------------------------------------

1️⃣ Error:
incorrect number of params

Cause:
Backend parameters do not match chaincode function.

Fix:
Ensure 5 parameters are passed:
id, color, size, owner, appraisedValue

----------------------------------------

2️⃣ Error:
access denied (DiscoveryService)

Cause:
Wallet contains old certificates after network restart.

Fix:
rm -rf wallet
node enrollAdmin.js
node registerUser.js

----------------------------------------

3️⃣ Error:
No such image: hyperledger/fabric-ccenv:3.1

Cause:
fabric-samples version mismatch (3.x vs 2.5.15)

Fix:
Delete fabric-samples
Reinstall from v2.5.15

----------------------------------------

4️⃣ Error:
permission denied msp folder

Cause:
Network started with sudo.

Fix:
sudo chown -R $USER:$USER .

----------------------------------------

5️⃣ Error:
docker network is required to be running

Cause:
Docker Desktop not running or WSL integration disabled.

Fix:
Enable WSL integration in Docker Desktop.

----------------------------------------

# 📌 Backend API Endpoints

POST   /create
GET    /read/:id
PUT    /update
DELETE /delete/:id

---

# 📌 Future Improvements

- Query All Assets
- Transaction History
- JWT Authentication
- Role-based access
- Production deployment
- Kubernetes support

---

# 👨‍💻 Author Notes

Always:
- Keep Fabric versions consistent
- Never run network with sudo
- Re-enroll wallet after network restart
- Match backend params with chaincode
