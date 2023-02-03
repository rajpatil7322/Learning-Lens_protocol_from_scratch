// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {


    const Lock = await hre.ethers.getContractFactory("SecretCodeFollowModule");
    const module = await Lock.deploy("0x7836c7cb79b7F3d53e92c95BF43798aDA212fe4E");

    await module.deployed();

    console.log(
        `Module address ${module.address}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});