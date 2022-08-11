const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/buyMeACoffee.json");

async function main() {
    // Get the contract that has been deployed to Goerli.
    const contractAddress = "0x3C948A59C78824298B954b4d4A6E6C3A068Dde8C";
    const contractABI = abi.abi;

    // Get the node connection and wallet connection.
    const provider = new hre.ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_API_KEY);

    // Ensure that signer is the SAME address as the original contract deployer,
    // or else this script will fail with an error.
    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Instantiate connected contract.
    const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    // Check owner.
    console.log("current owner: ", await buyMeACoffee.getOwner());

    // change owner.

    console.log("changing owner...")
    const withdrawTxn = await buyMeACoffee.changeOwner("0x7472A7301E5F10a78888a34bf9750B5fC161b4E4");
    await withdrawTxn.wait();

    console.log("new owner: ", await buyMeACoffee.getOwner());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });