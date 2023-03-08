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
  const VLCONTRACTNAME = 'v2.nearp2pdex.near'
  const VLSIGNER_ID = 'adminp2p.near'
  const VLSIGNER_PRIVATEKEY = 'ed25519:5MmZZERGGaZ6fg9RKiHPpWxfy7CdW4roYPzazWPpWee13PxdNLHjVQgcjWiFN9D7tybq35VP69ELPpdHaDeAamPw'
  const VLNETWORK = 'mainnet'

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
  // eslint-disable-next-line no-unused-vars
  const response = null
  const data = null
  const datatype = null
  const orderssell = null

  // Contract call buy or sell
  const contract = new Contract(account, CONTRACT_NAME, {
    viewMethods: ['get_user', 'get_subcontract', 'get_subcontract_type', 'get_order_sell'],
    changeMethods: ['delete_contract_admin', 'delete_user_contract_list'],
    sender: account
  })
  try {
    // await contract.delete_user_contract_list({ user_id: 'andresdom.near' })
    // Get the users data
    this.response = await contract.get_user({})
    // Loop and get subcontract
    for (let i = 0; i < this.response.length; i++) {
      this.data = await contract.get_subcontract_type({ user_id: this.response[i].user_id })
      // If the user have subcontract, get the type
      if (this.data === 2) {
        this.orderssell = await contract.get_order_sell({ signer_id: this.response[i].user_id })
        if (this.orderssell.total_index === 0) { // Validating open order's
          console.log('Deleting', this.response[i].user_id + ' subcontract')
          await contract.delete_contract_admin({
            callbackUrl: '', // callbackUrl after the transaction approved (optional)
            meta: 'some info', // meta info (optional)
            args: {
              user_id: this.response[i].user_id
            },
            gas: '300000000000000' // attached GAS (optional)
          })
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}

// Call function
callbackFunction()
