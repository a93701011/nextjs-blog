---
title: 'Off-Chain AL use Personal Signature'
date: '2022-07-14'
tags: 'Blockchain'
---

### refer:

Human project
https://betterprogramming.pub/handling-nft-presale-allow-lists-off-chain-47a3eb466e44


https://dev.to/rounakbanik/tutorial-digital-signatures-nft-allowlists-eeb

https://kimiwu.medium.com/%E7%B0%A1%E5%96%AE%E8%81%8A%E8%81%8Aecdsa%E8%88%87ethereum%E7%9A%84sign-message-7a8e79d185c4

projects

Humans Of NFT (HUMAN) https://etherscan.io/address/0x8575B2Dbbd7608A1629aDAA952abA74Bcc53d22A#code

Zoofrenz 
https://etherscan.io/address/0xce141c45619e9adbdbdda5af19b3052ff79d5663#code


### Methods 

1. Merkle Tree 

太麻煩, 因為需要一直更新Merkle Tree 的 Root

2. Lazy mint with signature

Lazy mint = let user to mint
Signature = with some authorize (ie coupons) 常用在AL List, prevent bot to mint

https://blog.openzeppelin.com/workshop-recap-building-an-nft-merkle-drop/

https://github.com/OpenZeppelin/workshops/blob/master/06-nft-merkle-drop/slides/20210506%20-%20Lazy%20minting%20workshop.pdf

Options

1. PersonalSign ECDSA Signature : ECDSA.sol
2. ERC712 SignTypedData : draft-ERC712.sol


### Digital Signature 機制說明

主要透過ECDSA方法來做 Signing Message 變成一個Signature

Data => 需要sign的message AL public address + AL amount
Private Key => Contract admin private key
Public Key => Contract admin public key match Private key


![](https://i.imgur.com/hiMZbuc.png)


* Signer step: Signature step 透過 off-chain private environment 產生 Javascript 
	
	data (hashcode) + Private Key(hex) 透過ECDSA方法 (ether.js , web3.js) signed message 
	
	data = AL Amount+ AL Address 的 Hashcode
	
```javascript=
	const {keccak256 } = require('ethereumjs-util');
	const ethers = require('ethers');

	let coupons = {};

	//infura 節點要付費不然會超過
    let provider = ethers.getDefaultProvider('ropsten' ,{
        infura: '1b2b5d2a61d940cc95ff28267c558d29',
    });
	  
	const signer = new ethers.Wallet(privateKey);

	// address 校正
    const userAddress = ethers.utils.getAddress(result[i]['address']);
    const amount = result[i]['qty']

	//對應到contract  messageDigest = keccak256(abi.encodePacked(allowAmount, sender));
    let message = ethers.utils.solidityPack(["uint256", "address"],[amount , userAddress]);

	let messageHash = ethers.utils.keccak256(message);
	
	// Sign the hashed address
	let messageBytes = ethers.utils.arrayify(messageHash);
	let signature = await signer.signMessage(messageBytes);
		
	let sig = ethers.utils.splitSignature(signature);
    let recovered = await contract.verifyHash(messageHash, sig.v, sig.r, sig.s);
    

```

* Recovery step: 可以 on-chain 或 off-chain , 因為我們透過contract mint 當然是在contract 所以是用 on-chain的方式做 Recovery

	加上已經有的signature(ie the Coupons) 透過 **ecrecover** solidity’s built-in function Recivery Owner Public Address

```solidity=
// ecreciver 
	  address signer = ecrecover(digest, coupon.v, coupon.r, coupon.s);
	  require(signer != address(0), 'ECDSA: invalid signature');
	  return signer == _adminSigner;

// ECDSA

	 function isAllowListAuthorized(
        address sender, 
        uint allowAmount,
        bytes calldata signature
    ) private view returns (bool) {
        bytes32 messageDigest = keccak256(abi.encodePacked(allowAmount, sender));
        bytes32 ethHashMessage = messageDigest.toEthSignedMessageHash();
        return ethHashMessage.recover(signature) == _adminSigner;

    }
     
```

### Signing Messages Details


**Data = AL Address + AL Amount 與 private key 產生 Signed Message**


使用 ethereumjs-utils and ethers Js library, 用JavaScript 產生 Signature


escign 接收 Data hash, Signer 返回 sign message 也是 signature 切片為 r,s,v  
ecrecover signature r,s,v和Data hash 返回public key

The **ecsign** method accepts the hashed data (Buffer) and the signers Private key (also a Buffer) and returns an **ECDSASignature** .


```javascript=
const {
  keccak256,
  toBuffer,
  ecsign,
  bufferToHex,
} = require("ethereumjs-utils");
const { ethers } = require('ethers');
...
// create an object to match the contracts struct
const CouponTypeEnum = {
  Genesis: 0,
  Author: 1,
  Presale: 2,
};
let coupons = {};
for (let i = 0; i < presaleAddresses.length; i++) {
  const userAddress = ethers.utils.getAddress(presaleAddresses[i]);
  const hashBuffer = generateHashBuffer(
    ["uint256", "address"],
    [CouponTypeEnum["Presale"], userAddress]
  );
  const coupon = createCoupon(hashBuffer, signerPvtKey);
  
  coupons[userAddress] = {
    coupon: serializeCoupon(coupon)
  };
}
// HELPER FUNCTIONS
function createCoupon(hash, signerPvtKey) {
   return ecsign(hash, signerPvtKey);
}
function generateHashBuffer(typesArray, valueArray) {
   return keccak256(
     toBuffer(ethers.utils.defaultAbiCoder.encode(typesArray,
     valueArray))
   );
}
function serializeCoupon(coupon) {
   return {
     r: bufferToHex(coupon.r),
     s: bufferToHex(coupon.s),
     v: coupon.v,
   };
}
```

![](https://i.imgur.com/BKoijmi.png)


ether.js library 可以sign message 得到 signature

```javascript=

    let coupons = {};
    let provider = ethers.getDefaultProvider('ropsten' ,{
        infura: '1b2b5d2a61d940cc95ff28267c558d29',
    });

	// let abi = [
    //     "function verifyHash(bytes32, uint8, bytes32, bytes32) public pure returns (address)"
    // ];
    // let contractAddress = '0x80F85dA065115F576F1fbe5E14285dA51ea39260';
    // let contract = new ethers.Contract(contractAddress, abi, provider);

	const owner = '0x1994af3CB1556cB2bdaA826'; 
	const privateKey = '29cf9c10ccbde9588bd84c76393c0cdadcbdba47';
  
	const signer = new ethers.Wallet(privateKey);

	console.log(signer.address)

    console.log(result.length)
    for (let i = 0; i < result.length; i++) {
	
    //校正
    const userAddress = ethers.utils.getAddress(result[i]['address']);
    const amount = result[i]['qty']
 
	// let message = ethers.utils.defaultAbiCoder.encode(["uint256", "address"],[amount , userAddress]); 
    let message = ethers.utils.solidityPack(["uint256", "address"],[amount , userAddress]);
    // let message = ethers.utils.solidityPack(["address"],[userAddress]);

	// Compute hash of the address
	let messageHash = ethers.utils.keccak256(message);
	
	// Sign the hashed address
	let messageBytes = ethers.utils.arrayify(messageHash);
	let signature = await signer.signMessage(messageBytes);

    let sig = ethers.utils.splitSignature(signature);
    let recovered = await contract.verifyHash(messageHash, sig.v, sig.r, sig.s);
    

```

### where does the Signing Messages(Coupons) come from???

Data ( AL Address, AL Mount) + Priveate Key 產生的Signed Message = Signature 需要從dev的環境裡面建立出來, 最後放在安全的環境裡面做一個API接口, 當AL List User 可以透過 Website Mint 會查詢API獲取Signature, 並知道有沒有Signature可以使用, 但Mint的過程是透過Contract 卡控需要可以recover回去admin public key == 一開始設定的admin public key 


![](https://i.imgur.com/6Mttlyq.png)


在我們的private local database 中, 儲存Signing Messages

```json=
  "0xACfae97cf9aa0A7F3966F238b1Bb2E3a86A12c2A": {
        "amount": "10",
        "signature": "0xf37810a19657f250d9f70b6d1e80d4594d138f636078e9d3e00ba5033d6bfb56083b0ddadcc8a641fd153dc1fa7f02ada403697614694c45dcf50dc6f5b336a41c"
    },
    "0x13558e00e15240E2e9565D2ce1b289C228ae444f": {
        "amount": "10",
        "signature": "0x00fe4da10bb823d4e150a8892b9e6eb3564b0b26c8f7be35573634c11f26abf041a19ae734a549a867d721c6b90225101e2e3cd4010b5d5d5656f7c63e75f0f71c"
    },
```

```json=
{
  "0x1813183E1A2a5a...a868A4e1b7610c0": {
    "coupon": {
         "r": "0x77b675bb4808.....674c42bde11618a",
         "s": "0x17baa76756fed.....4b0b9f4a380b8a9",
         "v": 27
    }
}
```



### Verify Signatures

![](https://i.imgur.com/wwlRlDQ.png)

**Data = (AL Address + Amount) + Signature ==>  Public Addree**


signed message prefixed 做法可以參考 
https://learnblockchain.cn/docs/ethers.js/cookbook-signing.html#id3

![](https://i.imgur.com/hpOOsaE.png)


```solidity=
function recoverSigner(bytes32 hash, bytes memory signature) public pure returns (address) {
    bytes32 messageDigest = keccak256(
        abi.encodePacked(
            "\x19Ethereum Signed Message:\n32", 
            hash
        )
    );
    return ECDSA.recover(messageDigest, signature);
}
```
```solidity=

function verifyHash(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public pure
    returns (address signer) {

	bytes32 messageDigest = keccak256("\x19Ethereum Signed Message:\n32", hash);

    return ecrecover(messageDigest, v, r, s);
    }

```
OpenZipperline 簡單來說如要簡單取得 message digest, 可以用ECDSA.toEthSignedMessageHash的方法轉換hash


```
bytes32 messageDigest = keccak256(abi.encodePacked(allowAmount, sender));
        bytes32 ethHashMessage = messageDigest.toEthSignedMessageHash();

```

### Private Key

private key and public key for generating signature 盡量不要用我們deploy contract的Admin 現在用, 可以用一組沒有用過的

```
const { privateToAddress } = require("ethereumjs-utils");
const { ethers } = require("ethers");
const crypto = require("crypto");
const pvtKey = crypto.randomBytes(32);
const pvtKeyString = pvtKey.toString("hex");
const signerAddress = ethers.utils.getAddress(
privateToAddress(pvtKey).toString("hex"));
console.log({ signerAddress, pvtKeyString });
```

set signerAddress 到 contract _adminSigner 這樣就可以基本上很安全


### Lorem Contract Test


create signature

```javascript=

const {keccak256 } = require('ethereumjs-util');
const ethers = require('ethers');
const fs = require('fs'); 

const main = async () => {
    const allowlistedAddresses = [
        '0xa012f237944F02504541CFd39AA18b11304F6BeE',
        '0x4b496aB8b727B4CfE479Bd17d66462aF5Af8BbFd'
    ];
    const allowlistedAddressesAmount = [
        '2',
        '1'
    ];

	let abi = [
        "function verifyHash(bytes32, uint8, bytes32, bytes32) public pure returns (address)"
    ];
    let coupons = {};
   let provider = ethers.getDefaultProvider('ropsten');
  
    let contractAddress = '0x80F85dA065115F576F1fbe5E14285dA51ea39260';
    let contract = new ethers.Contract(contractAddress, abi, provider);
    
	const owner = '0x736e182CA0C9B09F3911717Ed5682E7023619088'; 
	const privateKey = '8221d3d2a831f50c0b546bf9167269bf444911f51a7322eb3b42f0cf808e64d1';

	const signer = new ethers.Wallet(privateKey);

	console.log(signer.address)

    for (let i = 0; i < allowlistedAddresses.length; i++) {
	
    // Get allowlisted address, allowlisted amount
    const userAddress = ethers.utils.getAddress(allowlistedAddresses[i]);
    const amount = allowlistedAddressesAmount[i]
 
	let message = ethers.utils.defaultAbiCoder.encode(
		["uint256", "address"], [amount, userAddress]);
    
	// Compute hash of the message
	let messageHash = ethers.utils.keccak256(message);
	// console.log("Message Hash: ", messageHash);
    
	// Sign the hashed address
	let messageBytes = ethers.utils.arrayify(messageHash);
	let signature = await signer.signMessage(messageBytes);
	// console.log("Signature: ", signature);

    let sig = ethers.utils.splitSignature(signature);
    let recovered = await contract.verifyHash(messageHash, sig.v, sig.r, sig.s);

     coupons[userAddress] = {'amount': amount, 'signature' : signature, 'hashmessage': messageHash, 'recover': recovered}
    }
    
    console.log(coupons)
    fs.writeFileSync("signature.json", JSON.stringify(coupons)); 
	
}


const runMain = async () => {
    try {
        await main(); 
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
```


Eth Contract 

```solidity=
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SignatureTest {

    // using ECDSA for bytes32; 
  
  constructor() {}
  
  address public _adminSigner;
  
  function setSigner(address newSigner) external {
        _adminSigner = newSigner;
    }

    
    function getHash(address sender, uint256 allowAmount) public pure returns (bytes32) {
    
        return  keccak256(abi.encode(allowAmount,sender));
    }

   function verifyAllowListAuthorized(
        address sender, 
        uint256 allowAmount,
        bytes memory signature
    ) public pure returns (address) {
        bytes32 messageDigest = keccak256(abi.encode(allowAmount,sender));
        bytes32 ethHashMessage = ECDSA.toEthSignedMessageHash(messageDigest);
		return ECDSA.recover(ethHashMessage, signature);
	
    }
}
```