const express = require('express')
const router = express.Router()
const { mailDispute } = require('../controllers/maildispute')


router.get('/dispute/:emails/:order/:type', mailDispute)

module.exports = router