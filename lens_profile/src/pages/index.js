import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi"
import { ethers } from "ethers";
import abi from "../pages/abi.json";
import { useState } from 'react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box, Button,Input,Lin 
} from '@chakra-ui/react'

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
    alert("Profile created successfully")
    console.log(tx);
  }
  catch(error){
    alert(error)
  }
    
  }
  return (
    <div> 
      <ConnectButton/>
      <br>
      </br>
      <FormControl>
        <FormLabel>Enter Handle</FormLabel>
        <Input type='text' width='auto' onChange={(e) =>sethandle(e.target.value)} />
        <FormHelperText>Handle should begin with small case letter/Handle should not contain any charchter</FormHelperText>
      </FormControl>
      <br>
      </br>
      <FormControl>
        <FormLabel>Enter Profile image IPFS URI</FormLabel>
        <Input type='text' width='auto' onChange={(e) =>setimage(e.target.value)} />
        <FormHelperText>Enter IPFS URI</FormHelperText>
      </FormControl>
     <br>
     </br>
      <div>
      <Button onClick={() =>createProfile()}>CreateProfile</Button>
      </div>
      <br>
      </br>
      <div>
        <a href="https://mumbai.polygonscan.com/address/0x60Ae865ee4C725cd04353b5AAb364553f56ceF82#readProxyContract" target="_blank">Click here to check your profile via the proxy contract</a>
      </div>
    </div>
        
        
      

   
  )
}
