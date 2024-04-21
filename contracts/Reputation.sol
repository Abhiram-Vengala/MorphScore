// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./SoulBound.sol";

contract Reputation {

    address public owner ;

    modifier ownerOnly{if(msg.sender==owner)_;}

    Soulbound public soulbound ;

    constructor(address _soulboundaddrs){
       soulbound = Soulbound(_soulboundaddrs);
    }

    function setOwner(address addr) external ownerOnly{
        owner = addr;
    }

    function Storage() public {
        owner=msg.sender;
    }

    struct Account{
        bool verified;
        uint256 accountProvider;
        string userId;
        bytes32 ipfsproof ;
        uint24 score;
    }

    struct Person{
        string name;
        bytes32 Id ;
        address[] etherAddrs;
        mapping (uint8 => Account) acccounts;
    }

    mapping (bytes32 => Person) public  persons;

    mapping (address => bytes32) public addrToPersonId;

    mapping (address => bool) public addrPresent;

    function bindEtherAddr(address _addr , bytes32 _id) internal {
        addrPresent[_addr] = true;
        addrToPersonId[_addr] = _id;
    }

    function unbindEtherAddr(address _addr ) internal {
        delete addrPresent[_addr];
        delete addrToPersonId[_addr];
    }

    modifier userOnly{require(addrPresent[msg.sender],"Should be a user ");
    _; }

    function resgister(string memory _name)  external   returns (bytes32 id){
        require(!addrPresent[msg.sender],"Already Registered");

        id=keccak256(abi.encode(msg.sender,block.number));

        persons[id].Id = id;

        persons[id].etherAddrs.push(msg.sender);

        persons[id].name = _name;
        
        bindEtherAddr(msg.sender, id);

        soulbound.safeMint(msg.sender , "https://gateway.pinata.cloud/ipfs/QmPgNSWmse3YT7ynzEamF6uWnLN8BiK2WBh7xyAnH1EtWL");

        return  id;

    }

    function linkAddress(address _addr) external  userOnly{
        require(!addrPresent[_addr] , "Address is already Linked");

        bindEtherAddr(
            _addr, addrToPersonId[_addr]);
    }

    function unlinkAddress(address _addr) external userOnly{
        bytes32 id = addrToPersonId[_addr];
        require(addrToPersonId[msg.sender]!=id,"");

        unbindEtherAddr(_addr);
    }

    function linkAccount(uint8 _accountProvider , string memory _userId  ) external userOnly{
        bytes32 id = addrToPersonId[msg.sender];
        Person storage person = persons[id];

        Account memory account ;
        account.verified=false;
        account.accountProvider=_accountProvider;
        account.userId = _userId;
        person.acccounts[_accountProvider]=account;
    }

    function updateAccount(uint8 _accountProvider , bytes32 _id , bool _result , bytes32 _ipfsProof ) internal {
        Person storage person = persons[_id];
        require(person.Id==_id,"");
        
        Account storage account = person.acccounts[_accountProvider];

        require(account.accountProvider!=0," ");

        account.verified=_result;
        account.ipfsproof=_ipfsProof;
    }

    function getScore(uint8 _accountProvider , bytes32 _id) external view  returns (uint24){
        Person storage person = persons[_id];
        require(person.Id==_id,"");

        Account storage account = person.acccounts[_accountProvider];

        return account.score;
    }

    function updateScore(uint8 _accountProvider , bytes32 _id , uint24 _score)external {
        Person storage person = persons[_id];
        require(person.Id==_id,"");

        Account storage account = person.acccounts[_accountProvider];
        account.score+=_score;
    } 
    function getTokenURI()public view returns (string memory ){
        return  soulbound.tokenURI(0);
    }
    function getIdByAddress(address _addr) public view returns(bytes32 ){
        return addrToPersonId[_addr];
    }
}