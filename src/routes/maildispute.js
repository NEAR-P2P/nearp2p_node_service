const express = require('express')
const router = express.Router()
const { mailDispute } = require('../controllers/maildispute')

router.get('/dispute/:from/:to/:order/:type', mailDispute)

module.exports = router