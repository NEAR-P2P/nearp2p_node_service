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
  // Version 1 data
  const V1VLCONTRACTNAME = 'contract.nearp2pdex.near'
  const V1VLSIGNER_ID = 'adminp2p.near'
  const V1VLSIGNER_PRIVATEKEY = 'ed25519:5MmZZERGGaZ6fg9RKiHPpWxfy7CdW4roYPzazWPpWee13PxdNLHjVQgcjWiFN9D7tybq35VP69ELPpdHaDeAamPw'
  const V1VLNETWORK = 'mainnet'

  // Version 2 data
  const V2VLCONTRACTNAME = 'v2.nearp2pdex.near'
  const V2VLSIGNER_ID = 'adminp2p.near'
  const V2VLSIGNER_PRIVATEKEY = 'ed25519:5MmZZERGGaZ6fg9RKiHPpWxfy7CdW4roYPzazWPpWee13PxdNLHjVQgcjWiFN9D7tybq35VP69ELPpdHaDeAamPw'
  const V2VLNETWORK = 'mainnet'
  const data = null
  const data1 = null

  const keyStore = new keyStores.InMemoryKeyStore()
  // Connect to network
  // eslint-disable-next-line no-use-before-define
  const v1config = CONFIG(keyStore, V1VLNETWORK)
  const V1CONTRACT_NAME = V1VLCONTRACTNAME
  const V1SIGNER_ID = V1VLSIGNER_ID
  const V1SIGNER_PRIVATEKEY = V1VLSIGNER_PRIVATEKEY
  const V1NETWORK = V1VLNETWORK

  // destino
  const v2config = CONFIG(keyStore, V2VLNETWORK)
  const V2CONTRACT_NAME = V2VLCONTRACTNAME
  const V2SIGNER_ID = V2VLSIGNER_ID
  const V2SIGNER_PRIVATEKEY = V2VLSIGNER_PRIVATEKEY
  const V2NETWORK = V2VLNETWORK

  const keyPair = KeyPair.fromString(V1SIGNER_PRIVATEKEY)
  keyStore.setKey(V1NETWORK, V1SIGNER_ID, keyPair)
  const near = new Near(v1config)
  const account = new Account(near.connection, V1SIGNER_ID)

  const keyPair2 = KeyPair.fromString(V2SIGNER_PRIVATEKEY)
  keyStore.setKey(V2NETWORK, V2SIGNER_ID, keyPair2)
  const near2 = new Near(v2config)
  const account2 = new Account(near2.connection, V2SIGNER_ID)

  // Contract call buy or sell
  const contract = new Contract(account, V1CONTRACT_NAME, {
    viewMethods: ['get_fiat_method', 'get_user', 'get_payment_method', 'get_payment_method_user', 'get_merchant'],
    changeMethods: [''],
    sender: account
  })

  const contract2 = new Contract(account, V2CONTRACT_NAME, {
    viewMethods: [''],
    changeMethods: ['set_payment_method_user_admin', 'put_merchant'],
    sender: account2
  })

  try {
    // Get the users data
    // Loop and get subcontract
    this.data = await contract.get_user({
      callbackUrl: '', // callbackUrl after the transaction approved (optional)
      meta: 'some info', // meta info (optional)
      args: {}
    })
    // console.log(this.data)
    for (let i = 0; i < this.data.length; i++) {
      // console.log(this.data[i].user_id)
      this.data1 = await contract.get_merchant({
        user_id: this.data[i].user_id
      })
      if (this.data1.length > 0) {
        for (let x = 0; x < this.data1.length; x++) {
          console.log(this.data1[x].user_id)
          await contract2.put_merchant({
            callbackUrl: '', // callbackUrl after the transaction approved (optional)
            meta: 'some info', // meta info (optional)
            args: {
              user_id: this.data1[x].user_id,
              total_orders: this.data1[x].total_orders,
              orders_completed: this.data1[x].orders_completed,
              percentaje_completion: this.data1[x].percentaje_completion,
              badge: this.data1[x].badge,
              is_merchant: this.data1[x].is_merchant
            }
          })
        }
        /*
        await contract2.set_payment_method_user_admin({
          callbackUrl: '', // callbackUrl after the transaction approved (optional)
          meta: 'some info', // meta info (optional)
          args: {
            user_id: this.data1[i].user_id,
            payment_method_id: parseInt(this.data1[i].payment_method_id),
            input1: this.data[i].input1,
            input2: this.data[i].input2,
            input3: this.data[i].input3,
            input4: this.data[i].input4,
            input5: this.data[i].input5
          }
        }) */
      }
      /*
      if (this.data[i].user_id !== 'andresdom.near') {
        await contract2.set_user_admin({
          callbackUrl: '', // callbackUrl after the transaction approved (optional)
          meta: 'some info', // meta info (optional)
          args: {
            user_id: this.data[i].user_id,
            name: this.data[i].name,
            last_name: this.data[i].last_name,
            phone: this.data[i].phone,
            email: this.data[i].email,
            country: 'N/A',
            campo1: '',
            campo2: '',
            campo3: ''
          }
        })
      } */
    }
  } catch (err) {
    console.log(err)
  }
}

// Call function
callbackFunction()
