const express = require('express')
const router = express.Router()
const { functionStorageDeposit } = require('../controllers/storage_deposit_testnet')

router.post('/testnet_enable_token', functionStorageDeposit)

module.exports = router