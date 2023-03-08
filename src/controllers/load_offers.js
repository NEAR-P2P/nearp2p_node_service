/* eslint-disable no-unused-vars */
/* eslint-disable no-const-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const { CONFIG } = require('../network/api')
const nearAPI = require('near-api-js')
const { Contract, keyStores, KeyPair, Near, Account } = nearAPI

// Callback autodispute
async function callbackFunction () {
  // Near conection
  // eslint-disable-next-line no-undef
  const VLCONTRACTNAME = 'v3.nearp2p.testnet'
  const VLSIGNER_ID = 'merchant2022.testnet'
  const VLSIGNER_PRIVATEKEY = 'ed25519:3euEGajHxAdMvRhhNPjjTxMYwFrWRxdpzJ9vyS6FVbMMNoLxZAMrMftkqSNyZRbmrCXHFTt7oX4AJ1jizVMyBnUK'
  const VLNETWORK = 'testnet'

  const keyStore = new keyStores.InMemoryKeyStore()
  // Connect to network
  // eslint-disable-next-line no-use-before-define
  const config = CONFIG(keyStore, VLNETWORK)
  const CONTRACT_NAME = VLCONTRACTNAME
  const SIGNER_ID = VLSIGNER_ID
  const SIGNER_PRIVATEKEY = VLSIGNER_PRIVATEKEY
  const NETWORK = VLNETWORK

  const keyPair = KeyPair.fromString(SIGNER_PRIVATEKEY)
  keyStore.setKey(NETWORK, SIGNER_ID, keyPair)
  const near = new Near(config)
  const account = new Account(near.connection, SIGNER_ID)

  // Contract call buy or sell
  const contract = new Contract(account, CONTRACT_NAME, {
    viewMethods: [''],
    changeMethods: ['set_offers_sell'],
    sender: account
  })

  try {
    // Get the users data
    // Loop and get subcontract
    for (let i = 0; i < 500; i++) {
      console.log('Row', i)
      await contract.set_offers_sell({
        callbackUrl: '', // callbackUrl after the transaction approved (optional)
        meta: 'some info', // meta info (optional)
        args: {
          owner_id: 'merchant2022.testnet',
          asset: 'NEAR',
          exchange_rate: '0.95',
          amount: '300000000000000000000000000', // (20 / Math.pow(10, 18)).toString(),
          min_limit: '1000000000000000000000000', //  (1 / Math.pow(10, 18)).toString(),
          max_limit: '300000000000000000000000000', // (20 / Math.pow(10, 18)).toString(),
          payment_method: [{ id: 1, payment_method: 'Mercantil' }],
          fiat_method: 1,
          time: 60,
          terms_conditions: 'Mercante verificado'

        },
        gas: '80000000000000', // attached GAS (optional)
        amount: '100000000000000000000000'
      })
    }
  } catch (err) {
    console.log(err)
  }
}

// Call function
callbackFunction()
