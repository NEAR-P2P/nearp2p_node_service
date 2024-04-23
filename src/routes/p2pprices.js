const express = require('express')
const router = express.Router()
const { getp2pPrices } = require('../controllers/p2pprices')

router.post('/get-price', getp2pPrices)

module.exports = router