import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";

import musicICO from "./MusicICO.json";
import musicNFT from "./MusicNFT.json";
import theBlockchainCoders from "./TheBlockchainCoders.json";

//OWNER ADDRESS
export const OWNER_ADDRESS = "0xb309098bcB51E5C687a16FA41bD6055f47c9eBb0";
export const VERIFY_AMOUNT = 0.00005;
export const CREDIT_AMOUNT = 0.00005;
export const REWARD_TOKEN = 5;
export const rewardLock = 5;

//OLD
// TOKEN ThebBlockchainCoders
export const thebBlockchainCoders_Add =
  "0x0513D7BDcC386C1FEAc99450E00305E70C6EBe0A";
//NEW
// export const thebBlockchainCoders_Add =
//   "0x016BdD1d5D941621818ac0Fec64Bf4b0b75f0A73";
const theBlockchainCoders_ABI = theBlockchainCoders.abi;

//ICO CONTRACT
//OLD
// const musicICO_Address = "0x67Ca9C27F70C328995ADDB22Ba13573A6f685c30";

const musicICO_Address = "0x83965EF44D41E2D95C5d876e7f82c973b83b375b";
const musicICO_ABI = musicICO.abi;
//MUSIC NFT CONTRACT

//OLD
export const musicNFT_Address = "0xC41924CE92aA57F717e250a0319fd9577377646F";
//NEW
// export const musicNFT_Address = "0x7E3d0d1dD2B81f5D399762Fb0d181dA50c137F5b";
const musicNFT_ABI = musicNFT.abi;

//NETWORK
const networks = {
  moonbase_alpha: {
    chainId: `0x${Number(1287).toString(16)}`,
    chainName: "Moonbase Alpha",
    nativeCurrency: {
      name: "GLMR",
      symbol: "GLMR",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-amoy.polygon.technology/"],
    blockExplorerUrls: ["https://www.oklink.com/amoy"],
  },
  fantom_sonic: {
    chainId: `0x${Number(64240).toString(16)}`,
    chainName: "",
    nativeCurrency: {
      name: "FTM",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: ["https://rpcapi.sonic.fantom.network/"],
    blockExplorerUrls: ["https://public-sonic.fantom.network"],
  },
  base: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "base",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/polygon"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/bsc"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
};

const changeNetwork = async ({ networkName }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...networks[networkName],
        },
      ],
    });
  } catch (err) {
    console.log(err.message);
  }
};

const handleNetworkSwitch = async () => {
  const networkName = "polygon_amoy";
  await changeNetwork({ networkName });
};

export const connectWallet = async () => {
  try {
    if (!ethereum) return alert("Please install MetaMask.");
    const network = await handleNetworkSwitch();
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  } catch (error) {
    console.log(error);

    throw new Error("No ethereum object");
  }
};

//---FETCHING SMART CONTRACT
const fetchContract = (address, abi, signer) =>
  new ethers.Contract(address, abi, signer);

//---MUSIC NFT
export const MUSIC_NFT_CONTARCT = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(musicNFT_Address, musicNFT_ABI, signer);
    return contract;
  } catch (error) {
    console.log("Something went wrong while connecting with contract", error);
  }
};

//---MUSIC ICO
export const MUSIC_ICO_CONTARCT = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(musicICO_Address, musicICO_ABI, signer);
    return contract;
  } catch (error) {
    console.log("Something went wrong while connecting with contract", error);
  }
};

export const fetchMusicNFT = async (_tokenId) => {
  try {
    connectWallet();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = fetchContract(musicNFT_Address, musicNFT_ABI, signer);

    const musicData = await contract.getMusicNFTDetails(_tokenId);
    const tokenURI = await contract.tokenURI(_tokenId);

    console.log(tokenURI);

    const musicInfo = await axios.get(tokenURI, {});

    const musicNFT = {
      title: musicInfo.data.title,
      fileURL: musicInfo.data.fileURL,
      imageURL: musicInfo.data.imageURL,
      description: musicInfo.data.description,
      owner: musicData.owner,
      seller: musicData.seller,
      tokenId: _tokenId,
    };

    console.log(musicNFT);
    return musicNFT;
  } catch (error) {
    console.log(error);
  }
};
