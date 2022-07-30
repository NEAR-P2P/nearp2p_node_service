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
  const VLSIGNER_ID = 'andromeda2018.testnet'
  const VLSIGNER_PRIVATEKEY = 'ed25519:thSfW9dAxbSyNXpbWuJnEvU4wfKZRxrYQffG7KbTH9oe9bj2e8MfpsRqAPJAHyUPubGNJx1hHZMDM2gMgm2fse7'
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
  // eslint-disable-next-line no-unused-vars
  const response = null
  const data = null
  const datatype = null
  const orderssell = null
  const ordersbuy = null
  const offerssell = null
  const offersbuy = null

  // Contract call buy or sell
  const contract = new Contract(account, CONTRACT_NAME, {
    viewMethods: ['get_user', 'get_subcontract', 'get_subcontract_type', 'get_order_sell', 'get_order_buy', 'get_offers_sell', 'get_offers_buy'],
    changeMethods: ['delete_contract_admin'],
    sender: account
  })

  try {
    // Get the users data
    this.response = await contract.get_user({})
    // Loop and get subcontract
    for (let i = 0; i < this.response.length; i++) {
      this.data = await contract.get_subcontract({ user_id: this.response[i].user_id })
      // If the user have subcontract, get the type
      if (this.data === true) {
        this.datatype = await contract.get_subcontract_type({ user_id: this.response[i].user_id })
        this.orderssell = await contract.get_order_sell({ signer_id: this.response[i].user_id })
        this.ordersbuy = await contract.get_order_buy({ signer_id: this.response[i].user_id })
        this.offerssell = await contract.get_offers_sell({ owner_id: this.response[i].user_id })
        this.offersbuy = await contract.get_offers_buy({ owner_id: this.response[i].user_id })
        // eslint-disable-next-line eqeqeq, no-mixed-operators
        if (this.response[i].user_id != 'estelar.testnet' && this.datatype === 2 || this.orderssell.data.length > 0 || this.ordersbuy.data.length > 0 || this.offersbuy.data.length > 0 || this.offerssell.data.length > 0) {
          console.log('Deleting', this.response[i].user_id + ' subcontract')
          await contract.delete_contract_admin({
            callbackUrl: '', // callbackUrl after the transaction approved (optional)
            meta: 'some info', // meta info (optional)
            args: {
              user_id: this.response[i].user_id
            },
            gas: '80000000000000' // attached GAS (optional)
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
