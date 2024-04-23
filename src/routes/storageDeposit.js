const express = require('express')
const router = express.Router()
const { functionStorageDeposit } = require('../controllers/storage_deposit')

router.post('/enable_token', functionStorageDeposit)

module.exports = router