const { ethers } = require("hardhat");

const { readFileSync } = require("fs");
const lenshub_abi = JSON.parse(readFileSync("./lenshub_abi.json"));
const whitelist_abi = JSON.parse(readFileSync("./proxy_whitelist_abi.json"));

const alchemyProvider = new ethers.providers.AlchemyProvider('maticmum', "qOMFlY--LjwqYRJX48SMaY0gBnHi2GHE");

// Signer
const signer = new ethers.Wallet("c0b63ba5bb295cc00cfb5f15415756d63a77c2d1d5aa93e4b1011ede6706dabc", alchemyProvider);

// Contract
const proxy_contract_address = "0x7582177F9E536aB0b6c721e11f383C326F2Ad1D5"
const proxy_contract = new ethers.Contract(proxy_contract_address, lenshub_abi, signer);
const contract_with_signer = proxy_contract.connect(signer);

async function getId() {
    const profileId = await contract_with_signer.getProfileIdByHandle("rajpatil.test");
    return (parseInt(profileId))
}

// Whitelisting
const whitelist_contract = "0x1677d9cC4861f1C85ac7009d5F06f49c928CA2AD"
const proxy_whitelist_contract = new ethers.Contract(whitelist_contract, whitelist_abi, signer);
const whitelist_signer = proxy_whitelist_contract.connect(signer);

// async function whitelist_follow_module() {
//     const tx = await whitelist_signer.whitelistFollowModule("0x90706D17Ea1e673FAdCC48858A4197eA16D5017f", true);
//     console.log(tx);
// }

// whitelist_follow_module();

async function setFollowModule() {
    // const id = await getId();
    const data = ethers.utils.defaultAbiCoder.encode(['uint256'], ['42069']);
    console.log(data);
}

setFollowModule()