# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Step to use the MoprhScore app .
1. Clone the repository and install the dependencies
2. Create a .env file with the following code
-----```
   PRIVATE_KEY = "paste your wallet MorphTestnet  address  private key "
   MORPH_TESTNET_URL = "https://rpc-testnet.morphl2.io"
-----```
3. Now open the terminal , compile the contract and deploy the contracts to morphTestnet .
-----```
   npm run compile
   npm run deploy:morphTestnet
-----```
4.After deploying the contracts , Copy the reputation contract address and paste in the contractAddress place in file App.js from front_end directory
5.Now open another terminal and move to fron_end directory and start the react to project .
6. Start using the MorphScore application.

