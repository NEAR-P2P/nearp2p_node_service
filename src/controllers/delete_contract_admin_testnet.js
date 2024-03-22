/* eslint-disable no-unused-vars */
/* eslint-disable no-const-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
require('dotenv').config()
const { CONFIG } = require('../network/api')
const nearAPI = require('near-api-js')
const { Contract, keyStores, KeyPair, Near, Account } = nearAPI
const gql = require('graphql-tag')
const ApolloClient = require('apollo-client').ApolloClient
const fetch = require('node-fetch')
const createHttpLink = require('apollo-link-http').createHttpLink
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache

const client = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/hrpalencia/p2p',
    fetch
  }),
  cache: new InMemoryCache()
})

let users = []

const fetch_users = async () => {
  const query = gql`
    query MyQuery {
        datausers {
          user_id
        }
      }
    `
  try {
    const result = await client.query({
      query
    })
    users = result.data.datausers
  } catch (error) {
    console.log(error)
    users = []
  }
}

// Callback autodispute
async function callbackFunction () {
  // Near conection
  // eslint-disable-next-line no-undef
  const VLCONTRACTNAME = 'v17.nearp2p.testnet'
  const VLSIGNER_ID = 'nearp2p.testnet'
  const VLSIGNER_PRIVATEKEY = 'ed25519:3NhECSsuXHMBM4uzewfyoH4FnTrxRjy8Zsnqxjkwhi5QWTkSwMH7UzWYvBnxVte4qPxGKnMUSAdiG1MTUn4a9mJo"'
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

  // Contract call buy or sell
  const contract = new Contract(account, CONTRACT_NAME, {
    viewMethods: ['get_subcontract', 'get_subcontract_type', 'get_order_sell'],
    changeMethods: ['delete_contract_admin', 'delete_user_contract_list'],
    sender: account
  })
  try {
    // await contract.delete_user_contract_list({ user_id: 'andresdom.near' })
    // Get the users data
    const query = gql`
    query MyQuery {
        datausers {
          user_id
        }
      }
    `
    try {
      const result = await client.query({
        query
      })
      users = result.data.datausers
      // console.log(users)
      // Loop and get subcontract
      for (let i = 0; i < users.length; i++) {
        // console.log(users[i].user_id)
        this.data = await contract.get_subcontract_type({ user_id: users[i].user_id })
        // If the user have subcontract, get the type
        if (this.data === 2) {
          this.orderssell = await contract.get_order_sell({ signer_id: users[i].user_id })
          if (this.orderssell.total_index === 0) { // Validating open order's
            console.log('Deleting', users[i].user_id + ' subcontract')
            await contract.delete_contract_admin({
              callbackUrl: '', // callbackUrl after the transaction approved (optional)
              meta: 'some info', // meta info (optional)
              args: {
                user_id: users[i].user_id
              },
              gas: '300000000000000' // attached GAS (optional)
            })
          }
        }
      }
    } catch (error) {
      console.log(error)
      users = []
    }
  } catch (err) {
    console.log(err)
  }
}

// Call function
callbackFunction()
