import Reputation from "./artifacts/contracts/Reputation.sol/Reputation.json";
import './App.css';
import { ethers } from "ethers";
import {useState , useEffect} from 'react';
import Register from "./Components/Register";


function App() {
  const[account , setAccount] = useState("");
  const[provider , setProvider] = useState(null);
  const[contract , setContract] = useState(null);
  const[username , setUserName] =  useState("");
  useEffect(()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async()=>{
      if(provider){
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts",[]);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log(address);
        let contractAddress = "0xA8494B2B189719873a20d8CED1DaA898de9EBC59";
        const contract = new ethers.Contract(contractAddress, Reputation.abi, signer);
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      }else{
        console.log("MetaMask is not installed");
      }
    };
    provider&&loadProvider();
  },[]);

  const RegisterUser=(user)=>{
    
  }
  return (
    <div className="App">
      <Register contract={contract} provider={provider} account={account}/>
    </div>
  );
}
export default App;
