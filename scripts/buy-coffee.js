// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address of ${idx} balance`, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said "${message}"`);
  }
}

async function main() {
  //get example accounts
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  //get the contract to deploy
  const BuyMeaCoffee = await hre.ethers.getContractFactory("buyMeACoffee");
  const buyMeACoffee = await BuyMeaCoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("buyMeACoffee deployed to ", buyMeACoffee.address);

  //check balances
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("==start==");
  await printBalances(addresses);

  //give tips
  const tip = {
    value: hre.ethers.utils.parseEther("1")
  };
  await buyMeACoffee.connect(tipper).buyCoffee("Joe", "Have a nice day", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Hannah", "Coffeine addiction support", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Tom", "I love your stupid face", tip);

  //balances after purchase
  console.log("== bought coffee ==");
  await printBalances(addresses);

  //withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();

  // after withdraw
  console.log("==afterWithdraw==");
  await printBalances(addresses);

  //read all memos
  console.log("==memos==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});