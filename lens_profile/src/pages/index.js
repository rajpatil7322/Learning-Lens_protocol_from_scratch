import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi"
import { ethers } from "ethers";
import abi from "../pages/abi.json";
import { useState } from 'react'
import { Box, Button, Flex, Heading, Input, Spinner } from "@chakra-ui/react"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [handle, sethandle] = useState("")
  const [image, setimage] = useState("")

  const { address } = useAccount()
  console.log(handle);
  console.log(image);

  async function createProfile(){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const proxy_address = "0x420f0257D43145bb002E69B14FF2Eb9630Fc4736";
    const LensContract = new ethers.Contract(proxy_address, abi, signer);
    const data = {
      to: address.toString(),
      handle: handle.toString(),
      imageURI: image.toString(),
      followModule: ethers.constants.AddressZero,
      followModuleInitData: ethers.constants.HashZero,
      followNFTURI: "follow"
  }
  try{
    const tx=await LensContract.proxyCreateProfile(data);
    alert("Profile")
    console.log(tx);
  }
  catch(error){
    alert(error)
  }
    
  }
  return (
    <div>
      
      <ConnectButton
                    accountStatus={{
                        smallScreen: "avatar",
                        largeScreen: "full",
                    }}
                />
        
   
              <input 
                type="text" 
                placeholder="Enter handle" 
                onChange={(e) => sethandle(e.target.value)} 
              />
              <br/> 
              <h4>Handle should begin with small case letter/Handle should not contain any charchter</h4>
              <input 
                type="text" 
                placeholder="Enter the image uri" 
                onChange={(e) => setimage(e.target.value)} 
              />
              <button onClick={() =>createProfile()}>CreateProfile</button>
    </div>
        
        
      

   
  )
}
