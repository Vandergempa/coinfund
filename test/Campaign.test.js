const assert = require("assert");
// the local ganache test network -> it hosts a local test network basically
const ganache = require("ganache-cli");
const Web3 = require("web3");
// need to attach a provider to the web3 instance
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy a contract
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "1368019" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1368019" });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  // This is how you retrieve already deployed contracts: second arg is the deployed address
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("Marks called as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("Can donate to a campaign and marks them as contributors", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "1000000",
    });

    // Verifying if the mapping contains the contributor or not
    const isContributor = await campaign.methods
      .contributors(accounts[1])
      .call();
    assert(isContributor);
  });

  it("Requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: "55",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Allows the manager to make a payout request", async () => {
    await campaign.methods.createRequest("Buy wheels", 1000, accounts[1]).send({
      from: accounts[0],
      gas: "1255812",
    });

    // Verifying if the mapping contains the request or not
    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy wheels", request.description);
  });

  it("processes requests end to end", async () => {
    for (let i = 0; i < 3; i++) {
      await campaign.methods.contribute().send({
        from: accounts[i],
        value: web3.utils.toWei("10", "ether"),
      });
    }

    await campaign.methods
      .createRequest(
        "Test request",
        web3.utils.toWei("10", "ether"),
        accounts[3]
      )
      .send({
        from: accounts[0],
        gas: "1368019",
      });

    for (let i = 0; i < 3; i++) {
      await campaign.methods.approveRequest(0).send({
        from: accounts[i],
        gas: "1368019",
      });
    }

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1368019",
    });

    // Verify that the request has been finalized and recipient paid out
    let targetAddressBalance = await web3.eth.getBalance(accounts[3]);
    targetAddressBalance = web3.utils.fromWei(targetAddressBalance, "ether");
    // We don't want it in string
    targetAddressBalance = parseFloat(targetAddressBalance);

    console.log(targetAddressBalance, "targetAddressBalance");
    // Really just and approximation due to limitations in ganache
    assert(targetAddressBalance > 105);
  });
});
