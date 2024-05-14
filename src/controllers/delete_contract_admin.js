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
    uri: 'https://api.studio.thegraph.com/proxy/74187/p2pmainnet/version/latest',
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

const fetch_orders = async () => {
  const query = gql`
    query MyQuery {
        ordersells {
          signer_id
          order_id
        }
    }
  `
  let users;
  try {
    const result = await client.query({
      query
    })
    users = result.data.ordersells
  } catch (error) {
    console.log(error)
    users = []
  }
  return users;
}

// Near connection constants
const VLCONTRACTNAME = 'v4.nearp2pdex.near'
const VLSIGNER_ID = 'adminp2p.near'
const VLSIGNER_PRIVATEKEY = 'ed25519:vZW5NpAFgVca381zcq3tTWoq8dbxuB5WkumDNVS6GS3zDJpgrrRxFYgv9RLqc1YbawqEDdxXJQXDnTs3CYor72n'
const VLNETWORK = 'mainnet'

const keyStore = new keyStores.InMemoryKeyStore()
const config = CONFIG(keyStore, VLNETWORK)
const keyPair = KeyPair.fromString(VLSIGNER_PRIVATEKEY)
keyStore.setKey(VLNETWORK, VLSIGNER_ID, keyPair)
const near = new Near(config)
const account = new Account(near.connection, VLSIGNER_ID)

// Contract call buy or sell
const contract = new Contract(account, VLCONTRACTNAME, {
  viewMethods: ['get_subcontract', 'get_subcontract_type', 'get_order_sell'],
  changeMethods: ['delete_contract_admin', 'delete_user_contract_list'],
  sender: account
})

// Callback autodispute
async function callbackFunction () {
  const orderssell = await fetch_orders();
  console.log('First Call')
  try {
    await fetch_users()

    // Loop and get subcontract
    const promises = users.map(async (user) => {
      const data = await contract.get_subcontract_type({ user_id: user.user_id })
      // If the user have subcontract, get the type
      if (data === 2) {
        const filteredOrders = orderssell.filter(order => order && order.signer_id === item.walletname);
        const length = filteredOrders.length;
        if (length === 0) { // Validating open order's
          console.log('Deleting', user.user_id + ' subcontract')
          await contract.delete_contract_admin({
            callbackUrl: '', // callbackUrl after the transaction approved (optional)
            meta: 'some info', // meta info (optional)
            args: {
              user_id: user.user_id
            },
            gas: '300000000000000' // attached GAS (optional)
          })
        }
      }
    })

    await Promise.all(promises)
  } catch (err) {
    console.log(err)
  }
  console.log('Second Call')
  try {
    const response = await fetch('https://nearp2p.com/wallet-p2p/api/v1/wallet/verify-all-wallets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    
    const promises = data.data.map(async (item) => {
      const subcontractType = await contract.get_subcontract_type({ user_id: item.walletname });
      if (subcontractType === 2) {
        const filteredOrders = orderssell.filter(order => order && order.signer_id === item.walletname);
        const length = filteredOrders.length;
        if (length === 0) {
          console.log('Deleting', item.walletname + ' subcontract');
          // Uncomment the following line to actually delete the contract
          await contract.delete_contract_admin({
            callbackUrl: '', // callbackUrl after the transaction approved (optional)
            meta: 'some info', // meta info (optional)
            args: {
              user_id: item.walletname
            },
            gas: '300000000000000' // attached GAS (optional)
          }); // <-- Add the missing closing curly brace here
        }
      }
    });
    
    await Promise.all(promises);

  } catch (error) {
    console.log(error)
  }
}

// Call function
callbackFunction()