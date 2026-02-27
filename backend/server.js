const express = require("express");
const cors = require("cors");
const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const ccpPath = path.resolve(
  __dirname,
  "../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"
);

async function connect() {
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  const wallet = await Wallets.newFileSystemWallet("./wallet");

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: "appUser",
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork("mychannel");
  const contract = network.getContract("basic");
  return contract;
}

// CREATE
app.post("/create", async (req, res) => {
  try {
    const { id, color, size, owner, value } = req.body;
    const contract = await connect();

    await contract.submitTransaction(
      "CreateAsset",
      id,
      color,
      size,
      owner,
      value
    );

    res.send("Asset created");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// READ
app.get("/read/:id", async (req, res) => {
  try {
    const contract = await connect();
    const result = await contract.evaluateTransaction("ReadAsset", req.params.id);
    res.json(JSON.parse(result.toString()));
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// UPDATE
app.put("/update", async (req, res) => {
  try {
    const { id, color, size, owner, value } = req.body;
    const contract = await connect();

    await contract.submitTransaction(
      "UpdateAsset",
      id,
      color,
      size,
      owner,
      value
    );

    res.send("Asset updated");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// DELETE
app.delete("/delete/:id", async (req, res) => {
  try {
    const contract = await connect();
    await contract.submitTransaction("DeleteAsset", req.params.id);
    res.send("Asset deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));