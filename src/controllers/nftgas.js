const near = require('near-api-js')
const provider = new near.providers.JsonRpcProvider('https://rpc.testnet.near.org')
const metadata = { name: 'nft' } // the metadata for the NFT

async function estimateGas () {
// Estimate the gas required to store the metadata on the blockchain
  const response = await near.connection.provider.gasPrice(null);
  console.log('storageGas', response)
}

estimateGas()
