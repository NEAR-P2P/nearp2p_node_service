const { connect, keyStores, utils } = require('near-api-js')
const path = require('path')
const homedir = require('os').homedir()

const CREDENTIALS_DIR = '.near-credentials'
const ACCOUNT_ID = 'merchant2022.testnet'
const CONTRACT_ID = 'v5.nearp2p.testnet'
const METHOD_NAME = 'delete_offers_buy'
const MAX_GAS = '300000000000000'
const ATTACHED_DEPOSIT = '1'

// const ATTACHED_DEPOSIT = '1'

const args = {
  offer_id: 1
}

const credentialsPath = path.join(homedir, CREDENTIALS_DIR)
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath)

const config = {
  keyStore,
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org'
}

calculateGas(CONTRACT_ID, METHOD_NAME, args, ATTACHED_DEPOSIT)

async function calculateGas (contractId, methodName, args, depositAmount) {
  const near = await connect(config)
  const account = await near.account(ACCOUNT_ID)
  await account.sendMoney(
    'andromeda2018.testnet', // receiver account
    '1000000000000000000000000' // amount in yoctoNEAR
  )
  /*
  await account.functionCall({
    contractId,
    methodName,
    args,
    gas: MAX_GAS,
    attachedDeposit: utils.format.parseNearAmount(depositAmount)
  }).then(data => {
    console.log('data', data)
  })
    .catch(err => {
      // console.log('Este es el error', err.cost / Math.pow(10, 24))
      console.log('Este es el error', err)
    }) */
  // console.log('As a result', result)
}
