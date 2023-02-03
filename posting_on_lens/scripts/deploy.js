// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config({ path: ".env" });

const { readFileSync } = require("fs");
const lenshub_abi = JSON.parse(readFileSync("./abi/lens_hub.json"));

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;


async function main() {
    const alchemyProvider = new hre.ethers.providers.AlchemyProvider('maticmum', API_KEY);

    // Signer
    const signer = new hre.ethers.Wallet(PRIVATE_KEY, alchemyProvider);

    const proxy_contract_address = "0x7582177F9E536aB0b6c721e11f383C326F2Ad1D5"
    const proxy_contract = new hre.ethers.Contract(proxy_contract_address, lenshub_abi, signer);
    const contract_with_signer = proxy_contract.connect(signer);
    const id = await contract_with_signer.getProfileIdByHandle("rajpatil.test");
    const post_data = {
        profileId: hre.ethers.utils.hexZeroPad(hre.ethers.utils.hexlify(id)),
        contentURI: "ipfs://something",
        collectModule: "0x11C45Cbc6fDa2dbe435C0079a2ccF9c4c7051595",
        collectModuleInitData: hre.ethers.utils.defaultAbiCoder.encode(['bool'], ['true']).toString(),
        referenceModule: hre.ethers.constants.AddressZero.toString(),
        referenceModuleInitData: "0x"
    }

    const tx = await contract_with_signer.post(post_data);
    console.log(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});