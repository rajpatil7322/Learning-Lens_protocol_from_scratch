import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import {createClient  } from 'urql'
import {getChallenge,getDefaultProfile} from './api/queries'
import {authenticate,createPostTypedData} from './api/mutations'
import {ethers,Wallet } from "ethers"
import abi from './api/abi.json';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi"
import { useState,useEffect } from 'react'
import { Box, Button, Flex, Heading, Input, Spinner } from "@chakra-ui/react"


const inter = Inter({ subsets: ['latin'] })




export default function Home() {

  const { address } = useAccount();
  const[provider,setProvider]=useState();
  const[signer,setSigner]=useState();
  const[image,setImage]=useState();
  
  

  async function Connect(){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    setSigner(signer);
    setProvider(provider);
  }

  useEffect(() => {
    Connect();
  }, [])


  
  async function getData(){
    const API="https://api-mumbai.lens.dev"
    const urqlClient = createClient({
      url:API
    })
    const result=await urqlClient.query(getChallenge,{address:address}).toPromise();

    const signature = await signer.signMessage(result.data.challenge.text)
   
    const auth_data=await urqlClient.mutation(authenticate,{ address: address, signature}).toPromise();
 
    const auth_client= createClient({
      url:API,
      fetchOptions: {
        headers: {
          'x-access-token': `Bearer ${auth_data.data.authenticate.accessToken}`
        },
      },
    })

 
    const profile=await auth_client.query(getDefaultProfile,{address:address}).toPromise();

 
    const contentURI=image
    // const id=ethers.utils.hexZeroPad(ethers.utils.hexlify(25296))
    const request = {
      profileId: profile.data.defaultProfile.id,
      contentURI,
      collectModule: {
        freeCollectModule: { followerOnly: true }
      },
      referenceModule: {
        followerOnlyReferenceModule: false
      },
    }
    const post = await auth_client.mutation(createPostTypedData, {
      request
    }).toPromise()
    console.log("Success!!!");
    return post.data.createPostTypedData.typedData.value;
  }
  
  async function post(){
    const data=await getData();
    console.log("ProfileId:",data.profileId);
    console.log("ConetentURI:",data.contentURI);
    console.log("CollectModule_address:",data.collectModule);
    console.log("CollectInitData:",data.collectModuleInitData)
    console.log("RefrenceModuel_address:",data.referenceModule)
    console.log("RefrencemoduleINitdata:",data.referenceModuleInitData)
  
   
    const proxy_address="0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner()
    const LensContract = new ethers.Contract(proxy_address, abi, signer);

    const post_data={
      profileId:data.profileId,
      contentURI:data.contentURI,
      collectModule:data.collectModule,
      collectModuleInitData:data.collectModuleInitData,
      referenceModule:data.referenceModule,
      referenceModuleInitData:data.referenceModuleInitData
    }
    console.log(post_data)
    const tx=await LensContract.post(post_data);
    console.log(tx);
   
  
  }//0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c //0x62d0
  //0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c //0x6369
  
  return (
   <div>
    <ConnectButton/>
    <Input
      color='tomato'
      placeholder="Enter IPFS URI"
      size="xs"
      type="text"
      onChange={(e)=>setImage(e.target.value)}
      />
    <br/>

    <div>
    <Button onClick={() =>post()}>POST</Button>
    </div>
   </div>
  )
}
