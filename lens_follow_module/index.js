import { Network } from "alchemy-sdk";
import { ethers } from "ethers";
import { readFileSync } from "fs";
const profile_abi = JSON.parse(readFileSync("./profile_abi.json"));

const alchemyProvider = new ethers.providers.AlchemyProvider('maticmum', "qOMFlY--LjwqYRJX48SMaY0gBnHi2GHE");

// Signer
const signer = new ethers.Wallet("c0b63ba5bb295cc00cfb5f15415756d63a77c2d1d5aa93e4b1011ede6706dabc", alchemyProvider);

// Contract
const profile_contract_address = "0x4fe8deB1cf6068060dE50aA584C3adf00fbDB87f"
const profile_contract = new ethers.Contract(profile_contract_address, profile_abi, signer);
const data = {
    to: "0x11E2f924c2C0aB9eb4d62dAf027A71A96c4fCB1C",
    handle: "rajpatil",
    imageURI: "ipfs://something",
    followModule: ethers.constants.AddressZero,
    followModuleInitData: ethers.constants.HashZero,
    followNFTURI: "follow"
}

const contract_with_signer = profile_contract.connect(signer);

const tx = await contract_with_signer.proxyCreateProfile(data);
console.log(tx);