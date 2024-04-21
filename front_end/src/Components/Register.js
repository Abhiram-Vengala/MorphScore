import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register({ contract, provider, account }) {
    const [username, setUserName] = useState("No User");
    const [addAddress, setAddAddress] = useState("0x");
    const [isregistered, setRegistered] = useState(false);
    const [removeaddr, setRemoveAddr] = useState(null);
    const [gitName, setGitname] = useState(null);
    const [verified, setverified] = useState(false);
    const [accounturl, setAccountUrl] = useState("");
    const [giturl, setGitUrl] = useState('');
    const [id, setId] = useState("");
    const [url, setUrl] = useState("");
    const [score, setScore] = useState(0);
    const [data, setData] = useState("");
    //Let the user register to the Dapp and calls the uri of the soulbound token
    const registerUser = async () => {
        let register = await contract.resgister(username);
        console.log("Transaction Hash ", register.hash);
        await register.wait();
        console.log("Registration Successful");
        getUri();
        setRegistered(true);
    }
    //This code returns the id of the registered user's address.
    const getId = async () => {
        const id = await contract.getIdByAddress(account);
        setId(id);
        console.log(id);
    }
    //returns the uri of the soulbound by getting called upon.
    const getUri = async () => {
        let uri = await contract.getTokenURI();
        setUrl(uri);
        console.log(uri);
        const meta = await axios.get("https://gateway.pinata.cloud/ipfs/QmPgNSWmse3YT7ynzEamF6uWnLN8BiK2WBh7xyAnH1EtWL");
        console.log(meta.data);
        setData(meta.data);
    }
    //Let's the user link another morph ether Address. 
    const LinkAddress = async () => {
        let link = await contract.linkAddress(addAddress);
        const Id = await contract.getIdByAddress(account);
        let updateScore = await contract.updateScore(0, Id, 5);
        console.log("succesfull");
        console.log(score);
        getScore();
        setAddAddress("");
    }
    //let's the user  unlink the morph ether Address. 
    const UnlinkAddress = async () => {
        let unlink = await contract.unlinkAddress(removeaddr);
        const Id = await contract.getIdByAddress(account);
        let updateScore = await contract.updateScore(0, Id, 5);
        console.log("succesful");
        console.log(updateScore);
        getScore();
        setRemoveAddr("");
    }
    //By this function one can get verify the github account and add it to the smart contract 
    const AddAccount = async () => {
        let linkAccount = await contract.linkAccount(1, gitName);
        let updateScore = await contract.updateScore(0, id, 5);
        getScore();
        await axios.get(`https://api.github.com/users/${gitName}`)
            .then((res) => setAccountUrl(res.data.html_url));
        console.log(accounturl, giturl);
        if (giturl === accounturl) {
            setverified(true);
        } else {
            alert("GitHub account on the follwing User Name does not exists , please enter a valid username !!!");
        }
    }
    //This code get the score of the user .
    const getScore = async () => {
        getId();
        let ethscore = await contract.getScore(0, id);
        let tweetscore = await contract.getScore(1, id);
        var score = ethscore + tweetscore;
        setScore(score);
        console.log(score, ethscore, tweetscore);
    }
    useEffect(() => {
    }, [score, url, id]);
    const handleSubmit = async () => {
        getId();
    }
    console.log(id);
    return (
        <div>
            <nav className='nav'>
                <span id='logo'>MorphScore</span>
                <span id='name'>{username}</span>
                <span id='score'>My Score  : {score}</span>
            </nav>
            <div className='regis'>
                <div>
                    <p id='heading'> Register with Morph Address</p>
                    <label id='label'>Username : </label>
                    <input type='text' id='inputlabel' onChange={e => setUserName(e.target.value)}></input>
                    <p ><label id='label' >Account :</label>{account}</p>
                    <button id='bttn' onClick={registerUser}>Register</button>
                </div>
                <div >
                    <p id='para'>The MoprhScore is an on-chain Reputation system with Tokenized credentials </p>
                    <p id='para'>MoprhScore will provide  a soulbound token for the first user  </p>
                    <p id='para'>The account address is automatically fetched from metamask </p>
                </div>
            </div>
            <div className='link'>
                <div id='secondHead'>Link and Unlink An Morph Address</div>
                <input type='text' id='inputlabel1' onChange={e => setAddAddress(e.target.value)}></input>
                <button id='bttn' onClick={LinkAddress}>Link address</button>
            </div>
            <div className='unlink'>
                <input type='text' id='inputlabel1' onChange={e => setRemoveAddr(e.target.value)}></input>
                <button id='bttn' onClick={UnlinkAddress}>unLink address</button>
            </div>
            <div className='account'>
                <h1 id='h1'> Add GitHub Account</h1>
                <label id='label'>Username : </label>
                <input type='text' id='inputlabel1' onChange={e => setGitname(e.target.value)}></input>
                <div></div>
                <label id='label'>Account Url :</label>
                <input type='text' id='inputlabel1' onChange={e => setUrl(e.target.value)}></input>
                <div></div>
                <button id='bttn' onClick={AddAccount}>Verify</button>
                <div>
                    {verified && (<h1>Account Verified !!!</h1>)}
                </div>
            </div>
            <h1 id='h1'> Your Soulbound NFT's </h1>
            <div >
                {isregistered && (<div className='nft'><img id='img' src={data.image} crossOrigin='anonymous'></img>
                    <p id='nftname'>Name : {data.name}</p>
                    <p id='nftdesc'>Description : {data.description}</p></div>
                )}
            </div>
        </div>
    )
}

export default Register
