const express = require('express')
const router = express.Router()
const { getUserNfts } = require('../controllers/list_nft_mintbase_graphql')

router.post('/get-user-nft', getUserNfts)

module.exports = router