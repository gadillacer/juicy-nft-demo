This is a React app that utilizes the Biconomy SDK for testing Smart Contract Wallets. The goal is to enhance user experience.

### How to Run
1. Clone the repository
2. Create your .env file with `REACT_APP_BICONOMY_DAPP_KEY` variable
3. Run `yarn install`
4. Run `yarn start`

### Note
If you want to use NFT-pay later on Jucci:
1. You should connect with a Web3 wallet (e.g., MetaMask) instead of using social login.
2. Click "Mint to EOA" instead of "Mint NFT"

***Troubleshooting***

If you encounter an AA21 error, follow this step: Transfer Mumbai $MATIC (~0.1) to your smart contract address.

### Features
1. Social Login
2. Gasless Transactions
3. Batch Transactions (WIP)


Please expect bugs as the SDK is still in development. It may be replaced with another SDK in the future.