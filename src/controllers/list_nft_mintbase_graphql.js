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

const defaultOptions = {
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
};

const client = new ApolloClient({
  link: createHttpLink({
    uri: 'https://graph.mintbase.xyz/mainnet',
    headers: {
        'mb-api-key': 'anon'
      },
    fetch
  }),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
})


// Callback autodispute
const getUserNfts = async (req, res) => {
    const owner = req.body.owner; // Access the owner parameter from the request body
    try {
      // await contract.delete_user_contract_list({ user_id: 'andresdom.near' })
      // Get the users data
      const query = gql`
      query MyQuery (
        $owner: String!
       ){
        mb_views_nft_owned_tokens(
            where: {owner: {_eq: $owner}, burned_timestamp: {_is_null: true}}
            order_by: {last_transfer_timestamp: desc}
          ) {
            owner
            title
            token_id
            media
            nft_contract {
              base_uri
              name
            }
            nft_contract_id
            description
          }
        }
      `
      try {
        const result = await client.query({
            query: query,
            variables: {
              owner: owner
            }
          });
        res.json(result.data.mb_views_nft_owned_tokens)
        // console.log(nfts)
        
      } catch (error) {
        console.log(error)
      }
    } catch (err) {
      console.log(err)
    }
  }
  
  // Call function
  // callbackFunction()
  module.exports = { getUserNfts }