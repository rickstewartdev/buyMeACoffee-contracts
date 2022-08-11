const hre = require('hardhat');

async function main() {
    //get the contract to deploy
    const BuyMeaCoffee = await hre.ethers.getContractFactory("buyMeACoffee");
    const buyMeACoffee = await BuyMeaCoffee.deploy();
    await buyMeACoffee.deployed();
    console.log("buyMeACoffee deployed to ", buyMeACoffee.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});