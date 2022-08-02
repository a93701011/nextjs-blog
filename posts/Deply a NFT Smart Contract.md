---
title: 'Deply a NFT Smart Contract'
date: '2022-07-31'
tags: 'Blockchain'
---

### installation
1. nodejs (https://nodejs.org/en/)
2. truffle (https://trufflesuite.com/truffle/)
3. gabache (https://trufflesuite.com/ganache/)
4. remix IDE for online testing (https://remix.ethereum.org/)


### init

```
npm init -y  // inital project package.json
truffle init // smart contract truffle-config.js 
npm install @openzeppelin/contracts
```

### init erc721a
`npm install --save-dev erc721a`

### init verify contract
`npm install -D truffle-plugin-verify`

### deploy

*development 要打開ganche
truffle-config setting


```javascript=
 development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,
      gasPrice: 80000000000,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
```
```
truffle console --network development

compile --all
migrate --reset
```


### Create a New Account
npm install -g mnemonics
`npx mnemonics`
sea thought humor advice desert mesh tourist fatal cricket genre gesture mechanic


### deploy testnet rinkeby

* npm install @truffle/hdwallet-provider
* An Infura project ID (or a public node provider of your choice)
	 installed
* Configure truffle-config.js for Rinkeby network
* A funded testnet account and mnemonic use npx mnemonic to create account
* A secrets.json or another secret-management solution. Make sure you don’t commit this to GitHub!

```javascript=
//truffle-config.js
 const { projectId, mnemonic, etherscanApiKey } = require('./secrets.json');
 const HDWalletProvider = require('@truffle/hdwallet-provider');

rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${projectId}`),
      network_id: 4,       // Rinkeby's id
      gas: 13000000,        
      gasPrice: 2000000000,  // 1 gwei (in wei) (default: 100 gwei)
      confirmations: 0,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 300,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
```

```json=
//Secrets.json
{
  "projectId": "1b2b5d2a61d940cc95fxxxxxx558d29",
  "mnemonic": "xxxxx merge very acid lounge xxxxx verify permit frown future nose minor",
  "etherscanApiKey": "U59CVW1D1IC45PNU1DXC7QATWRF2Dxxx"

}
```

### Verify w Truffle a smart contract using OpenZeppin Contract

1. npm install -D truffle-plugin-verify //安裝
2. Configure the plugin in truffle-config.js //設定
3. apply etherscan api key `U59CVW1D1IC45PNU1DXC7QATWRF2DA6M48` 


truffle-config.js

```javascript=
 const { projectId, mnemonic, etherscanApiKey } = require('./secrets.json');
 // Configure your compilers
 compilers: {
    solc: {
       version: "0.8.13",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       }
      //  evmVersion: "byzantium"
      }
    }
  },

  plugins: [
    'truffle-plugin-verify'
    ,"truffle-contract-size"
  ],
  api_keys: {
    etherscan: etherscanApiKey
  },
```


### deploy contract command line

```console
1. truffle console --network rinkeby
2. Truffle compile --all
3. Truffle migrate --network rinkeby --reset
4. npx truffle run verify OCNoobs NoobGenerator --network rinkeby
4. npx truffle run verify LOREMNFT --network rinkeby
npx truffle run verify LOREMNFT --network mainnet
```

### init contract size
`npm install truffle-contract-size`


### verfiy contract size
`npx truffle run contract-size`

![](https://i.imgur.com/6mMjJzd.png)


 Warning: Contract code size exceeds 24576 bytes (a limit introduced in Spurious Dragon). This contract may not be deployable on mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
 
 ### contract optimize
 
 可以透過optimizer code 200
 
 truffle-config.json
```json=
compilers: {
    solc: {
       version: "0.8.13",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       }
      //  evmVersion: "byzantium"
      }
    }
  },

  plugins: [
    'truffle-plugin-verify'
    ,"truffle-contract-size"
  ],
  api_keys: {
    etherscan: etherscanApiKey
  },
```

